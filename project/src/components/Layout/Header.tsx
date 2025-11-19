import React, { useState } from 'react';
import { Bell, Menu, X, User, Settings, LogOut, Package, Handshake, Home, FileText, Tag, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

interface HeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMenuOpen, activeTab, onTabChange }) => {
  const { user, logout, isAdmin } = useAuth();
  const { notifications, markNotificationRead } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.isRead);

  // Create menu items for horizontal nav
  const menuItems = [];
  if (isAdmin && user?.role === 'admin') {
    menuItems.push(
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'catalog', label: 'Catalog', icon: Package },
      { id: 'admin-loans', label: 'Manage Loans', icon: FileText },
      { id: 'admin-items', label: 'Manage Items', icon: Package },
      { id: 'admin-categories', label: 'Categories', icon: Tag },
      { id: 'admin-users', label: 'Users', icon: Users },
      { id: 'settings', label: 'Settings', icon: Settings }
    );
  } else {
    menuItems.push(
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'catalog', label: 'Catalog', icon: Package },
      { id: 'my-loans', label: 'My Loans', icon: FileText }
    );
  }

  return (
    <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg border-b border-orange-400 sticky top-0 z-50">
      {/* Top row: Logo and user actions */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-orange-400/30">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-orange-400 transition-all duration-200"
          >
            {isMenuOpen ? <X size={24} className="text-orange-100" /> : <Menu size={24} className="text-orange-100" />}
          </button>

          <div className="flex items-center space-x-4">
            <div className="relative">
              {/* Logo */}
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
                <Handshake size={20} className="text-orange-100" />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-bold text-lg text-orange-100 hidden sm:block leading-tight">
                SmartLend
              </span>
              <span className="text-xs text-orange-200 font-semibold hidden sm:block -mt-1 tracking-wide">
                by NUG
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-orange-400 transition-all duration-200"
            >
              <Bell size={20} className="text-orange-100" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <p className="text-sm text-gray-600">{unreadNotifications.length} unread</p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center">
                      <Bell className="mx-auto text-gray-300 mb-2" size={32} />
                      <p className="text-gray-500">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => markNotificationRead(notification.id)}
                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          !notification.isRead ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            !notification.isRead ? 'bg-blue-500' : 'bg-gray-300'
                          }`} />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-2">
                              {notification.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-orange-400 transition-all duration-200"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isAdmin ? 'bg-red-600' : 'bg-blue-600'
              }`}>
                <User size={16} className="text-white" />
              </div>
              <span className="hidden sm:block font-medium text-orange-100">
                {user?.firstName || user?.email} {user?.lastName}
              </span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-3">
                  <div className="px-3 py-2 text-sm text-gray-600 border-b border-gray-100 bg-gray-50 rounded mb-2">
                    {user?.email}
                  </div>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center space-x-2">
                    <User size={16} className="text-gray-500" />
                    <span>Profile</span>
                  </button>
                  {isAdmin && (
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center space-x-2">
                      <Settings size={16} className="text-gray-500" />
                      <span>Settings</span>
                    </button>
                  )}
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded flex items-center space-x-2 mt-2"
                  >
                    <LogOut size={16} className="text-red-500" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom row: Horizontal navigation menu (desktop only) */}
      <div className="hidden lg:flex items-center px-6 py-2 space-x-1 overflow-x-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap
                ${isActive
                  ? 'bg-white/20 text-white font-semibold shadow-md'
                  : 'text-orange-100 hover:bg-white/10'
                }
              `}
            >
              <Icon size={18} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};