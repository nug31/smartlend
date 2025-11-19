import React, { useState } from 'react';
import { Search, Filter, Package, MapPin, Clock, Star, Eye, ShoppingCart, Grid, List } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Item } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

interface ItemCatalogProps {
  onTabChange?: (tab: string) => void;
}

export const ItemCatalog: React.FC<ItemCatalogProps> = ({ onTabChange }) => {
  const { items, categories, searchItems, requestLoan } = useData();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const [showFilters, setShowFilters] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestItem, setRequestItem] = useState<Item | null>(null);
  const [reason, setReason] = useState('');
  const [date, setDate] = useState(''); // tanggal mulai
  const [startTime, setStartTime] = useState(''); // jam mulai
  const [returnDate, setReturnDate] = useState(''); // tanggal pengembalian
  const [returnTime, setReturnTime] = useState(''); // jam pengembalian

  const openRequestForm = (item: Item) => {
    setRequestItem(item);
    setShowRequestForm(true);
    setReason('');
    setDate('');
    setStartTime('');
    setReturnDate('');
  };

  const closeRequestForm = () => {
    setShowRequestForm(false);
    setRequestItem(null);
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !requestItem) {
      console.error('❌ Missing user or requestItem:', { user, requestItem });
      return;
    }

    try {
      const startDate = new Date(date + 'T' + (startTime || '09:00'));
      const endDate = new Date(returnDate + 'T17:00');

      console.log('🔄 Submitting loan request for:', requestItem.name);
      console.log('👤 User:', user);
      console.log('📦 Item:', requestItem);
      console.log('📅 Dates:', { startDate, endDate });

      const loanData = {
        itemId: requestItem.id,
        userId: user.id,
        quantity: 1,
        startDate,
        endDate,
        purpose: reason,
        status: 'pending' as const
      };

      console.log('📋 Loan data to send:', loanData);

      await requestLoan(loanData);

      setShowRequestForm(false);
      setRequestItem(null);

      console.log('✅ Loan request completed successfully');

      // Show success notification
      addNotification({
        type: 'success',
        title: 'Request Submitted! 📝',
        message: `Your request for "${requestItem.name}" has been submitted. Check My Loans > Pending tab.`,
        duration: 8000
      });

      // Auto redirect to My Loans page to see pending request
      if (onTabChange) {
        setTimeout(() => {
          onTabChange('my-loans');
        }, 500); // Small delay to show notification first
      }
    } catch (error) {
      console.error('❌ Error submitting loan request:', error);
      addNotification({
        type: 'error',
        title: 'Request Failed',
        message: `Failed to submit request for "${requestItem?.name}". Please try again.`,
        duration: 5000
      });
    }
  };



  const filteredItems = React.useMemo(() => {
    let filtered = searchQuery ? searchItems(searchQuery) : items;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (selectedCondition !== 'all') {
      filtered = filtered.filter(item => item.condition === selectedCondition);
    }
    
    // Sort items
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'condition':
          return a.condition.localeCompare(b.condition);
        case 'availability':
          return b.availableQuantity - a.availableQuantity;
        case 'value':
          return b.value - a.value;
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [items, searchQuery, selectedCategory, selectedCondition, sortBy, searchItems]);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (item: Item) => {
    if (item.availableQuantity === 0) return 'bg-red-100 text-red-800';
    if (item.availableQuantity <= 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };



  const ItemCard: React.FC<{ item: Item }> = ({ item }) => (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-orange-300 transition-all duration-300">
      {/* Mobile-optimized Content */}
      <div className="p-3 sm:p-4 space-y-3">
        {/* Header with Badges */}
        <div className="flex items-start justify-between gap-2">
          {/* Condition Badge */}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
            {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
          </span>

          {/* Availability Badge */}
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getAvailabilityColor(item)}`}>
            {item.availableQuantity > 0 ? 'In Stock' : 'Out'}
          </span>
        </div>

        {/* Item Name */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {item.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{item.description}</p>
        </div>

        {/* Item Details */}
        <div className="space-y-2">
          {/* Category with Icon */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Package size={12} className="text-blue-600" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">{item.category}</span>
          </div>

          {/* Location if available */}
          {item.location && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin size={12} className="text-green-600" />
              </div>
              <span className="text-xs sm:text-sm text-gray-600 truncate">{item.location}</span>
            </div>
          )}

          {/* Availability */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Star size={12} className="text-purple-600" />
              </div>
              <span className="text-xs sm:text-sm text-gray-600">Available</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              {item.availableQuantity}
            </span>
          </div>
        </div>

        {/* Mobile-optimized Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          {/* Request Button - Full Width & Prominent */}
          {item.availableQuantity > 0 ? (
            <button
              style={{ backgroundColor: '#E9631A', color: '#FFFFFF' }}
              className="w-full px-4 py-3 sm:py-3.5 rounded-lg shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-bold text-sm sm:text-base transition-all duration-200 min-h-[48px]"
              onClick={() => openRequestForm(item)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C54A0A'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E9631A'}
            >
              <ShoppingCart size={18} strokeWidth={2.5} />
              <span>Request Item</span>
            </button>
          ) : (
            <button
              style={{ backgroundColor: '#9CA3AF', color: '#4B5563' }}
              className="w-full px-4 py-3 sm:py-3.5 rounded-lg cursor-not-allowed flex items-center justify-center gap-2 font-bold text-sm sm:text-base min-h-[48px]"
            >
              <Clock size={18} strokeWidth={2.5} />
              <span>Unavailable</span>
            </button>
          )}

          {/* Quick View Button - Secondary */}
          <button
            style={{ backgroundColor: '#E5E7EB', color: '#1F2937' }}
            className="w-full px-3 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium min-h-[44px]"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D1D5DB'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E5E7EB'}
          >
            <Eye size={14} />
            <span>View Details</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-6">
      {notification && (
        <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg text-center font-medium text-sm sm:text-base">
          {notification}
        </div>
      )}
      {/* Mobile-optimized Request Form Modal with Sticky Buttons */}
      {showRequestForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-50 p-0 sm:p-4 pb-0">
          <form onSubmit={handleRequestSubmit} className="bg-white rounded-t-2xl sm:rounded-xl shadow-lg w-full max-w-md max-h-[85vh] sm:max-h-[90vh] mb-16 sm:mb-0 flex flex-col">
            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-3 sm:space-y-4">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 sticky top-0 bg-white pb-2 -mt-1 z-10">Request Item</h2>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Item</label>
                <input type="text" value={requestItem?.name || ''} readOnly className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-sm sm:text-base" />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Reason</label>
                <textarea value={reason} onChange={e => setReason(e.target.value)} required className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-gray-300 rounded-lg text-sm sm:text-base min-h-[60px] sm:min-h-[80px] resize-none" placeholder="Enter your reason..." />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Start Date</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full px-2 sm:px-3 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg text-sm sm:text-base" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Return Date</label>
                  <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} required className="w-full px-2 sm:px-3 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg text-sm sm:text-base" />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Start Time</label>
                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg text-sm sm:text-base" />
              </div>
            </div>

            {/* Sticky Buttons at Bottom - Above Bottom Nav */}
            <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 p-3 sm:p-5 flex gap-2 sm:gap-3 rounded-b-2xl sm:rounded-b-xl shadow-lg">
              <button type="button" onClick={closeRequestForm} className="flex-1 px-4 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 active:bg-gray-400 transition-colors font-medium text-sm sm:text-base min-h-[48px]">Cancel</button>
              <button type="submit" style={{ backgroundColor: '#E9631A', color: '#FFFFFF' }} className="flex-1 px-4 py-3 rounded-lg hover:shadow-lg active:shadow-xl transition-all font-bold text-sm sm:text-base min-h-[48px]">Submit</button>
            </div>
          </form>
        </div>
      )}
      {/* Mobile-optimized Header */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 sm:p-6 border border-orange-200">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Item Catalog</h1>
            <p className="text-gray-600 text-xs sm:text-sm lg:text-base">Discover and request items from our inventory</p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex-1 bg-white rounded-lg px-3 sm:px-4 py-2 shadow-sm border">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-orange-600">{items.length}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
            </div>
            <div className="flex-1 bg-white rounded-lg px-3 sm:px-4 py-2 shadow-sm border">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-600">
                  {items.reduce((sum, item) => sum + item.availableQuantity, 0)}
                </div>
                <div className="text-xs text-gray-600">Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-optimized Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            style={showFilters ? { backgroundColor: '#E9631A', color: '#FFFFFF' } : {}}
            className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-3 border-2 rounded-lg transition-all font-medium min-h-[48px] ${
              showFilters ? '' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>

        {/* Mobile-optimized Filters */}
        {showFilters && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
                >
                  <option value="all">All Conditions</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
                >
                  <option value="name">Name</option>
                  <option value="category">Category</option>
                  <option value="condition">Condition</option>
                  <option value="availability">Availability</option>
                  <option value="value">Value</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile-optimized Results */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-sm sm:text-base text-gray-600 font-medium">
          Showing <span className="text-orange-600">{filteredItems.length}</span> of {items.length} items
        </p>

        <div className="flex items-center gap-2">
          <Package className="text-gray-400" size={16} />
          <span className="text-sm text-gray-600">
            {items.reduce((sum, item) => sum + item.availableQuantity, 0)} available
          </span>
        </div>
      </div>

      {/* Mobile-optimized Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 text-center py-12 sm:py-16 px-4">
          <Package className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">Try adjusting your search criteria or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};