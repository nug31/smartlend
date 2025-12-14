import React, { useEffect, useState } from 'react';
import { CheckCircle, Info, AlertTriangle, X, XIcon } from 'lucide-react';
import { useNotifications, Notification } from '../../contexts/NotificationContext';

interface ToastProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(notification.id);
    }, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'info':
        return <Info size={20} className="text-blue-600" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-600" />;
      case 'error':
        return <AlertTriangle size={20} className="text-red-600" />;
      default:
        return <Info size={20} className="text-gray-600" />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getProgressColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-500';
      case 'info':
        return 'bg-blue-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      className={`
        relative overflow-hidden transition-all duration-300 ease-in-out transform
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
        bg-white rounded-lg shadow-lg border ${getBgColor()}
        max-w-sm w-full mx-4 mb-4
      `}
    >
      {/* Progress bar */}
      {notification.autoHide && notification.duration && (
        <div
          className={`absolute top-0 left-0 h-1 ${getProgressColor()}`}
          style={{
            animation: `toast-progress ${notification.duration}ms linear forwards`
          }}
        />
      )}

      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              {notification.title}
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {notification.message}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {notification.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>

          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close notification"
          >
            <X size={16} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <>
      {/* Add CSS for progress bar animation */}
      <style>{`
        @keyframes toast-progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
      
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
        <div className="flex flex-col-reverse space-y-reverse space-y-2">
          {notifications.slice(-5).map((notification) => (
            <div key={notification.id} className="pointer-events-auto">
              <Toast
                notification={notification}
                onClose={removeNotification}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Toast;
