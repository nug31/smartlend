export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: Date;
  isActive: boolean;
  phoneNumber?: string;
  department?: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  quantity: number;
  availableQuantity: number;
  qrCode: string;
  location: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  maintenanceSchedule?: Date;
}

export interface Loan {
  id: string;
  itemId: string;
  userId: string;
  quantity: number;
  startDate: Date;
  endDate: Date;
  actualReturnDate?: Date;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'overdue' | 'returned' | 'cancelled';
  purpose?: string;
  notes?: string;
  approvedBy?: string;
  approvedAt?: Date;
  requestedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  remindersSent?: number;
  extensionRequested?: boolean;
  extensionApproved?: boolean;
  extensionEndDate?: Date;
  // Associated data from backend
  user?: {
    id: string;
    name: string;
    email: string;
    department?: string;
  };
  item?: {
    id: string;
    name: string;
    category: string;
    location?: string;
  };
  approver?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  itemCount: number;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: 'loan_due' | 'loan_approved' | 'loan_rejected' | 'item_returned' | 'maintenance_due' | 'new_loan_request' | 'test';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  relatedId?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: Date;
  ipAddress: string;
}

export interface DashboardStats {
  totalItems: number;
  activeLoans: number;
  pendingRequests: number;
  overdueItems: number;
  totalUsers: number;
  categoryBreakdown: { category: string; count: number }[];
  loanTrends: { date: string; count: number }[];
}