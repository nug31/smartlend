import React, { useState } from 'react';
import { Search, Filter, CheckCircle, X, Clock, AlertTriangle, Eye, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Loan } from '../../types';
import { exportLoansData } from '../../utils/exportUtils';

export const ManageLoans: React.FC = () => {
  const { loans, getItemById, approveLoan, rejectLoan, returnItem } = useData();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const filteredLoans = loans.filter(loan => {
    const item = getItemById(loan.itemId);
    const matchesSearch = item?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         loan.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         loan.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-slate-100 text-slate-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'overdue': return <AlertTriangle size={16} />;
      case 'returned': return <CheckCircle size={16} />;
      case 'cancelled': return <X size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const handleApprove = (loanId: string) => {
    console.log('🔄 Approving loan:', { loanId, userId: user?.id, user });
    approveLoan(loanId, user?.id);
  };

  const handleReject = (loanId: string) => {
    rejectLoan(loanId);
  };

  const handleReturn = (loanId: string) => {
    returnItem(loanId);
  };

  const showDetails = (loan: Loan) => {
    setSelectedLoan(loan);
    setShowDetailsModal(true);
  };

  const getDaysOverdue = (endDate: string | Date) => {
    const today = new Date();
    const endDateObj = new Date(endDate);
    const diffTime = today.getTime() - endDateObj.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    exportLoansData(filteredLoans, format);
    setShowExportMenu(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage Loans</h1>
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            <Download size={20} />
            <span>Export Report</span>
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-2">
                <button
                  onClick={() => handleExport('excel')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center space-x-2"
                >
                  <FileSpreadsheet size={16} />
                  <span>Export to Excel</span>
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center space-x-2"
                >
                  <FileText size={16} />
                  <span>Export to PDF</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search loans by item name or user name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="overdue">Overdue</option>
            <option value="returned">Returned</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLoans.map((loan) => {
                const item = getItemById(loan.itemId);
                const isOverdue = loan.status === 'overdue';
                const daysOverdue = isOverdue ? getDaysOverdue(loan.endDate) : 0;
                
                return (
                  <tr key={loan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                          <CheckCircle size={20} className="text-gray-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {loan.item?.name || item?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {loan.item?.category || item?.category}
                          </div>
                          {loan.item?.location && (
                            <div className="text-xs text-gray-400">📍 {loan.item.location}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-gray-600">
                            {loan.user?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {loan.user?.name || `User #${loan.userId}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {loan.user?.email}
                          </div>
                          {loan.user?.department && (
                            <div className="text-xs text-gray-400">🏢 {loan.user.department}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${getStatusColor(loan.status)}`}>
                        {getStatusIcon(loan.status)}
                        <span className="capitalize">{loan.status}</span>
                      </span>
                      {isOverdue && (
                        <div className="text-xs text-orange mt-1">
                          {daysOverdue} days overdue
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>Start: {new Date(loan.startDate).toLocaleDateString()}</div>
                      <div>End: {new Date(loan.endDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {loan.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => showDetails(loan)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        
                        {loan.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(loan.id)}
                              className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(loan.id)}
                              className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        
                        {(loan.status === 'active' || loan.status === 'overdue') && (
                          <button
                            onClick={() => handleReturn(loan.id)}
                            className="px-2 py-1 bg-gray-800 text-white text-xs rounded hover:bg-gray-900 transition-colors"
                          >
                            Mark Returned
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Loan Details Modal */}
      {showDetailsModal && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Loan Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Loan Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-500">Borrower:</span> {selectedLoan.user?.name || `User #${selectedLoan.userId}`}</div>
                    {selectedLoan.user?.email && (
                      <div><span className="text-gray-500">Email:</span> {selectedLoan.user.email}</div>
                    )}
                    {selectedLoan.user?.department && (
                      <div><span className="text-gray-500">Department:</span> {selectedLoan.user.department}</div>
                    )}
                    <div><span className="text-gray-500">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedLoan.status)}`}>
                        {selectedLoan.status}
                      </span>
                    </div>
                    <div><span className="text-gray-500">Quantity:</span> {selectedLoan.quantity}</div>
                    {selectedLoan.purpose && (
                      <div><span className="text-gray-500">Purpose:</span> {selectedLoan.purpose}</div>
                    )}
                    {selectedLoan.approvedAt && (
                      <div><span className="text-gray-500">Approved:</span> {new Date(selectedLoan.approvedAt).toLocaleDateString()}</div>
                    )}

                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-500">Start Date:</span> {new Date(selectedLoan.startDate).toLocaleDateString()}</div>
                    <div><span className="text-gray-500">Start Time:</span> {new Date(selectedLoan.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div><span className="text-gray-500">End Date:</span> {new Date(selectedLoan.endDate).toLocaleDateString()}</div>
                    <div><span className="text-gray-500">End Time:</span> {new Date(selectedLoan.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    {selectedLoan.actualReturnDate && (
                      <div><span className="text-gray-500">Returned:</span> {new Date(selectedLoan.actualReturnDate).toLocaleDateString()} {new Date(selectedLoan.actualReturnDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    )}
                    <div><span className="text-gray-500">Reminders Sent:</span> {selectedLoan.remindersSent}</div>
                  </div>
                </div>
              </div>
              
              {selectedLoan.notes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedLoan.notes}
                  </p>
                </div>
              )}
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};