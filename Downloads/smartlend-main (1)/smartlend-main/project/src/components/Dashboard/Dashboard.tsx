import React from 'react';
import {
  Package,
  Users,
  FileText,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

export const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { dashboardStats, loans, getUserLoans, getOverdueLoans } = useData();

  console.log('🔍 Dashboard render - dashboardStats:', dashboardStats);

  const userLoans = getUserLoans(user?.id || '');
  const overdueLoans = getOverdueLoans();
  const activeUserLoans = userLoans.filter(loan => loan.status === 'active');
  const pendingUserLoans = userLoans.filter(loan => loan.status === 'pending');

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    change?: string;
    gradient?: string;
  }> = ({ title, value, icon, color, change, gradient }) => (
    <div className="group relative overflow-hidden">
      {/* Background gradient */}
      <div className={`absolute inset-0 ${gradient || 'bg-gradient-to-br from-gray-600 to-gray-800'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

      {/* Card content */}
      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 card-hover group-hover:text-white transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600 group-hover:text-white/80 transition-colors">{title}</p>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-white transition-colors">{value}</p>
            {change && (
              <p className="text-sm text-green-600 group-hover:text-green-200 flex items-center transition-colors">
                <TrendingUp size={14} className="mr-1" />
                {change}
              </p>
            )}
          </div>
          <div className={`p-4 rounded-2xl ${color} shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
            {icon}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-8 -translate-x-8 group-hover:scale-150 transition-transform duration-500"></div>
      </div>
    </div>
  );

  const RecentActivity: React.FC = () => {
    // Get recent activities from loans data
    const recentActivities = loans
      .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())
      .slice(0, 5)
      .map(loan => ({
        id: loan.id,
        type: loan.status === 'pending' ? 'requested' :
              loan.status === 'active' ? 'approved' :
              loan.status === 'returned' ? 'returned' : 'overdue',
        date: loan.requestedAt,
        status: loan.status
      }));

    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-red-50 rounded-xl transition-all duration-300 hover:shadow-md">
              <div className={`p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300 ${
                activity.type === 'approved' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
                activity.type === 'requested' ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white' :
                activity.type === 'returned' ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white' :
                'bg-gradient-to-r from-red-500 to-red-600 text-white'
              }`}>
                {activity.type === 'approved' ? <CheckCircle size={18} /> :
                 activity.type === 'requested' ? <Clock size={18} /> :
                 activity.type === 'returned' ? <Package size={18} /> :
                 <AlertTriangle size={18} />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-red-900 transition-colors">
                  Loan {activity.type}
                </p>
                <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors">
                  {new Date(activity.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
            </div>
          ))}
          {recentActivities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Clock size={32} className="mx-auto mb-2 opacity-50" />
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const LoanTrends: React.FC = () => {
    // Calculate loan trends from the past 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const trendData = last7Days.map(date => {
      const dayLoans = loans.filter(loan =>
        new Date(loan.requestedAt).toISOString().split('T')[0] === date
      );
      return {
        date,
        count: dayLoans.length,
        requested: dayLoans.filter(l => l.status === 'pending').length,
        approved: dayLoans.filter(l => l.status === 'active').length,
        returned: dayLoans.filter(l => l.status === 'returned').length
      };
    });

    const maxCount = Math.max(...trendData.map(d => d.count), 1);
    const totalThisWeek = trendData.reduce((sum, d) => sum + d.count, 0);
    const avgPerDay = (totalThisWeek / 7).toFixed(1);

    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Loan Trends</h3>
          <div className="flex items-center space-x-2">
            <TrendingUp className="text-red-500" size={20} />
            <span className="text-sm font-semibold text-red-600">{avgPerDay}/day avg</span>
          </div>
        </div>

        <div className="h-48 flex items-end justify-between space-x-2 mb-4">
          {trendData.map((day, index) => (
            <div key={day.date} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gradient-to-br from-amber-50 to-red-50 rounded-xl border border-red-100 p-2 mb-2">
                <div className="space-y-1">
                  {/* Requested loans bar */}
                  <div
                    className="bg-gradient-to-r from-amber-500 to-yellow-600 rounded-sm transition-all duration-500 hover:scale-105"
                    style={{
                      height: `${Math.max((day.requested / maxCount) * 80, day.requested > 0 ? 8 : 0)}px`,
                      minHeight: day.requested > 0 ? '8px' : '0px'
                    }}
                    title={`${day.requested} requested`}
                  ></div>
                  {/* Approved loans bar */}
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-sm transition-all duration-500 hover:scale-105"
                    style={{
                      height: `${Math.max((day.approved / maxCount) * 80, day.approved > 0 ? 8 : 0)}px`,
                      minHeight: day.approved > 0 ? '8px' : '0px'
                    }}
                    title={`${day.approved} approved`}
                  ></div>
                  {/* Returned loans bar */}
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-sm transition-all duration-500 hover:scale-105"
                    style={{
                      height: `${Math.max((day.returned / maxCount) * 80, day.returned > 0 ? 8 : 0)}px`,
                      minHeight: day.returned > 0 ? '8px' : '0px'
                    }}
                    title={`${day.returned} returned`}
                  ></div>
                </div>
              </div>
              <span className="text-xs text-gray-600 font-medium">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-sm"></div>
            <span className="text-gray-600">Requested</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-sm"></div>
            <span className="text-gray-600">Approved</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-sm"></div>
            <span className="text-gray-600">Returned</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gradient-to-r from-red-50 to-blue-50 rounded-xl border border-red-100">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-red-600">{totalThisWeek}</span> total loans this week
          </p>
        </div>
      </div>
    );
  };

  const QuickActions: React.FC = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        <button className="group relative overflow-hidden flex flex-col items-center justify-center space-y-2 p-4 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Package size={24} className="relative z-10" />
          <span className="text-sm font-semibold relative z-10">Browse Items</span>
        </button>
        <button className="group relative overflow-hidden flex flex-col items-center justify-center space-y-2 p-4 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <FileText size={24} className="relative z-10" />
          <span className="text-sm font-semibold relative z-10">My Loans</span>
        </button>
        {isAdmin && (
          <button className="group relative overflow-hidden flex flex-col items-center justify-center space-y-2 p-4 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Users size={24} className="relative z-10" />
            <span className="text-sm font-semibold relative z-10">Manage Users</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-blue-50 to-red-50">
      <div className="space-y-8 p-6">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-red-500/10"></div>
          <div className="relative flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold gradient-text">
                Welcome, {user?.firstName || user?.email}! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                Here's what's happening with your loans and items today.
              </p>
            </div>
            <div className="text-right space-y-2">
              <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm font-medium text-gray-700">Live</p>
              </div>
              <p className="text-sm text-gray-500 font-medium">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-red-400/20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-400/20 to-amber-400/20 rounded-full translate-y-12 -translate-x-12"></div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isAdmin ? (
            <>
              <StatCard
                title="Total Items"
                value={dashboardStats.totalItems}
                icon={<Package className="text-white" size={28} />}
                color="bg-gradient-to-r from-blue-500 to-blue-600"
                gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                change="+12% from last month"
              />
              <StatCard
                title="Active Loans"
                value={dashboardStats.activeLoans}
                icon={<FileText className="text-white" size={28} />}
                color="bg-gradient-to-r from-green-500 to-green-600"
                gradient="bg-gradient-to-br from-green-500 to-emerald-600"
                change="+8% from last month"
              />
              <StatCard
                title="Pending Requests"
                value={dashboardStats.pendingRequests}
                icon={<Clock className="text-white" size={28} />}
                color="bg-gradient-to-r from-amber-500 to-amber-600"
                gradient="bg-gradient-to-br from-amber-500 to-amber-600"
              />
              <StatCard
                title="Overdue Items"
                value={dashboardStats.overdueItems}
                icon={<AlertTriangle className="text-white" size={28} />}
                color="bg-gradient-to-r from-red-500 to-red-600"
                gradient="bg-gradient-to-br from-red-500 to-red-600"
              />
            </>
          ) : (
            <>
              <StatCard
                title="My Active Loans"
                value={activeUserLoans.length}
                icon={<FileText className="text-white" size={28} />}
                color="bg-gradient-to-r from-green-500 to-green-600"
                gradient="bg-gradient-to-br from-green-500 to-emerald-600"
              />
              <StatCard
                title="Pending Requests"
                value={pendingUserLoans.length}
                icon={<Clock className="text-white" size={28} />}
                color="bg-gradient-to-r from-amber-500 to-amber-600"
                gradient="bg-gradient-to-br from-amber-500 to-amber-600"
              />
              <StatCard
                title="Items Due Soon"
                value={activeUserLoans.filter(loan => {
                  const daysUntilDue = Math.ceil(
                    (new Date(loan.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );
                  return daysUntilDue <= 3;
                }).length}
                icon={<AlertTriangle className="text-white" size={28} />}
                color="bg-gradient-to-r from-red-500 to-red-600"
                gradient="bg-gradient-to-br from-red-500 to-red-600"
              />
              <StatCard
                title="Total Loans"
                value={userLoans.length}
                icon={<Package className="text-white" size={28} />}
                color="bg-gradient-to-r from-blue-500 to-blue-600"
                gradient="bg-gradient-to-br from-blue-500 to-blue-600"
              />
            </>
          )}
        </div>

        {/* Enhanced Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoanTrends />
          <RecentActivity />
        </div>

        {/* Enhanced Quick Actions and Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickActions />

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Important Notices</h3>
            <div className="space-y-4">
              <div className="group flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all duration-300 border border-blue-200">
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 group-hover:scale-125 transition-transform"></div>
                <div>
                  <p className="text-sm font-semibold text-blue-900">System Maintenance</p>
                  <p className="text-sm text-blue-700">
                    Scheduled maintenance this weekend from 2-4 AM
                  </p>
                </div>
              </div>
              <div className="group flex items-start space-x-4 p-4 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl transition-all duration-300 border border-green-200">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-2 group-hover:scale-125 transition-transform"></div>
                <div>
                  <p className="text-sm font-semibold text-green-900">New Items Added</p>
                  <p className="text-sm text-green-700">
                    5 new laptops and 3 projectors now available
                  </p>
                </div>
              </div>
              <div className="group flex items-start space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 rounded-xl transition-all duration-300 border border-yellow-200">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mt-2 group-hover:scale-125 transition-transform"></div>
                <div>
                  <p className="text-sm font-semibold text-yellow-900">Policy Update</p>
                  <p className="text-sm text-yellow-700">
                    Updated loan duration limits - check your profile
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};