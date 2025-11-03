import { Loan, Item, User } from '../types';

// Simple CSV export function (works without external libraries)
export const exportToCSV = (data: any[], filename: string, headers: string[]) => {
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = getNestedValue(row, header);
        // Escape commas and quotes in CSV
        return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(',')
    )
  ].join('\n');

  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
};

// Excel-like export using CSV format
export const exportToExcel = (data: any[], filename: string, headers: string[]) => {
  exportToCSV(data, filename, headers);
};

// Simple PDF export using HTML to PDF conversion
export const exportToPDF = (data: any[], filename: string, headers: string[], title: string) => {
  const htmlContent = generateHTMLTable(data, headers, title);
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #2563EB; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            tr:nth-child(even) { background-color: #f8f9fa; }
            .export-date { color: #666; font-size: 12px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div class="export-date">Generated on: ${new Date().toLocaleString()}</div>
          ${htmlContent}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
};

// Helper function to get nested object values
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj) || '';
};

// Generate HTML table from data
const generateHTMLTable = (data: any[], headers: string[], title: string): string => {
  const headerRow = headers.map(header => `<th>${formatHeader(header)}</th>`).join('');
  const dataRows = data.map(row => 
    `<tr>${headers.map(header => `<td>${getNestedValue(row, header)}</td>`).join('')}</tr>`
  ).join('');
  
  return `
    <table>
      <thead>
        <tr>${headerRow}</tr>
      </thead>
      <tbody>
        ${dataRows}
      </tbody>
    </table>
  `;
};

// Format header names for display
const formatHeader = (header: string): string => {
  const headerMap: { [key: string]: string } = {
    'user.name': 'User Name',
    'item.name': 'Item Name',
    'startDate': 'Start Date',
    'endDate': 'End Date',
    'createdAt': 'Created Date',
    'availableQuantity': 'Available Quantity',
    'phoneNumber': 'Phone Number',
    'isActive': 'Status'
  };

  return headerMap[header] || header
    .split('.')
    .pop()
    ?.replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase()) || header;
};

// Download file helper
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Specific export functions for different data types
export const exportLoansData = (loans: Loan[], format: 'excel' | 'pdf' = 'excel') => {
  const headers = [
    'user.name',
    'item.name',
    'quantity',
    'status',
    'startDate',
    'endDate',
    'purpose'
  ];
  
  const formattedData = loans.map(loan => ({
    ...loan,
    startDate: new Date(loan.startDate).toLocaleDateString(),
    endDate: new Date(loan.endDate).toLocaleDateString(),
    actualReturnDate: loan.actualReturnDate ? new Date(loan.actualReturnDate).toLocaleDateString() : ''
  }));

  if (format === 'excel') {
    exportToExcel(formattedData, 'loans-report', headers);
  } else {
    exportToPDF(formattedData, 'loans-report', headers, 'Loans Report');
  }
};

export const exportItemsData = (items: Item[], format: 'excel' | 'pdf' = 'excel') => {
  const headers = [
    'name',
    'category',
    'condition',
    'quantity',
    'availableQuantity',
    'location',
    'value',
    'createdAt'
  ];
  
  const formattedData = items.map(item => ({
    ...item,
    value: item.value ? `$${item.value.toLocaleString()}` : 'N/A',
    createdAt: new Date(item.createdAt).toLocaleDateString(),
    tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags
  }));

  if (format === 'excel') {
    exportToExcel(formattedData, 'items-report', headers);
  } else {
    exportToPDF(formattedData, 'items-report', headers, 'Items Report');
  }
};

export const exportUsersData = (users: User[], format: 'excel' | 'pdf' = 'excel') => {
  const headers = [
    'name',
    'email',
    'phoneNumber',
    'department',
    'role',
    'isActive',
    'createdAt'
  ];
  
  const formattedData = users.map(user => ({
    ...user,
    name: `${user.firstName} ${user.lastName}`,
    phoneNumber: user.phoneNumber || 'N/A',
    createdAt: new Date(user.createdAt).toLocaleDateString(),
    isActive: user.isActive ? 'Active' : 'Inactive'
  }));

  if (format === 'excel') {
    exportToExcel(formattedData, 'users-report', headers);
  } else {
    exportToPDF(formattedData, 'users-report', headers, 'Users Report');
  }
};
