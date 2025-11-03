import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, Download, CheckCircle, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useData } from '../../contexts/DataContext';

interface ImportItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ImportRow {
  name: string;
  description: string;
  category: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  quantity: number;
  tags: string;
  value?: number;
  location?: string;
}

export const ImportItemsModal: React.FC<ImportItemsModalProps> = ({ isOpen, onClose }) => {
  const { categories, addItem } = useData();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<ImportRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [successCount, setSuccessCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (selectedFile: File) => {
    if (!selectedFile) return;

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    
    if (!validTypes.includes(selectedFile.type)) {
      setErrorMessages(['Please select a valid Excel file (.xlsx, .xls) or CSV file']);
      setImportStatus('error');
      return;
    }

    setFile(selectedFile);
    setImportStatus('processing');
    setIsProcessing(true);

    try {
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Validate and transform data
      const validatedData = validateImportData(jsonData);
      setImportData(validatedData.validRows);
      
      if (validatedData.errors.length > 0) {
        setErrorMessages(validatedData.errors);
        setImportStatus('error');
      } else {
        setImportStatus('success');
      }
    } catch (error) {
      setErrorMessages(['Error reading file. Please ensure it\'s a valid Excel or CSV file.']);
      setImportStatus('error');
    }

    setIsProcessing(false);
  };

  const validateImportData = (data: any[]) => {
    const validRows: ImportRow[] = [];
    const errors: string[] = [];
    const categoryNames = categories.map(c => c.name.toLowerCase());

    data.forEach((row, index) => {
      const rowNum = index + 2; // +2 because Excel rows start at 1 and we assume headers at row 1
      
      // Check required fields
      if (!row.name || !row.description || !row.category) {
        errors.push(`Row ${rowNum}: Missing required fields (name, description, category)`);
        return;
      }

      // Validate category exists
      if (!categoryNames.includes(row.category.toLowerCase())) {
        errors.push(`Row ${rowNum}: Category "${row.category}" does not exist`);
        return;
      }

      // Validate condition
      const validConditions = ['excellent', 'good', 'fair', 'poor'];
      const condition = row.condition?.toLowerCase() || 'good';
      if (!validConditions.includes(condition)) {
        errors.push(`Row ${rowNum}: Invalid condition "${row.condition}". Must be: excellent, good, fair, or poor`);
        return;
      }

      // Validate quantity
      const quantity = parseInt(row.quantity) || 1;
      if (quantity < 1) {
        errors.push(`Row ${rowNum}: Quantity must be at least 1`);
        return;
      }

      validRows.push({
        name: row.name.toString().trim(),
        description: row.description.toString().trim(),
        category: row.category.toString().trim(),
        condition: condition as 'excellent' | 'good' | 'fair' | 'poor',
        quantity: quantity,
        tags: row.tags?.toString().trim() || '',
        value: parseFloat(row.value) || 0,
        location: row.location?.toString().trim() || 'Gudang'
      });
    });

    return { validRows, errors };
  };

  const handleImport = async () => {
    if (importData.length === 0) return;

    setIsProcessing(true);
    setImportStatus('processing');
    let successful = 0;
    const errors: string[] = [];

    for (const row of importData) {
      try {
        const itemData = {
          name: row.name,
          description: row.description,
          category: row.category,
          tags: row.tags ? row.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
          condition: row.condition,
          quantity: row.quantity,
          availableQuantity: row.quantity,
          location: row.location || 'Gudang',
          value: row.value || 0,
          qrCode: `QR${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          isActive: true
        };

        await addItem(itemData);
        successful++;
        
        // Small delay to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        errors.push(`Failed to import "${row.name}": ${error}`);
      }
    }

    setSuccessCount(successful);
    if (errors.length > 0) {
      setErrorMessages(errors);
      setImportStatus('error');
    } else {
      setImportStatus('success');
    }
    setIsProcessing(false);
  };

  const downloadTemplate = () => {
    const template = [
      {
        name: 'Sample Camera',
        description: 'Professional DSLR Camera for photography',
        category: 'Photography',
        condition: 'excellent',
        quantity: 2,
        tags: 'camera, photography, professional',
        value: 15000000,
        location: 'Gudang'
      },
      {
        name: 'Sample Laptop',
        description: 'High performance laptop for development',
        category: 'Electronics',
        condition: 'good',
        quantity: 1,
        tags: 'laptop, computer, development',
        value: 12000000,
        location: 'Gudang'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Items Template');
    XLSX.writeFile(wb, 'items_import_template.xlsx');
  };

  const resetModal = () => {
    setFile(null);
    setImportData([]);
    setImportStatus('idle');
    setErrorMessages([]);
    setSuccessCount(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Import Items from Excel</h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {importStatus === 'idle' && (
          <div className="space-y-6">
            {/* Download Template */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-900">Need a template?</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Download our Excel template with sample data and correct format
                  </p>
                </div>
                <button
                  onClick={downloadTemplate}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download size={16} />
                  <span>Download Template</span>
                </button>
              </div>
            </div>

            {/* Required Format Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Required Excel Columns:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-red-600">*name</span> - Item name
                </div>
                <div>
                  <span className="font-medium text-red-600">*description</span> - Item description
                </div>
                <div>
                  <span className="font-medium text-red-600">*category</span> - Must match existing categories
                </div>
                <div>
                  <span className="font-medium">condition</span> - excellent, good, fair, poor
                </div>
                <div>
                  <span className="font-medium">quantity</span> - Number (default: 1)
                </div>
                <div>
                  <span className="font-medium">tags</span> - Comma separated
                </div>
                <div>
                  <span className="font-medium">value</span> - Item value in rupiah
                </div>
                <div>
                  <span className="font-medium">location</span> - Storage location
                </div>
              </div>
              <p className="text-xs text-red-600 mt-2">* Required fields</p>
            </div>

            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
              
              <FileSpreadsheet size={48} className="mx-auto text-gray-400 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Drop your Excel file here
              </h4>
              <p className="text-gray-600 mb-4">
                or click to browse (.xlsx, .xls, .csv files)
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                <Upload size={20} className="inline-block mr-2" />
                Select File
              </button>
            </div>
          </div>
        )}

        {importStatus === 'processing' && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Processing file...</p>
          </div>
        )}

        {importStatus === 'error' && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <AlertCircle size={20} className="text-red-600 mr-2" />
                <h4 className="font-medium text-red-900">Import Errors</h4>
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                {errorMessages.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={resetModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {importStatus === 'success' && importData.length > 0 && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CheckCircle size={20} className="text-green-600 mr-2" />
                <h4 className="font-medium text-green-900">Ready to Import</h4>
              </div>
              <p className="text-sm text-green-700">
                {importData.length} items ready to be imported
              </p>
            </div>

            {/* Preview Data */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b">
                <h4 className="font-medium text-gray-900">Preview ({importData.length} items)</h4>
              </div>
              <div className="overflow-x-auto max-h-64">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left">Name</th>
                      <th className="px-3 py-2 text-left">Category</th>
                      <th className="px-3 py-2 text-left">Condition</th>
                      <th className="px-3 py-2 text-left">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importData.slice(0, 10).map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-3 py-2">{item.name}</td>
                        <td className="px-3 py-2">{item.category}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.condition === 'excellent' ? 'bg-green-100 text-green-800' :
                            item.condition === 'good' ? 'bg-slate-100 text-slate-800' :
                            item.condition === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.condition}
                          </span>
                        </td>
                        <td className="px-3 py-2">{item.quantity}</td>
                      </tr>
                    ))}
                    {importData.length > 10 && (
                      <tr>
                        <td colSpan={4} className="px-3 py-2 text-center text-gray-500">
                          ... and {importData.length - 10} more items
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={resetModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={isProcessing}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                  isProcessing 
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isProcessing ? 'Importing...' : `Import ${importData.length} Items`}
              </button>
            </div>
          </div>
        )}

        {importStatus === 'success' && successCount > 0 && importData.length === 0 && (
          <div className="text-center py-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
              <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-green-900 mb-2">Import Successful!</h4>
              <p className="text-green-700">
                Successfully imported {successCount} items
              </p>
            </div>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
