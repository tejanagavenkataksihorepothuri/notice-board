export interface Notice {
  _id: string;
  title: string;
  description: string;
  image?: string;
  images?: string[]; // Multiple images support
  targetAudience: string;
  expiryDate: string;
  isActive: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  _id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  admin: Admin;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}

export interface NoticesResponse {
  success: boolean;
  notices: Notice[];
  pagination: {
    current: number;
    pages: number;
    total: number;
  };
}

export interface NoticeFormData {
  title: string;
  description: string;
  targetAudience: string;
  expiryDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  tags: string[];
  image?: FileList; // For backward compatibility
  images?: FileList; // For multiple images
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  name: string;
}

export interface FilterOptions {
  audience?: string;
  search?: string;
  page?: number;
  limit?: number;
  includeExpired?: boolean;
}

export interface DashboardStats {
  total: number;
  active: number;
  expired: number;
  byAudience: Array<{ _id: string; count: number }>;
  byPriority: Array<{ _id: string; count: number }>;
}

export const AUDIENCE_OPTIONS = [
  'All',
  'CSE',
  'ECE',
  'Mechanical',
  'Civil',
  'IT',
  'Hostel',
  'Library',
  'Sports',
  'Cultural'
] as const;

export const PRIORITY_OPTIONS = [
  'Low',
  'Medium',
  'High',
  'Urgent'
] as const;
