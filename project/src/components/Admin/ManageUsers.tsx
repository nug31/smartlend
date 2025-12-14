import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Shield, User, Mail, Phone, Building, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { User as UserType } from '../../types';
import { exportUsersData } from '../../utils/exportUtils';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';

// Transform API user data to match frontend UserType
// Updated: Simple and clean design for better UX
const transformApiUser = (apiUser: any): UserType => {
  try {
    console.log('🔄 Transforming API user:', apiUser);

    // Handle both API formats: name field or firstName/lastName fields
    const fullName = apiUser.name || `${apiUser.firstName || ''} ${apiUser.lastName || ''}`.trim();
    const [firstName, ...lastNameParts] = fullName.split(' ');
    const lastName = lastNameParts.join(' ');

    const transformed = {
      id: apiUser.id,
      email: apiUser.email,
      firstName: firstName || '',
      lastName: lastName || '',
      role: apiUser.role,
      createdAt: new Date(apiUser.createdAt),
      isActive: apiUser.isActive,
      department: apiUser.department || '',
      phoneNumber: apiUser.phone || apiUser.phoneNumber || ''
    };

    console.log('✅ Transformed user:', transformed);
    return transformed;
  } catch (err) {
    console.error('❌ Error transforming user:', apiUser, err);
    throw err;
  }
};

