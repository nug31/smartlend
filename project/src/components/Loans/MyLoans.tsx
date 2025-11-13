import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Package, AlertTriangle, CheckCircle, X, RotateCcw, Eye, Download } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useNotifications, LoanStatusUpdate } from '../../contexts/NotificationContext';
import { Loan } from '../../types';

export const MyLoans: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { getUserLoans, getItemById, returnItem, requestExtension } = useData();
  const { subscribeLoanUpdates, addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'history'>('active');
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const userLoans = getUserLoans(user?.id || '');
  const activeLoans = userLoans.filter(loan => loan.status === 'active');
  const pendingLoans = userLoans.filter(loan => loan.status === 'pending');
  const historyLoans = userLoans.filter(loan => ['returned', 'cancelled'].includes(loan.status));

  // Subscribe to real-time loan updates
  useEffect(() => {
    const unsubscribe = subscribeLoanUpdates((update: LoanStatusUpdate) => {
      console.log('📡 MyLoans received loan update:', update);

      // Trigger a re-render to reflect updated loan status
      setRefreshTrigger(prev => prev + 1);

      // Show notification for current user's loans
      if (update.userId === user?.id) {
        if (update.oldStatus === 'pending' && update.newStatus === 'active') {
          addNotification({
            type: 'success',
            title: 'Loan Approved! 🎉',
            message: `Your request for "${update.itemName}" has been approved and is now active.`,
            duration: 8000
          });
        } else if (update.oldStatus === 'pending' && update.newStatus === 'cancelled') {
          addNotification({
            type: 'warning',
            title: 'Loan Request Rejected',
            message: `Your request for "${update.itemName}" has been rejected. Please contact admin for more information.`,
            duration: 8000
          });
        }
      }

      // Show notification to admin when user returns item
      if (isAdmin && update.oldStatus === 'active' && update.newStatus === 'returned') {
        addNotification({
          type: 'info',
          title: 'Barang Dikembalikan 📦',
          message: `${update.userName} telah mengembalikan "${update.itemName}". Silakan verifikasi.`,
          duration: 10000
        });
      }
    });

    return unsubscribe;
  }, [subscribeLoanUpdates, user?.id, isAdmin, addNotification]);

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
      case 'returned': return <Package size={16} />;
      case 'cancelled': return <X size={16} />;
      default: return <Package size={16} />;
    }
  };

  const getDaysUntilDue = (endDate: string | Date) => {
    const today = new Date();
    const endDateObj = new Date(endDate);
    const diffTime = endDateObj.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleReturn = (loan: Loan) => {
    setSelectedLoan(loan);
    setShowReturnModal(true);
  };

  const handleExtension = (loan: Loan) => {
    setSelectedLoan(loan);
    setShowExtensionModal(true);
  };

  const showDetails = (loan: Loan) => {
    setSelectedLoan(loan);
    setShowDetailsModal(true);
  };

  const confirmReturn = () => {
    if (selectedLoan) {
      returnItem(selectedLoan.id);
      setShowReturnModal(false);
      setSelectedLoan(null);
    }
  };

  const confirmExtension = () => {
    if (selectedLoan) {
      requestExtension(selectedLoan.id, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
      setShowExtensionModal(false);
      setSelectedLoan(null);
    }
  };

  const LoanCard: React.FC<{ loan: Loan }> = ({ loan }) => {
    const item = loan.item || getItemById(loan.itemId);
    const daysUntilDue = getDaysUntilDue(loan.endDate);

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <Package size={32} className="text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{item?.name}</h3>
              <p className="text-sm text-gray-600">{item?.category}</p>
              {item?.location && (
                <p className="text-xs text-gray-500">📍 {item.location}</p>
              )}
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(loan.status)}`}>
                  {getStatusIcon(loan.status)}
                  <span className="capitalize">{loan.status}</span>
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">Quantity: {loan.quantity}</p>
            <p className="text-sm text-gray-500">
              Due: {new Date(loan.endDate).toLocaleDateString()}
            </p>
            {loan.status === 'active' && (
              <p className={`text-sm font-medium ${
                daysUntilDue <= 0 ? 'text-red-600' : ''
              }`}>
                {daysUntilDue <= 0 ? 'Overdue' : ''}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {loan.purpose && <p>Purpose: {loan.purpose}</p>}
              {loan.notes && <p>Notes: {loan.notes}</p>}
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => showDetails(loan)}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Eye size={16} />
              </button>
              
              {loan.status === 'active' && (
                <>
                  <button
                    onClick={() => handleExtension(loan)}
                    className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 transition-colors flex items-center space-x-1"
                  >
                    <RotateCcw size={14} />
                    <span>Extend</span>
                  </button>
                  <button
                    onClick={() => handleReturn(loan)}
                    style={{ backgroundColor: '#E9631A', color: '#FFFFFF' }}
                    className="px-3 py-1 text-sm rounded-md hover:shadow-lg transition-all flex items-center space-x-1"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C54A0A'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E9631A'}
                  >
                    <CheckCircle size={14} />
                    <span>Sudah Mengembalikan</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const currentLoans = activeTab === 'active' ? activeLoans : 
                     activeTab === 'pending' ? pendingLoans : historyLoans;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Loans</h1>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors">
          <Download size={20} />
          <span>Export Report</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          {[
            { key: 'active', label: 'Active Loans', count: activeLoans.length },
            { key: 'pending', label: 'Pending', count: pendingLoans.length },
            { key: 'history', label: 'History', count: historyLoans.length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-gray-800 border-b-2 border-gray-800 bg-gray-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Loans List */}
      {currentLoans.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab} loans found
          </h3>
          <p className="text-gray-600">
            {activeTab === 'active' && "You don't have any active loans at the moment."}
            {activeTab === 'pending' && "You don't have any pending loan requests."}
            {activeTab === 'history' && "You haven't completed any loans yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentLoans.map(loan => (
            <LoanCard key={loan.id} loan={loan} />
          ))}
        </div>
      )}

      {/* Return Confirmation Modal */}
      {showReturnModal && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Konfirmasi Pengembalian
            </h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda sudah mengembalikan "{getItemById(selectedLoan.itemId)?.name}"?
              {!isAdmin && (
                <span className="block mt-2 text-sm text-orange-600">
                  ⚠️ Pastikan barang sudah dikembalikan ke admin sebelum konfirmasi.
                </span>
              )}
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowReturnModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmReturn}
                style={{ backgroundColor: '#E9631A', color: '#FFFFFF' }}
                className="flex-1 px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C54A0A'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E9631A'}
              >
                Ya, Sudah Dikembalikan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extension Modal */}
      {showExtensionModal && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Extension</h3>
            <p className="text-gray-600 mb-6">
              Request a 7-day extension for "{getItemById(selectedLoan.itemId)?.name}"?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowExtensionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmExtension}
                className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Request Extension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loan Details Modal */}
      {showDetailsModal && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Loan Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Item Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Item Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Item Name</p>
                    <p className="font-medium text-gray-900">{getItemById(selectedLoan.itemId)?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-medium text-gray-900">{getItemById(selectedLoan.itemId)?.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">{getItemById(selectedLoan.itemId)?.location || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Quantity Borrowed</p>
                    <p className="font-medium text-gray-900">{selectedLoan.quantity}</p>
                  </div>
                </div>
              </div>
              
              {/* Loan Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Loan Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Loan ID</p>
                    <p className="font-medium text-gray-900 font-mono text-sm">{selectedLoan.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedLoan.status)}`}>
                      {getStatusIcon(selectedLoan.status)}
                      <span className="capitalize">{selectedLoan.status}</span>
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-medium text-gray-900">{new Date(selectedLoan.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Due Date</p>
                    <p className="font-medium text-gray-900">{new Date(selectedLoan.endDate).toLocaleDateString()}</p>
                  </div>
                  {selectedLoan.status === 'active' && (
                    <div>
                      <p className="text-sm text-gray-600">Days Until Due</p>
                      <p className={`font-medium ${
                        getDaysUntilDue(selectedLoan.endDate) <= 0 ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {getDaysUntilDue(selectedLoan.endDate) <= 0 
                          ? `Overdue by ${Math.abs(getDaysUntilDue(selectedLoan.endDate))} days`
                          : `${getDaysUntilDue(selectedLoan.endDate)} days remaining`
                        }
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Created Date</p>
                    <p className="font-medium text-gray-900">{new Date(selectedLoan.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              {/* Purpose and Notes */}
              {(selectedLoan.purpose || selectedLoan.notes) && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Additional Information</h4>
                  <div className="space-y-3">
                    {selectedLoan.purpose && (
                      <div>
                        <p className="text-sm text-gray-600">Purpose</p>
                        <p className="font-medium text-gray-900">{selectedLoan.purpose}</p>
                      </div>
                    )}
                    {selectedLoan.notes && (
                      <div>
                        <p className="text-sm text-gray-600">Notes</p>
                        <p className="font-medium text-gray-900">{selectedLoan.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {selectedLoan.status === 'active' && (
                  <>
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        handleExtension(selectedLoan);
                      }}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
                    >
                      <RotateCcw size={16} />
                      <span>Request Extension</span>
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setShowDetailsModal(false);
                          handleReturn(selectedLoan);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Mark as Returned
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};