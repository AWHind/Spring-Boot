// User & Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'client' | 'admin';
  createdAt: Date;
  phone?: string;
  adresse?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: 'client' | 'admin') => void;
  setUser: (user: User | null) => void;
}

// Menu & Dishes Types
export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'appetizers' | 'main' | 'desserts' | 'beverages' | 'specials';
  available: boolean;
  rating: number;
  reviews: number;
}

export interface CartItem {
  dish: Dish;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  total: number;
  tax: number;
  subtotal: number;
  addItem: (dish: Dish, quantity: number) => void;
  removeItem: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
}

// Order Types
export enum OrderStatus {
  PENDING = 'Pending',
  VALIDATED = 'Validated',
  CANCELLED = 'Cancelled',
  DELIVERED = 'Delivered'
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: OrderStatus;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  deliveryAdresse?: string;
  notes?: string;
  canCancelUntil?: Date; // Order can be cancelled until this time (15 minutes from creation)
}

export interface OrderContextType {
  orders: Order[];
  placeOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  cancelOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrdersByUser: (userId: string) => Order[];
  getOrdersByStatus: (status: OrderStatus) => Order[];
}

// Promotion Types
export interface Promotion {
  id: string;
  code: string;
  description: string;
  discountPercentage: number;
  discountAmount?: number;
  active: boolean;
  startDate: Date;
  endDate: Date;
  targetUserId?: string; // For personalized promotions
}

// Admin Types
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalCustomers: number;
  ordersToday: number;
  revenueToday: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: Date;
  loyaltyTier: 'bronze' | 'silver' | 'gold';
}

// Forecast Types
export interface ForecastRequest {
  period: 'week' | 'month' | 'quarter';
  metric: 'revenue' | 'orders' | 'customers';
}

export interface ForecastResult {
  metric: string;
  period: string;
  predictions: Array<{
    date: string;
    value: number;
  }>;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
}
