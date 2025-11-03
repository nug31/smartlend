import React, { useState } from 'react';
import { Bell, Send, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const NotificationTest: React.FC = () => {
  const { user } = useAuth();
  const [testMessage, setTestMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const testSSEConnection = () => {
    if (!user?.id) return;

    const eventSource = new EventSource(`http://localhost:3002/api/notifications/stream?userId=${user.id}`);
    
    eventSource.onopen = () => {
      console.log('📡 Test SSE connection opened');
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      console.log('📡 Test notification received:', event.data);
      const data = JSON.parse(event.data);
      
      if (data.type !== 'connected') {
        alert(`📡 Notification: ${data.title}\n${data.message}`);
      }
    };

    eventSource.onerror = (error) => {
      console.error('📡 Test SSE error:', error);
      setIsConnected(false);
    };

    // Auto close after 30 seconds for testing
    setTimeout(() => {
      eventSource.close();
      setIsConnected(false);
      console.log('📡 Test connection closed');
    }, 30000);
  };

  const sendTestNotification = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/test-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          title: 'Test Notification 🧪',
          message: testMessage || 'This is a test notification from the admin panel'
        })
      });

      if (response.ok) {
        console.log('📡 Test notification sent successfully');
        setTestMessage('');
      } else {
        console.error('📡 Failed to send test notification');
      }
    } catch (error) {
      console.error('📡 Error sending test notification:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Bell className="text-blue-600" size={24} />
        <h3 className="text-lg font-semibold text-gray-900">Real-time Notification Test</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <span className="text-sm text-gray-600">
            SSE Connection: {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <button
          onClick={testSSEConnection}
          disabled={isConnected}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap size={16} />
          <span>{isConnected ? 'Connected' : 'Test SSE Connection'}</span>
        </button>

        <div className="border-t border-gray-200 pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Message
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Enter test notification message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={sendTestNotification}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Send size={16} />
              <span>Send</span>
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">How to Test:</h4>
          <ol className="text-sm text-gray-600 space-y-1">
            <li>1. Click "Test SSE Connection" to establish real-time connection</li>
            <li>2. Open another browser tab and login as admin</li>
            <li>3. Approve a loan request to see real-time notification</li>
            <li>4. Or use the "Send Test" button to send a manual notification</li>
          </ol>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Real-time Features:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• ✅ Server-Sent Events (SSE) connection</li>
            <li>• ✅ Browser notifications (if permission granted)</li>
            <li>• ✅ Sound notifications</li>
            <li>• ✅ Auto-notification on loan approve/reject</li>
            <li>• ✅ Admin notifications for new loan requests</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
