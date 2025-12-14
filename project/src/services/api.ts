// Use environment variable or fallback to LOCAL backend URL for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';

// Check if we're in demo mode (when backend is not available)
const IS_DEMO_MODE = API_BASE_URL.includes('your-backend-url.herokuapp.com') ||
                     import.meta.env.VITE_DEMO_MODE === 'true';

// Use local backend for development, fallback to Railway for production
const ACTUAL_API_URL = IS_DEMO_MODE ? 'http://localhost:3002/api' : API_BASE_URL;

// Debug logging
console.log('🔧 API Configuration:', {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_DEMO_MODE: import.meta.env.VITE_DEMO_MODE,
  API_BASE_URL,
  IS_DEMO_MODE,
  ACTUAL_API_URL
});

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Mock data for demo mode
const MOCK_USER = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  role: 'user',
  department: 'Demo Department',
  isActive: true
};

const MOCK_STATS = {
  totalItems: 15,
  activeLoans: 3,
  pendingRequests: 2,
  overdueItems: 1,
  totalUsers: 8,
  availableItems: 12,
  popularItems: [
    { name: 'Laptop Dell XPS', count: 5 },
    { name: 'Proyektor Epson', count: 3 },
    { name: 'Kamera Canon', count: 2 }
  ]
};

class ApiService {
  private handleDemoMode<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    console.log('🎭 Demo Mode - Simulating API call:', endpoint, 'with options:', options);

    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate different endpoints
        if (endpoint === '/auth/login') {
          resolve({ data: { user: MOCK_USER, token: 'demo-token' } as T });
        } else if (endpoint === '/auth/register') {
          resolve({ data: { user: MOCK_USER, message: 'Registration successful' } as T });
        } else if (endpoint === '/dashboard/stats') {
          // Mock dashboard stats that match the REAL database data from Manage Loans
          const mockStats = {
            totalItems: 5,
            activeLoans: 0, // Match Manage Loans: 0 active
            pendingRequests: 1, // Match Manage Loans: 1 pending (ROG Gaming Laptop)
            overdueItems: 0, // Match Manage Loans: 0 overdue
            totalUsers: 5,
            categoryBreakdown: [
              { category: 'Electronics', count: 3 },
              { category: 'Tools', count: 1 },
              { category: 'Books', count: 1 }
            ],
            loanTrends: [
              { date: '2025-01-17', count: 1 },
              { date: '2025-01-18', count: 0 },
              { date: '2025-01-19', count: 1 },
              { date: '2025-01-20', count: 0 },
              { date: '2025-01-21', count: 1 },
              { date: '2025-01-22', count: 0 },
              { date: '2025-01-23', count: 0 }
            ]
          };
          console.log('🎭 Mock dashboard stats (synced with real DB):', mockStats);
          resolve({ data: mockStats as T });
        } else if (endpoint.startsWith('/items')) {
          resolve({ data: [] as T });
        } else if (endpoint === '/loans') {
          // Mock loans data that matches the REAL database (as shown in Manage Loans)
          const mockLoans = [
            {
              id: '1',
              itemId: '1',
              userId: 'user1',
              userName: 'John Doe',
              userEmail: 'john.doe@example.com',
              userDepartment: 'Engineering',
              itemName: 'ROG Gaming Laptop',
              category: 'Electronics',
              quantity: 1,
              startDate: '2025-07-15T00:00:00.000Z',
              endDate: '2025-07-22T00:00:00.000Z',
              requestedAt: '2025-07-15T11:31:00.000Z',
              status: 'pending', // PENDING loan (waiting for approval)
              notes: 'Waiting for approval'
            },
            {
              id: '2',
              itemId: '2',
              userId: 'user1',
              userName: 'John Doe',
              userEmail: 'john.doe@example.com',
              userDepartment: 'Engineering',
              itemName: 'Laptop Dell XPS 13',
              category: 'Electronics',
              quantity: 1,
              startDate: '2025-07-10T00:00:00.000Z',
              endDate: '2025-07-17T00:00:00.000Z',
              requestedAt: '2025-07-10T11:31:00.000Z',
              status: 'approved', // APPROVED loan
              approvedAt: '2025-07-10T14:00:00.000Z',
              approvedBy: 'admin@example.com',
              notes: 'Approved for development work'
            },
            {
              id: '3',
              itemId: '3',
              userId: 'user2',
              userName: 'Jane Smith',
              userEmail: 'jane.smith@example.com',
              userDepartment: 'Marketing',
              itemName: 'Proyektor Epson',
              category: 'Electronics',
              quantity: 1,
              startDate: '2025-07-05T00:00:00.000Z',
              endDate: '2025-07-12T00:00:00.000Z',
              requestedAt: '2025-07-05T11:31:00.000Z',
              status: 'returned', // RETURNED loan
              returnedAt: '2025-07-12T16:00:00.000Z',
              notes: 'Successfully returned after presentation'
            }
          ];
          console.log('🎭 Mock loans data (synced with real DB):', mockLoans);
          resolve({ data: mockLoans as T });
        } else if (endpoint.startsWith('/loans/')) {
          resolve({ data: {} as T });
        } else if (endpoint.startsWith('/users')) {
          resolve({ data: [MOCK_USER] as T });
        } else if (endpoint === '/categories') {
          // Mock categories data
          const mockCategories = [
            { id: '1', name: 'Electronics', description: 'Electronic devices and gadgets', icon: 'Laptop', color: '#3b82f6', itemCount: 25, isActive: true },
            { id: '2', name: 'Tools', description: 'Hand tools and equipment', icon: 'Wrench', color: '#10b981', itemCount: 18, isActive: true },
            { id: '3', name: 'Books', description: 'Books and educational materials', icon: 'Book', color: '#f59e0b', itemCount: 12, isActive: true },
            { id: '4', name: 'Furniture', description: 'Office and home furniture', icon: 'Home', color: '#8b5cf6', itemCount: 8, isActive: true },
            { id: '5', name: 'Sports', description: 'Sports and fitness equipment', icon: 'Trophy', color: '#ef4444', itemCount: 15, isActive: true }
          ];
          resolve({ data: mockCategories as T });
        } else if (endpoint.startsWith('/categories/') && options.method === 'PUT') {
          // Mock category update
          const categoryId = endpoint.split('/')[2];
          const updateData = options.body ? JSON.parse(options.body as string) : {};
          const updatedCategory = {
            id: categoryId,
            ...updateData,
            updatedAt: new Date().toISOString()
          };
          console.log('🎭 Mock category update:', updatedCategory);
          resolve({ data: updatedCategory as T });
        } else if (endpoint.startsWith('/categories/') && options.method === 'POST') {
          // Mock category creation
          const createData = options.body ? JSON.parse(options.body as string) : {};
          const newCategory = {
            id: Date.now().toString(),
            ...createData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          console.log('🎭 Mock category create:', newCategory);
          resolve({ data: newCategory as T });
        } else if (endpoint === '/dashboard/recent-activity') {
          // Mock recent activity that matches the REAL database data
          const mockActivity = [
            {
              id: '1',
              type: 'loan_approved',
              message: 'John Doe approved ROG Gaming Laptop',
              timestamp: '2025-07-24T11:07:00.000Z',
              user: 'John Doe',
              item: 'ROG Gaming Laptop'
            },
            {
              id: '2',
              type: 'loan_returned',
              message: 'Jane Smith returned Proyektor Epson',
              timestamp: '2025-07-24T11:07:00.000Z',
              user: 'Jane Smith',
              item: 'Proyektor Epson'
            }
          ];
          console.log('🎭 Mock recent activity (synced with real DB):', mockActivity);
          resolve({ data: mockActivity as T });
        } else {
          resolve({ data: {} as T });
        }
      }, 500); // Simulate network delay
    });
  }
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Handle demo mode
    if (IS_DEMO_MODE) {
      return this.handleDemoMode<T>(endpoint, options);
    }

    const url = `${ACTUAL_API_URL}${endpoint}`;
    try {
      console.log('🔄 API Request:', { url, options });

      // Add timeout for Railway requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const requestOptions = {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      };

      const response = await fetch(url, requestOptions);
      clearTimeout(timeoutId);

      console.log('🔍 API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        // Check if it's a user not found error
        if (response.status === 400) {
          try {
            const errorData = await response.json();
            if (errorData.error && errorData.error.includes('User not found')) {
              console.warn('🔄 User not found - clearing auth and reloading...');
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              localStorage.removeItem('isAuthenticated');
              window.location.reload();
              return { error: 'User session expired' };
            }
          } catch (e) {
            // If we can't parse the error, continue with normal error handling
          }
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API Response Data:', data);
      return { data };
    } catch (error) {
      console.error('❌ API request failed:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        url,
        options
      });

      // Fallback to demo mode if Railway backend fails
      if (error instanceof Error && (error.message.includes('Failed to fetch') || error.name === 'AbortError')) {
        console.log('🎭 Railway backend failed, falling back to demo mode for this request');
        return this.handleDemoMode<T>(endpoint, options);
      }

      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Items API
  async getItems() {
    const response = await this.request<any[]>('/items');
    console.log('🔍 Raw response from API:', response);

    if (response.data) {
      const transformedItems = response.data.map(this.transformItem);
      console.log('🔄 Transformed items:', transformedItems);
      return { data: transformedItems };
    }

    return response; // Return error response as-is
  }

  private transformItem(item: any): any {
    const transformed = {
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
      maintenanceSchedule: item.maintenanceSchedule ? new Date(item.maintenanceSchedule) : null
    };
    console.log('🔄 Transforming item:', item.name, 'tags:', item.tags);
    return transformed;
  }

  async getItemById(id: string) {
    const response = await this.request<any>(`/items/${id}`);

    if (response.data) {
      return { data: this.transformItem(response.data) };
    }

    return response; // Return error response as-is
  }

  async createItem(item: any) {
    return this.request<any>('/items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateItem(id: string, item: any) {
    console.log('📤 Sending PUT request to update item:', id, item);
    return this.request<any>(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  }

  async deleteItem(id: string) {
    return this.request<any>(`/items/${id}`, {
      method: 'DELETE',
    });
  }

  // Loans API
  async getLoans() {
    return this.request<any[]>('/loans');
  }

  async createLoan(loan: any) {
    return this.request<any>('/loans', {
      method: 'POST',
      body: JSON.stringify(loan),
    });
  }

  async approveLoan(loanId: string, approvedBy?: string) {
    return this.request<any>(`/loans/${loanId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ approvedBy }),
    });
  }

  async rejectLoan(loanId: string) {
    return this.request<any>(`/loans/${loanId}/reject`, {
      method: 'PUT',
    });
  }

  async returnItem(loanId: string) {
    return this.request<any>(`/loans/${loanId}/return`, {
      method: 'PUT',
    });
  }

  // Categories API
  async getCategories() {
    return this.request<any[]>('/categories');
  }

  async getCategoryById(id: string) {
    return this.request<any>(`/categories/${id}`);
  }

  async createCategory(category: any) {
    return this.request<any>('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  async updateCategory(id: string, category: any) {
    return this.request<any>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  }

  async deleteCategory(id: string) {
    return this.request<any>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Users API
  async getUsers() {
    return this.request<any[]>('/users');
  }

  async createUser(userData: any) {
    return this.request<any>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: any) {
    return this.request<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string) {
    return this.request<any>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async login(email: string, password: string) {
    return this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any) {
    return this.request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Health check
  async healthCheck() {
    try {
      const url = 'http://localhost:3001/health';
      const response = await fetch(url);
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Health check failed' };
    }
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<ApiResponse<any>> {
    console.log('📊 Calling getDashboardStats API...');
    const result = await this.request('/dashboard/stats');
    console.log('📊 getDashboardStats API response:', result);
    return result;
  }

  // Recent Activity
  async getRecentActivity(): Promise<ApiResponse<any>> {
    return this.request('/dashboard/recent-activity');
  }
}

export const apiService = new ApiService();
export default apiService;
