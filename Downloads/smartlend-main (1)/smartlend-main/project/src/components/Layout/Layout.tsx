import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-amber-50 via-blue-50 to-red-50">
      {/* Sidebar only for mobile */}
      <div className="lg:hidden">
        <Sidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          isOpen={isSidebarOpen}
          onClose={handleSidebarClose}
        />
      </div>

      {/* Enhanced overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-all duration-300"
          onClick={handleSidebarClose}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onMenuToggle={handleMenuToggle}
          isMenuOpen={isSidebarOpen}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto pb-20 lg:pb-0">
          {children}
        </main>

        {/* Bottom Navigation for Mobile */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      </div>
    </div>
  );
};