import React from 'react';
import {
  Home,
  Package,
  FileText,
  Tag,
  Users,
  Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { isAdmin, user } = useAuth();

  // Create menu items for bottom nav (max 5 items for mobile)
  const menuItems = [];

  // Basic menu items for all users
  menuItems.push(
    { id: 'dashboard', label: 'Home', icon: Home, adminOnly: false },
    { id: 'catalog', label: 'Catalog', icon: Package, adminOnly: false },
    { id: 'my-loans', label: 'My Loans', icon: FileText, adminOnly: false }
  );

  // Add admin menu items if user is admin
  if (isAdmin && user?.role === 'admin') {
    menuItems.push(
      { id: 'admin-items', label: 'Items', icon: Package, adminOnly: true },
      { id: 'settings', label: 'Settings', icon: Settings, adminOnly: true }
    );
  }

  // Limit to 5 items for better mobile UX
  const displayItems = menuItems.slice(0, 5);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50">
      <div className="flex items-center justify-around px-1 py-2 safe-area-bottom">
        {displayItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-xl transition-all duration-200 min-h-[64px]
                ${isActive
                  ? 'text-orange-600'
                  : 'text-gray-500 active:bg-gray-100'
                }
              `}
            >
              <div className={`
                relative p-2.5 rounded-xl transition-all duration-200
                ${isActive
                  ? 'bg-orange-100 scale-110'
                  : 'hover:bg-gray-100'
                }
              `}>
                <Icon
                  size={24}
                  className={`
                    transition-all duration-200
                    ${isActive ? 'text-orange-600' : 'text-gray-500'}
                  `}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {isActive && (
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-600 rounded-full animate-pulse"></div>
                )}
              </div>
              <span className={`
                text-[10px] sm:text-xs font-medium mt-1 transition-all duration-200 truncate max-w-full px-1
                ${isActive ? 'text-orange-600 font-semibold' : 'text-gray-500'}
              `}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

