import { useState, useEffect, useRef } from 'react';
import { AppNotification } from '../types';

interface UseNotificationsReturn {
  notifications: AppNotification[];
  addNotification: (notification: AppNotification) => void;
  markAsRead: (notificationId: string) => void;
  clearAll: () => void;
  unreadCount: number;
}

export const useNotifications = (userId?: string): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Initialize SSE connection
    const eventSource = new EventSource(`http://localhost:3002/api/notifications/stream?userId=${userId}`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('📡 SSE connection opened for notifications');
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📡 Received notification:', data);

        if (data.type === 'connected') {
          console.log('📡 Connected to notification stream');
          return;
        }

        // Add new notification
        const notification: AppNotification = {
          id: data.id,
          userId: data.userId,
          type: data.type,
          title: data.title,
          message: data.message,
          isRead: data.isRead,
          createdAt: new Date(data.createdAt),
          relatedId: data.relatedId
        };

        setNotifications(prev => [notification, ...prev]);

        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification(data.title, {
            body: data.message,
            icon: '/favicon.ico',
            tag: data.id
          });
        }

        // Play notification sound (optional)
        playNotificationSound();

      } catch (error) {
        console.error('📡 Error parsing notification:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('📡 SSE connection error:', error);
    };

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        console.log('📡 SSE connection closed');
      }
    };
  }, [userId]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('📡 Notification permission:', permission);
      });
    }
  }, []);

  const addNotification = (notification: AppNotification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const playNotificationSound = () => {
    try {
      // Create a simple notification sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.log('📡 Could not play notification sound:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    addNotification,
    markAsRead,
    clearAll,
    unreadCount
  };
};
