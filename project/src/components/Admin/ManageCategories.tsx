import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Category } from '../../types';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';

const ManageCategories: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useData();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitTimeoutRef = useRef<number | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Package',
    color: '#3b82f6'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: 'Package',
      color: '#3b82f6'
    });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color
    });
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSubmitting) {
      console.log('⏳ Already submitting, ignoring...');
      return false;
    }

    // Clear any existing timeout
    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current);
    }

    setIsSubmitting(true);
    
    const categoryData = {
      name: formData.name,
      description: formData.description,
      icon: formData.icon,
      color: formData.color,
      itemCount: editingCategory ? editingCategory.itemCount : 0
    };

    // Use timeout to prevent rapid multiple submissions
    submitTimeoutRef.current = window.setTimeout(async () => {
      try {
        if (editingCategory) {
          console.log('🔄 Updating category:', editingCategory.id, categoryData);
          await updateCategory(editingCategory.id, categoryData);
          console.log('✅ Category update completed');
          setEditingCategory(null);
        } else {
          console.log('🔄 Adding new category:', categoryData);
          await addCategory(categoryData);
          console.log('✅ Category add completed');
        }

        resetForm();
        setShowAddModal(false);
      } catch (error) {
        console.error('❌ Error in handleSubmit:', error);
        alert(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsSubmitting(false);
        submitTimeoutRef.current = null;
      }
    }, 300); // 300ms debounce
  };

  const handleDelete = async (category: Category) => {
    if (window.confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      try {
        await deleteCategory(category.id);
        setCategoryToDelete(null);
      } catch (error) {
        console.error('Error deleting category:', error);
        alert(error instanceof Error ? error.message : 'Failed to delete category');
      }
    }
  };

  const iconOptions = [
    'Package', 'Laptop', 'Wrench', 'Book', 'Home', 'Trophy', 'Camera', 'Volume2',
    'Smartphone', 'Monitor', 'Headphones', 'Gamepad2', 'Car', 'Bike', 'Coffee',
    'Utensils', 'Shirt', 'Watch', 'Glasses', 'Heart'
  ];

  const colorOptions = [
    '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899',
    '#06b6d4', '#84cc16', '#f97316', '#6366f1', '#14b8a6', '#f43f5e'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Categories</h2>
        <button
          onClick={() => {
            resetForm();
            setEditingCategory(null);
            setShowAddModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-md p-6 border-l-4"
            style={{ borderLeftColor: category.color }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg text-white"
                  style={{ backgroundColor: category.color }}
                >
                  <Tag className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {category.itemCount} items
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(category)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCategory(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting
                    ? (editingCategory ? 'Updating...' : 'Adding...')
                    : (editingCategory ? 'Update Category' : 'Add Category')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
