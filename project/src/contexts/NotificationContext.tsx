import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  autoHide?: boolean;
  duration?: number;
}

export interface LoanStatusUpdate {
  loanId: string;
  oldStatus: string;
  newStatus: string;
  itemName?: string;
  userName?: string;
  userId?: string;
  timestamp: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  subscribeLoanUpdates: (callback: (update: LoanStatusUpdate) => void) => () => void;
  broadcastLoanUpdate: (update: Omit<LoanStatusUpdate, 'timestamp'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const loanUpdateCallbacks = useRef<Set<(update: LoanStatusUpdate) => void>>(new Set());
  const nextId = useRef(1);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = `notification-${nextId.current++}`;
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      autoHide: notification.autoHide !== false,
      duration: notification.duration || 5000,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove notification
    if (newNotification.autoHide) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const subscribeLoanUpdates = useCallback((callback: (update: LoanStatusUpdate) => void) => {
    loanUpdateCallbacks.current.add(callback);
    return () => {
      loanUpdateCallbacks.current.delete(callback);
    };
  }, []);

  const broadcastLoanUpdate = useCallback((update: Omit<LoanStatusUpdate, 'timestamp'>) => {
    const fullUpdate: LoanStatusUpdate = {
      ...update,
      timestamp: new Date(),
    };

    // Notify all subscribers
    loanUpdateCallbacks.current.forEach(callback => {
      try {
        callback(fullUpdate);
      } catch (error) {
        console.error('Error in loan update callback:', error);
      }
    });

    // Create notification based on status change
    const getStatusMessage = (oldStatus: string, newStatus: string, itemName?: string, userName?: string) => {
      if (newStatus === 'active' && oldStatus === 'pending') {
        return {
          type: 'success' as const,
          title: 'Loan Approved',
          message: `${itemName || 'Item'} loan for ${userName || 'user'} has been approved and is now active.`,
        };
      } else if (newStatus === 'cancelled' && oldStatus === 'pending') {
        return {
          type: 'warning' as const,
          title: 'Loan Rejected',
          message: `${itemName || 'Item'} loan request for ${userName || 'user'} has been rejected.`,
        };
      } else if (newStatus === 'returned') {
        return {
          type: 'info' as const,
          title: 'Item Returned',
          message: `${itemName || 'Item'} has been returned by ${userName || 'user'}.`,
        };
      } else if (newStatus === 'overdue') {
        return {
          type: 'error' as const,
          title: 'Item Overdue',
          message: `${itemName || 'Item'} loaned by ${userName || 'user'} is now overdue.`,
        };
      }
      return null;
    };

    const notificationData = getStatusMessage(update.oldStatus, update.newStatus, update.itemName, update.userName);
    if (notificationData) {
      addNotification(notificationData);
    }

    // Also broadcast via custom event for cross-tab communication
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('loanStatusUpdate', {
          detail: fullUpdate,
        })
      );
    }
  }, [addNotification]);

  // Listen for custom events from other tabs
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleLoanStatusUpdate = (event: CustomEvent<LoanStatusUpdate>) => {
      // Re-broadcast to local subscribers without creating duplicate notifications
      loanUpdateCallbacks.current.forEach(callback => {
        try {
          callback(event.detail);
        } catch (error) {
          console.error('Error in loan update callback:', error);
        }
      });
    };

    window.addEventListener('loanStatusUpdate', handleLoanStatusUpdate as EventListener);
    return () => {
      window.removeEventListener('loanStatusUpdate', handleLoanStatusUpdate as EventListener);
    };
  }, []);

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    subscribeLoanUpdates,
    broadcastLoanUpdate,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
