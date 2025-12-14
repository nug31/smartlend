import React from 'react';
import {
  Home,
  Package,
  Users,
  FileText,
  Settings,
  Tag
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isOpen, onClose }) => {
  const { isAdmin, user } = useAuth();

  // Debug: Log the current state
  console.log('Sidebar Debug:', { 
    isAdmin, 
    activeTab, 
    userRole: user?.role,
    user: user 
  });

  // Create menu items array
  const menuItems = [];

  // Always add basic menu items first
  menuItems.push(
    { id: 'dashboard', label: 'Dashboard', icon: Home, adminOnly: false },
    { id: 'catalog', label: 'Item Catalog', icon: Package, adminOnly: false },
    { id: 'my-loans', label: 'My Loans', icon: FileText, adminOnly: false }
  );

  // Add admin menu items if user is admin
  if (isAdmin && user?.role === 'admin') {
    console.log('Adding admin menu items');
    menuItems.push(
      { id: 'admin-items', label: 'Manage Items', icon: Package, adminOnly: true },
      { id: 'admin-categories', label: 'Manage Categories', icon: Tag, adminOnly: true },
      { id: 'admin-loans', label: 'Manage Loans', icon: FileText, adminOnly: true },
      { id: 'admin-users', label: 'Manage Users', icon: Users, adminOnly: true },
      { id: 'settings', label: 'Settings', icon: Settings, adminOnly: true }
    );
  } else {
    console.log('User is not admin or role not detected, showing basic menu only');
    console.log('User role:', user?.role);
    console.log('IsAdmin flag:', isAdmin);
  }

  console.log('Final menu items:', menuItems);

  const handleMenuClick = (tabId: string) => {
    onTabChange(tabId);
    // Auto-close sidebar only on mobile when menu item is clicked
    if (onClose && window.innerWidth < 1024) { // 1024px is the lg breakpoint
      onClose();
    }
  };

  return (
    <aside className={`
      fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-100 border-r border-gray-200 shadow-xl
      transform transition-all duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="flex flex-col h-full">
        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="px-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`
                    group w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActive
                      ? 'bg-gray-200 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  <Icon
                    size={20}
                    className={`mr-3 ${
                      isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'
                    }`}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full opacity-80"></div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">NUG</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">SmartLend</p>
              <p className="text-xs text-gray-500">Developed by NUG</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};