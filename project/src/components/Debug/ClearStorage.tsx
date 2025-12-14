import React from 'react';
import { Trash2, RefreshCw, AlertTriangle } from 'lucide-react';

export const ClearStorage: React.FC = () => {
  const clearAllStorage = () => {
    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Reload page
    window.location.reload();
  };

  const clearOnlyAuth = () => {
    // Clear only auth-related items
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    
    // Reload page
    window.location.reload();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <AlertTriangle className="text-orange-600" size={24} />
        <h3 className="text-lg font-semibold text-gray-900">Storage Management</h3>
      </div>

      <div className="space-y-4">
        <div className="bg-orange-50 p-4 rounded-lg">
          <h4 className="font-medium text-orange-900 mb-2">⚠️ Database Reset Issue</h4>
          <p className="text-sm text-orange-700 mb-3">
            When the backend restarts, the database is reset and all user IDs change. 
            However, the frontend still stores the old user ID in localStorage, causing "User not found" errors.
          </p>
          <p className="text-sm text-orange-700">
            <strong>Solution:</strong> Clear browser storage and login again to get the new user ID.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={clearOnlyAuth}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={16} />
            <span>Clear Auth & Reload</span>
          </button>

          <button
            onClick={clearAllStorage}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 size={16} />
            <span>Clear All Storage</span>
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Current Storage Info:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div>
              <strong>User ID:</strong> {localStorage.getItem('user') ? 
                JSON.parse(localStorage.getItem('user') || '{}').id || 'Not found' : 'Not logged in'}
            </div>
            <div>
              <strong>Auth Status:</strong> {localStorage.getItem('isAuthenticated') || 'false'}
            </div>
            <div>
              <strong>Storage Items:</strong> {Object.keys(localStorage).length} items
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">🔧 Quick Fix Steps:</h4>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Click "Clear Auth & Reload" button above</li>
            <li>2. Login again with: admin@example.com / admin123</li>
            <li>3. Try creating loan request again</li>
            <li>4. The user ID will now match the database</li>
          </ol>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">✅ Valid User Credentials:</h4>
          <div className="text-sm text-green-700 space-y-1">
            <div><strong>Admin:</strong> admin@example.com / admin123</div>
            <div><strong>User:</strong> john.doe@example.com / user123</div>
            <div><strong>User:</strong> jane.smith@example.com / user123</div>
          </div>
          <div className="mt-3 p-3 bg-yellow-100 rounded border-l-4 border-yellow-500">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Important:</strong> Use EXACTLY these credentials. Any other email will result in 401 Unauthorized error.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
