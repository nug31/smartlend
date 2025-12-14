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
    <header className="glass-premium sticky top-0 z-50 border-b border-gray-200/50">
      {/* Top row: Logo and user actions */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100/50">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 text-gray-600"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative group">
              {/* Logo */}
              <div className="w-10 h-10 bg-gradient-to-br from-orange to-orange-dark rounded-xl flex items-center justify-center shadow-lg shadow-glow transition-transform duration-300 group-hover:scale-105">
                <Handshake size={20} className="text-white" />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-bold text-lg text-gray-900 hidden sm:block leading-tight tracking-tight">
                SmartLend
              </span>
              <span className="text-xs text-orange font-semibold hidden sm:block -mt-0.5 tracking-wide">
                by NUG
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-orange transition-all duration-200"
            >
              <Bell size={20} />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-entry delay-0 origin-top-right">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <span className="text-xs font-medium px-2 py-1 bg-orange/10 text-orange rounded-full">
                      {unreadNotifications.length} new
                    </span>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Bell className="text-gray-300" size={20} />
                      </div>
                      <p className="text-gray-500 text-sm">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => markNotificationRead(notification.id)}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.isRead ? 'bg-orange/5' : ''
                          }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notification.isRead ? 'bg-orange' : 'bg-gray-300'
                            }`} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">{notification.title}</p>
                            <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                              <Clock size={10} />
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
              className="flex items-center space-x-2 p-1.5 pr-3 rounded-full border border-gray-200 hover:border-orange/30 hover:bg-orange/5 transition-all duration-200 group"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${isAdmin ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'
                }`}>
                <User size={14} className="text-white" />
              </div>
              <span className="hidden sm:block font-medium text-gray-700 text-sm group-hover:text-orange transition-colors">
                {user?.firstName || user?.email?.split('@')[0]}
              </span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 z-50 animate-entry origin-top-right overflow-hidden">
                <div className="p-2">
                  <div className="px-3 py-3 mb-2 bg-gray-50/50 rounded-xl border border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {user?.email}
                    </p>
                  </div>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange rounded-lg flex items-center space-x-2 transition-colors">
                    <User size={16} className="text-gray-400" />
                    <span>Profile</span>
                  </button>
                  {isAdmin && (
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange rounded-lg flex items-center space-x-2 transition-colors">
                      <Settings size={16} className="text-gray-400" />
                      <span>Settings</span>
                    </button>
                  )}
                  <div className="h-px bg-gray-100 my-1"></div>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom row: Horizontal navigation menu (desktop only) */}
      <div className="hidden lg:flex items-center px-6 py-1 space-x-1 overflow-x-auto bg-gray-50/50 backdrop-blur-md border-b border-gray-200/50">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap text-sm font-medium
                ${isActive
                  ? 'bg-orange text-white shadow-md shadow-orange/20'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                }
              `}
            >
              <Icon size={16} className={isActive ? 'text-white' : 'text-gray-400'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};