import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider, useData } from './contexts/DataContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ToastContainer } from './components/UI/Toast';
import { LoadingScreen } from './components/LoadingScreen';

// Version 1.0.1 - Fixed translation errors by removing i18n completely
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Layout } from './components/Layout/Layout';
// import { Dashboard } from './components/Dashboard/Dashboard';
import { ItemCatalog } from './components/Catalog/ItemCatalog';
import { MyLoans } from './components/Loans/MyLoans';
import { ManageItems } from './components/Admin/ManageItems';
import { ManageLoans } from './components/Admin/ManageLoans';
import { ManageUsers } from './components/Admin/ManageUsers';
import ManageCategories from './components/Admin/ManageCategories';
import { Settings } from './components/Settings/Settings';
import { Package, FileText, Clock, AlertTriangle, TrendingUp, Calendar, Users, CheckCircle } from 'lucide-react';

// Temporary inline Dashboard component
const Dashboard: React.FC<{ onTabChange: (tab: string) => void }> = ({ onTabChange }) => {
  const { user, isAdmin } = useAuth();
  const { dashboardStats, loans, getUserLoans, getOverdueLoans } = useData();

  const userLoans = getUserLoans(user?.id || '');
  const overdueLoans = getOverdueLoans();
  const activeUserLoans = userLoans.filter(loan => loan.status === 'active');
  const pendingUserLoans = userLoans.filter(loan => loan.status === 'pending');

  console.log('🔍 Dashboard render - user:', user?.id, user?.role);
  console.log('🔍 Dashboard render - isAdmin:', isAdmin);
  console.log('🔍 Dashboard render - dashboardStats:', dashboardStats);
  console.log('🔍 Dashboard render - userLoans:', userLoans.length);
  console.log('🔍 Dashboard render - pendingUserLoans:', pendingUserLoans.length);
  console.log('🔍 Dashboard render - all loans:', loans.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-flash-white via-flash-white-light to-flash-white-dark pb-20 sm:pb-6">
      <div className="space-y-4 sm:space-y-6 lg:space-y-8 p-3 sm:p-4 lg:p-6">
        {/* Mobile-optimized Welcome Header */}
        <div className="relative overflow-hidden glass-premium rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 animate-entry delay-0">
          <div className="absolute inset-0 bg-gradient-to-r from-orange/10 to-dark-slate/10"></div>
          <div className="relative">
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold gradient-text">
                Welcome, {user?.firstName || user?.name || user?.email?.split('@')[0] || 'User'}! 👋
              </h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                {isAdmin
                  ? "Here's what's happening with your loans and items today."
                  : "Here's an overview of your personal loan activity."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Mobile-optimized Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <div className="glass-premium rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 animate-entry delay-100 card-hover">
            <div className="flex items-center justify-between">
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  {isAdmin ? 'Total Items' : 'My Total Loans'}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {isAdmin ? dashboardStats?.totalItems || 0 : userLoans.length}
                </p>
              </div>
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-dark-slate shadow-lg shadow-glow-green">
                <Package size={24} className="text-white sm:w-7 sm:h-7" />
              </div>
            </div>
          </div>
          <div className="glass-premium rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 animate-entry delay-200 card-hover">
            <div className="flex items-center justify-between">
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  {isAdmin ? 'Active Loans' : 'My Active Loans'}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{isAdmin ? dashboardStats?.activeLoans || 0 : activeUserLoans.length}</p>
              </div>
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-dark-slate shadow-lg shadow-glow-green">
                <FileText size={24} className="text-white sm:w-7 sm:h-7" />
              </div>
            </div>
          </div>
          <div className="glass-premium rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 sm:col-span-2 lg:col-span-1 animate-entry delay-300 card-hover">
            <div className="flex items-center justify-between">
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  {isAdmin ? 'Pending Requests' : 'My Pending Requests'}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{isAdmin ? dashboardStats?.pendingRequests || 0 : pendingUserLoans.length}</p>
              </div>
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-orange shadow-lg shadow-glow">
                <Clock size={24} className="text-white sm:w-7 sm:h-7" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-optimized Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <div className="glass-premium rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 animate-entry delay-400">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">Loan Trends</h3>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <TrendingUp className="text-orange" size={16} />
                <span className="text-xs sm:text-sm font-semibold text-orange">7 days</span>
              </div>
            </div>

            <div className="h-48 flex items-end justify-between space-x-2 mb-4">
              {Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                const dayLoans = loans.filter(loan => {
                  try {
                    // Try both requestedAt and createdAt fields
                    const loanDate = new Date(loan.requestedAt || loan.createdAt);
                    if (isNaN(loanDate.getTime())) return false;
                    return loanDate.toDateString() === date.toDateString();
                  } catch (error) {
                    return false;
                  }
                });

                // Calculate max loans across all 7 days for proper scaling
                const allDayCounts = Array.from({ length: 7 }, (_, j) => {
                  const d = new Date();
                  d.setDate(d.getDate() - (6 - j));
                  return loans.filter(l => {
                    try {
                      // Try both requestedAt and createdAt fields
                      const loanDate = new Date(l.requestedAt || l.createdAt);
                      if (isNaN(loanDate.getTime())) return false;
                      return loanDate.toDateString() === d.toDateString();
                    } catch (error) {
                      return false;
                    }
                  }).length;
                });
                const maxLoans = Math.max(...allDayCounts, 3); // Minimum 3 for better visibility

                const requested = dayLoans.filter(l => l.status === 'pending').length;
                const approved = dayLoans.filter(l => l.status === 'active' || l.status === 'approved').length;
                const returned = dayLoans.filter(l => l.status === 'returned').length;
                const totalDay = requested + approved + returned;

                return (
                  <div key={i} className="flex-1 flex flex-col items-center group">
                    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-lg border-x border-t border-gray-200 p-1 mb-2 min-h-[120px] flex flex-col justify-end relative overflow-hidden">
                      {/* Background grid lines for better visualization */}
                      <div className="absolute inset-0 opacity-20">
                        {[...Array(4)].map((_, idx) => (
                          <div key={idx} className="absolute w-full border-t border-gray-300" style={{ bottom: `${(idx + 1) * 25}%` }}></div>
                        ))}
                      </div>

                      <div className="relative z-10 space-y-0.5 w-full flex flex-col items-center">
                        {/* Returned (bottom) */}
                        {returned > 0 && (
                          <div
                            className="bg-dark-slate w-full rounded-sm transition-all duration-500 hover:scale-105 shadow-sm"
                            style={{
                              height: `${Math.max((returned / maxLoans) * 100, 12)}px`
                            }}
                            title={`${returned} returned on ${date.toLocaleDateString()}`}
                          ></div>
                        )}
                        {/* Approved (middle) */}
                        {approved > 0 && (
                          <div
                            className="bg-dark-slate/80 w-full rounded-sm transition-all duration-500 hover:scale-105 shadow-sm"
                            style={{
                              height: `${Math.max((approved / maxLoans) * 100, 12)}px`
                            }}
                            title={`${approved} approved on ${date.toLocaleDateString()}`}
                          ></div>
                        )}
                        {/* Requested (top) */}
                        {requested > 0 && (
                          <div
                            className="bg-orange w-full rounded-sm transition-all duration-500 hover:scale-105 shadow-sm"
                            style={{
                              height: `${Math.max((requested / maxLoans) * 100, 12)}px`
                            }}
                            title={`${requested} requested on ${date.toLocaleDateString()}`}
                          ></div>
                        )}

                        {/* Show placeholder when no data */}
                        {totalDay === 0 && (
                          <div className="h-0.5 w-full bg-gray-200 rounded-sm opacity-50"></div>
                        )}
                      </div>

                      {/* Hover overlay with count */}
                      <div className="absolute inset-0 bg-black bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                        <div className="text-white text-xs font-bold text-center">
                          <div>{totalDay}</div>
                          <div className="text-xs opacity-75">loans</div>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mobile-optimized Legend */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs flex-wrap">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-orange rounded-sm"></div>
                <span className="text-gray-600">Requested</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-dark-slate/80 rounded-sm"></div>
                <span className="text-gray-600">Approved</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-dark-slate rounded-sm"></div>
                <span className="text-gray-600">Returned</span>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 p-3 bg-gradient-to-r from-flash-white to-flash-white-light rounded-xl border border-orange/20">
              <p className="text-xs sm:text-sm text-gray-700 text-center">
                <span className="font-semibold text-orange">{loans.length}</span> total loans recorded
              </p>
            </div>
          </div>

          {/* Mobile-optimized Recent Activity */}
          <div className="glass-premium rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 animate-entry delay-500">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                {isAdmin ? 'Recent Activity' : 'My Recent Activity'}
              </h3>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            {/* Mobile-optimized Activity List */}
            <div className="space-y-2 sm:space-y-3">
              {(isAdmin ? loans : userLoans)
                .sort((a, b) => {
                  try {
                    // Try both requestedAt and createdAt fields
                    const dateA = new Date(a.requestedAt || a.createdAt);
                    const dateB = new Date(b.requestedAt || b.createdAt);
                    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0;
                    return dateB.getTime() - dateA.getTime();
                  } catch (error) {
                    return 0;
                  }
                })
                .slice(0, 5)
                .map((loan, idx) => {
                  const activityType = loan.status === 'pending' ? 'requested' :
                                     loan.status === 'active' ? 'approved' :
                                     loan.status === 'returned' ? 'returned' : 'overdue';

                  const iconColor = activityType === 'approved' ? 'bg-dark-slate' :
                                   activityType === 'requested' ? 'bg-orange' :
                                   activityType === 'returned' ? 'bg-dark-slate' :
                                   'bg-orange';

                  const IconComponent = activityType === 'approved' ? FileText :
                                       activityType === 'requested' ? Clock :
                                       activityType === 'returned' ? Package :
                                       AlertTriangle;

                  return (
                    <div key={loan.id} className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/40 hover:bg-white/60 rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-md animate-entry" style={{ animationDelay: `${500 + (idx * 100)}ms` }}>
                      <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300 ${iconColor} text-white flex-shrink-0`}>
                        <IconComponent size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-orange transition-colors truncate">
                          {loan.user?.name || 'Someone'} {activityType} {loan.item?.name || 'an item'}
                        </p>
                        <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors">
                          {(() => {
                            try {
                              // Try both requestedAt and createdAt fields
                              const date = new Date(loan.requestedAt || loan.createdAt);
                              if (isNaN(date.getTime())) {
                                return 'Recently';
                              }
                              return date.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              });
                            } catch (error) {
                              return 'Recently';
                            }
                          })()}
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <div className="w-2 h-2 bg-orange rounded-full"></div>
                      </div>
                    </div>
                  );
                })}
              {(isAdmin ? loans : userLoans).length === 0 && (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <Clock className="mx-auto mb-2 opacity-50" size={28} />
                  <p className="text-sm sm:text-base">{isAdmin ? 'No recent activity' : 'No loan activity yet'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Mobile-optimized Quick Actions */}
          <div className="glass-premium rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 animate-entry delay-700">
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button
                onClick={() => onTabChange('catalog')}
                className="flex flex-col items-center justify-center gap-2 p-4 sm:p-5 bg-dark-slate hover:bg-dark-slate-dark text-white rounded-lg sm:rounded-xl transition-all duration-300 transform btn-active-scale shadow-lg shadow-glow-green min-h-[100px] sm:min-h-[110px]"
              >
                <Package size={24} className="sm:w-7 sm:h-7" />
                <span className="text-xs sm:text-sm font-semibold text-center">Browse Items</span>
              </button>
              <button
                onClick={() => onTabChange('my-loans')}
                className="flex flex-col items-center justify-center gap-2 p-4 sm:p-5 bg-orange hover:bg-orange-dark text-white rounded-lg sm:rounded-xl transition-all duration-300 transform btn-active-scale shadow-lg shadow-glow min-h-[100px] sm:min-h-[110px]"
              >
                <FileText size={24} className="sm:w-7 sm:h-7" />
                <span className="text-xs sm:text-sm font-semibold text-center">My Loans</span>
              </button>
              {isAdmin && (
                <button
                  onClick={() => onTabChange('admin-users')}
                  className="flex flex-col items-center justify-center gap-2 p-4 sm:p-5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg sm:rounded-xl transition-all duration-300 transform btn-active-scale shadow-sm min-h-[100px] sm:min-h-[110px] col-span-2"
                >
                  <Users size={24} className="sm:w-7 sm:h-7 text-dark-slate" />
                  <span className="text-xs sm:text-sm font-semibold text-center">Manage Users</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthWrapper: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  return isLogin ? (
    <LoginForm onToggleForm={() => setIsLogin(false)} />
  ) : (
    <RegisterForm onToggleForm={() => setIsLogin(true)} />
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return <AuthWrapper />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onTabChange={setActiveTab} />;
      case 'catalog':
        return <ItemCatalog onTabChange={setActiveTab} />;
      case 'my-loans':
        return <MyLoans />;
      case 'admin-items':
        return <ManageItems />;
      case 'admin-loans':
        return <ManageLoans />;
      case 'admin-users':
        return <ManageUsers />;
      case 'admin-categories':
        return <ManageCategories />;
      case 'settings':
        return isAdmin ? <Settings /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <AuthProvider>
      <NotificationProvider>
        <DataProvider>
          <AppContent />
          <ToastContainer />
        </DataProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;