export const ManageUsers: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load users from API on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading users from API...');

      const response = await apiService.getUsers();
      console.log('🔍 Raw API response:', response);

      if (response.data) {
        console.log('🔍 Raw users data:', response.data);
        const transformedUsers = response.data.map((user: any) => {
          console.log('🔄 Transforming user:', user);
          return transformApiUser(user);
        });
        console.log('✅ Users loaded:', transformedUsers.length, 'users');
        console.log('🔍 Transformed users:', transformedUsers);
        setUsers(transformedUsers);
      } else {
        console.error('❌ Failed to load users:', response.error);
        setError(response.error || 'Failed to load users');

        // Fallback: show empty state instead of error for better UX
        setUsers([]);
      }
    } catch (err) {
      console.error('❌ Error loading users:', err);
      console.error('❌ Error details:', err);
      setError(`Failed to load users: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    department: '',
    role: 'user' as 'admin' | 'user',
    isActive: true
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' && user.isActive) ||
                         (statusFilter === 'inactive' && !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      department: '',
      role: 'user',
      isActive: true
    });
  };

  // Security helper functions
  const isCurrentUser = (userId: string) => currentUser?.id === userId;

  const getAdminCount = () => users.filter(user => user.role === 'admin' && user.isActive).length;

  const canDeleteUser = (user: UserType) => {
    // Can't delete yourself
    if (isCurrentUser(user.id)) return false;

    // Can't delete the last active admin
    if (user.role === 'admin' && user.isActive && getAdminCount() <= 1) return false;

    return true;
  };

  const canChangeRole = (user: UserType, newRole: string) => {
    // Can't change your own role
    if (isCurrentUser(user.id)) return false;

    // Can't demote the last active admin
    if (user.role === 'admin' && newRole === 'user' && user.isActive && getAdminCount() <= 1) return false;

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingUser) {
        // Check if role change is allowed
        if (editingUser.role !== formData.role && !canChangeRole(editingUser, formData.role)) {
          alert('Cannot change role: You cannot change your own role or demote the last active administrator.');
          return;
        }

        console.log('🔄 Updating user:', editingUser.id);
        // Transform frontend data to API format
        const apiData = {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phoneNumber,
          department: formData.department,
          role: formData.role,
          isActive: formData.isActive
        };
        const response = await apiService.updateUser(editingUser.id, apiData);

        if (response.data) {
          console.log('✅ User updated successfully');
          await loadUsers(); // Reload users from API
          setEditingUser(null);
        } else {
          console.error('❌ Failed to update user:', response.error);
          alert('Failed to update user: ' + (response.error || 'Unknown error'));
          return;
        }
      } else {
        console.log('🔄 Creating new user');
        // Transform frontend data to API format
        const apiData = {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phoneNumber,
          department: formData.department,
          role: formData.role,
          isActive: formData.isActive,
          password: 'defaultPassword123' // In production, this should be handled properly
        };
        const response = await apiService.createUser(apiData);

        if (response.data) {
          console.log('✅ User created successfully');
          await loadUsers(); // Reload users from API
        } else {
          console.error('❌ Failed to create user:', response.error);
          alert('Failed to create user: ' + (response.error || 'Unknown error'));
          return;
        }
      }

      resetForm();
      setShowAddModal(false);
    } catch (err) {
      console.error('❌ Error submitting user:', err);
      alert('An error occurred while saving the user');
    }
  };

  const handleEdit = (user: UserType) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      department: user.department || '',
      role: user.role,
      isActive: user.isActive
    });
    setShowAddModal(true);
  };

  const handleDelete = (user: UserType) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      if (!canDeleteUser(userToDelete)) {
        alert('Cannot delete user: You cannot delete yourself or the last active administrator.');
        setShowDeleteModal(false);
        setUserToDelete(null);
        return;
      }

      try {
        console.log('🔄 Deleting user:', userToDelete.id);
        const response = await apiService.deleteUser(userToDelete.id);

        if (response.data || response.message) {
          console.log('✅ User deleted successfully');
          await loadUsers(); // Reload users from API
        } else {
          console.error('❌ Failed to delete user:', response.error);
          alert('Failed to delete user: ' + (response.error || 'Unknown error'));
        }
      } catch (err) {
        console.error('❌ Error deleting user:', err);
        alert('An error occurred while deleting the user');
      }

      setUserToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const toggleUserStatus = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    // Can't deactivate yourself
    if (isCurrentUser(userId)) {
      alert('Cannot change your own status.');
      return;
    }

    // Can't deactivate the last active admin
    if (user.role === 'admin' && user.isActive && getAdminCount() <= 1) {
      alert('Cannot deactivate the last active administrator.');
      return;
    }

    try {
      console.log('🔄 Toggling user status:', userId);
      // Transform frontend data to API format
      const apiData = {
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        phone: user.phoneNumber,
        department: user.department,
        role: user.role,
        isActive: !user.isActive
      };
      const response = await apiService.updateUser(userId, apiData);

      if (response.data) {
        console.log('✅ User status updated successfully');
        await loadUsers(); // Reload users from API
      } else {
        console.error('❌ Failed to update user status:', response.error);
        alert('Failed to update user status: ' + (response.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('❌ Error updating user status:', err);
      alert('An error occurred while updating user status');
    }
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    exportUsersData(filteredUsers, format);
    setShowExportMenu(false);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Mobile-Responsive Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your team members</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Download size={18} />
                <span className="sm:inline">Export</span>
              </button>
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <button
                      onClick={() => handleExport('excel')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FileSpreadsheet size={16} />
                      Excel
                    </button>
                    <button
                      onClick={() => handleExport('pdf')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FileText size={16} />
                      PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                resetForm();
                setEditingUser(null);
                setShowAddModal(true);
              }}
              className="w-full sm:w-auto px-4 py-2 bg-orange hover:bg-orange-dark text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-orange-light border border-orange rounded-lg p-4 mb-6">
          <p className="text-orange-dark">Error: {error}</p>
          <button
            onClick={loadUsers}
            className="mt-2 text-sm text-orange hover:text-orange-dark underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Mobile-Responsive Stats */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{users.length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Total Users</div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-green-600">{users.filter(u => u.isActive).length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Active</div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{users.filter(u => u.role === 'admin').length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Admins</div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile-Responsive Search and Filters */}
      {!loading && !error && (
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-3 sm:gap-4">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Mobile-Responsive Users Display */}
      {!loading && !error && (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">User</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Created</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        user.role === 'admin'
                          ? 'bg-orange'
                          : 'bg-dark-slate'
                      }`}>
                        <User size={16} className="text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    {user.phoneNumber && (
                      <div className="text-sm text-gray-500">{user.phoneNumber}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{user.department || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin'
                        ? 'bg-orange-light text-orange-dark'
                        : 'bg-dark-slate-light text-dark-slate-dark'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-light text-orange-dark'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        disabled={isCurrentUser(user.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        disabled={!canDeleteUser(user)}
                        className="p-2 text-gray-400 hover:text-orange disabled:text-gray-300 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            </div>
          </div>

          {/* Mobile Card Layout */}
          <div className="lg:hidden space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      user.role === 'admin'
                        ? 'bg-orange'
                        : 'bg-dark-slate'
                    }`}>
                      <User size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      disabled={isCurrentUser(user.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      disabled={!canDeleteUser(user)}
                      className="p-2 text-gray-400 hover:text-orange disabled:text-gray-300 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Department:</span>
                    <div className="font-medium">{user.department || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <div className="font-medium">{user.phoneNumber || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Role:</span>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-orange-light text-orange-dark'
                          : 'bg-dark-slate-light text-dark-slate-dark'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-light text-orange-dark'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Created: {user.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Mobile-Responsive Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                    {editingUser && isCurrentUser(editingUser.id) && (
                      <span className="text-xs text-gray-500 ml-2">(Cannot change your own role)</span>
                    )}
                    {editingUser && editingUser.role === 'admin' && editingUser.isActive && getAdminCount() <= 1 && (
                      <span className="text-xs text-gray-500 ml-2">(Last active admin)</span>
                    )}
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'user' }))}
                    disabled={editingUser ? !canChangeRole(editingUser, formData.role === 'admin' ? 'user' : 'admin') : false}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      editingUser ? !canChangeRole(editingUser, formData.role === 'admin' ? 'user' : 'admin') : false
                        ? 'bg-gray-100 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    <option value="user">User</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'active' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingUser(null);
                    resetForm();
                  }}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-orange hover:bg-orange-dark text-white rounded-lg transition-colors"
                >
                  {editingUser ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile-Responsive Delete Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete User</h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Are you sure you want to delete "{userToDelete.firstName} {userToDelete.lastName}"? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full sm:flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="w-full sm:flex-1 px-4 py-2 bg-orange text-white rounded-lg hover:bg-orange-dark transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};