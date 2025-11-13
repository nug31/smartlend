import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Package, AlertTriangle, CheckCircle, X, RotateCcw, Eye, Download, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useNotifications, LoanStatusUpdate } from '../../contexts/NotificationContext';
import { Loan } from '../../types';

export const MyLoans: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { getUserLoans, getItemById, returnItem, requestExtension, rejectLoan } = useData();
  const { subscribeLoanUpdates, addNotification } = useNotifications();
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const userLoans = getUserLoans(user?.id || '');
  const activeLoans = userLoans.filter(loan => loan.status === 'active');
  const pendingLoans = userLoans.filter(loan => loan.status === 'pending');
  const historyLoans = userLoans.filter(loan => ['returned', 'cancelled'].includes(loan.status));

  // Auto-switch to pending tab if there are new pending loans and no active loans
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'history'>('active');
  const [previousPendingCount, setPreviousPendingCount] = useState(0);

  // Auto-switch to pending tab when new pending loan is added
  useEffect(() => {
    if (pendingLoans.length > previousPendingCount && pendingLoans.length > 0) {
      console.log('🔔 New pending loan detected, switching to pending tab');
      setActiveTab('pending');
    }
    setPreviousPendingCount(pendingLoans.length);
  }, [pendingLoans.length]);

  // Subscribe to real-time loan updates
  useEffect(() => {
    const unsubscribe = subscribeLoanUpdates((update: LoanStatusUpdate) => {
      console.log('📡 MyLoans received loan update:', update);

      // Trigger a re-render to reflect updated loan status
      setRefreshTrigger(prev => prev + 1);

      // Show notification for current user's loans
      if (update.userId === user?.id) {
        if (update.oldStatus === 'pending' && update.newStatus === 'active') {
          // Auto-switch to active tab when loan is approved
          setActiveTab('active');
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

  const handleCancel = (loan: Loan) => {
    setSelectedLoan(loan);
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    if (selectedLoan) {
      try {
        await rejectLoan(selectedLoan.id);
        setShowCancelModal(false);
        setSelectedLoan(null);

        addNotification({
          type: 'info',
          title: 'Request Cancelled',
          message: `Your request for "${getItemById(selectedLoan.itemId)?.name}" has been cancelled.`,
          duration: 5000
        });
      } catch (error) {
        console.error('Error cancelling loan:', error);
        addNotification({
          type: 'error',
          title: 'Cancellation Failed',
          message: 'Failed to cancel the request. Please try again.',
          duration: 5000
        });
      }
    }
  };

  const LoanCard: React.FC<{ loan: Loan }> = ({ loan }) => {
    const item = loan.item || getItemById(loan.itemId);
    const daysUntilDue = getDaysUntilDue(loan.endDate);

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
        {/* Mobile-optimized header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Package size={28} className="text-gray-400 sm:w-8 sm:h-8" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{item?.name}</h3>
              <p className="text-sm text-gray-600">{item?.category}</p>
              {item?.location && (
                <p className="text-xs text-gray-500 mt-0.5">📍 {item.location}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(loan.status)}`}>
                  {getStatusIcon(loan.status)}
                  <span className="capitalize">{loan.status}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Mobile-optimized info */}
          <div className="flex sm:flex-col gap-4 sm:gap-1 text-sm sm:text-right">
            <div>
              <p className="text-gray-500">Qty: <span className="font-medium text-gray-900">{loan.quantity}</span></p>
            </div>
            <div>
              <p className="text-gray-500">Due: <span className="font-medium text-gray-900">{new Date(loan.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span></p>
            </div>
            {loan.status === 'active' && daysUntilDue <= 0 && (
              <p className="text-sm font-medium text-red-600">Overdue</p>
            )}
          </div>
        </div>

        {/* Purpose/Notes - Mobile optimized */}
        {(loan.purpose || loan.notes) && (
          <div className="mb-3 pb-3 border-b border-gray-200">
            <div className="text-sm text-gray-600 space-y-1">
              {loan.purpose && <p className="line-clamp-2"><span className="font-medium">Purpose:</span> {loan.purpose}</p>}
              {loan.notes && <p className="line-clamp-2"><span className="font-medium">Notes:</span> {loan.notes}</p>}
            </div>
          </div>
        )}

        {/* Mobile-optimized action buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => showDetails(loan)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium min-h-[44px]"
          >
            <Eye size={16} />
            <span>Details</span>
          </button>

          {loan.status === 'pending' && (
            <button
              onClick={() => handleCancel(loan)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium min-h-[44px]"
            >
              <XCircle size={16} />
              <span>Cancel</span>
            </button>
          )}

          {loan.status === 'active' && (
            <>
              <button
                onClick={() => handleExtension(loan)}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium min-h-[44px]"
              >
                <RotateCcw size={16} />
                <span>Extend</span>
              </button>
              <button
                onClick={() => handleReturn(loan)}
                style={{ backgroundColor: '#E9631A', color: '#FFFFFF' }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg hover:shadow-lg transition-all text-sm font-medium min-h-[44px]"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C54A0A'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E9631A'}
              >
                <CheckCircle size={16} />
                <span className="hidden sm:inline">Sudah Mengembalikan</span>
                <span className="sm:hidden">Kembalikan</span>
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  const currentLoans = activeTab === 'active' ? activeLoans : 
                     activeTab === 'pending' ? pendingLoans : historyLoans;

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-6">
      {/* Mobile-optimized header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Loans</h1>
        <button className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors">
          <Download size={20} />
          <span>Export Report</span>
        </button>
      </div>

      {/* Mobile-optimized tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {[
            { key: 'active', label: 'Active', fullLabel: 'Active Loans', count: activeLoans.length },
            { key: 'pending', label: 'Pending', fullLabel: 'Pending', count: pendingLoans.length },
            { key: 'history', label: 'History', fullLabel: 'History', count: historyLoans.length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={
                activeTab === tab.key
                  ? { color: '#E9631A', borderBottomColor: '#E9631A', backgroundColor: '#FFF5F0' }
                  : {}
              }
              className={`flex-1 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-all relative min-h-[56px] ${
                activeTab === tab.key
                  ? 'border-b-2 font-semibold'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                <span className="hidden sm:inline">{tab.fullLabel}</span>
                <span className="sm:hidden">{tab.label}</span>
                <span
                  style={
                    tab.key === 'pending' && tab.count > 0
                      ? { backgroundColor: '#E9631A', color: '#FFFFFF' }
                      : { backgroundColor: '#E5E7EB', color: '#6B7280' }
                  }
                  className={`inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-bold ${
                    tab.key === 'pending' && tab.count > 0 ? 'animate-pulse' : ''
                  }`}
                >
                  {tab.count}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile-optimized loans list */}
      {currentLoans.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 text-center py-12 sm:py-16 px-4">
          <Package className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            No {activeTab} loans found
          </h3>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
            {activeTab === 'active' && "You don't have any active loans at the moment."}
            {activeTab === 'pending' && "You don't have any pending loan requests."}
            {activeTab === 'history' && "You haven't completed any loans yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {currentLoans.map(loan => (
            <LoanCard key={loan.id} loan={loan} />
          ))}
        </div>
      )}

      {/* Mobile-optimized Return Confirmation Modal */}
      {showReturnModal && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-5 sm:p-6 w-full max-w-md">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
              Konfirmasi Pengembalian
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6">
              Apakah Anda sudah mengembalikan "<span className="font-medium">{getItemById(selectedLoan.itemId)?.name}</span>"?
              {!isAdmin && (
                <span className="block mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700">
                  ⚠️ Pastikan barang sudah dikembalikan ke admin sebelum konfirmasi.
                </span>
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => setShowReturnModal(false)}
                className="flex-1 px-4 py-3 sm:py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base min-h-[48px]"
              >
                Batal
              </button>
              <button
                onClick={confirmReturn}
                style={{ backgroundColor: '#E9631A', color: '#FFFFFF' }}
                className="flex-1 px-4 py-3 sm:py-2.5 rounded-lg hover:shadow-lg transition-all font-medium text-sm sm:text-base min-h-[48px]"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C54A0A'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E9631A'}
              >
                Ya, Sudah Dikembalikan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile-optimized Cancel Request Modal */}
      {showCancelModal && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-5 sm:p-6 w-full max-w-md">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
              Cancel Loan Request
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6">
              Are you sure you want to cancel your request for "<span className="font-medium">{getItemById(selectedLoan.itemId)?.name}</span>"?
              <span className="block mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                ⚠️ This action cannot be undone. You will need to submit a new request if you change your mind.
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-3 sm:py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base min-h-[48px]"
              >
                Keep Request
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 px-4 py-3 sm:py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm sm:text-base min-h-[48px]"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile-optimized Extension Modal */}
      {showExtensionModal && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-5 sm:p-6 w-full max-w-md">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Request Extension</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6">
              Request a 7-day extension for "<span className="font-medium">{getItemById(selectedLoan.itemId)?.name}</span>"?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => setShowExtensionModal(false)}
                className="flex-1 px-4 py-3 sm:py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base min-h-[48px]"
              >
                Cancel
              </button>
              <button
                onClick={confirmExtension}
                className="flex-1 px-4 py-3 sm:py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium text-sm sm:text-base min-h-[48px]"
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