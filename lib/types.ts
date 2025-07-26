export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
  preferences: {
    theme: 'light' | 'dark';
    currency: string;
    notifications: boolean;
  };
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  subcategory?: string;
  description: string;
  date: Date;
  paymentMethod: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  icon: string;
  color: string;
  parentId?: string;
  isDefault: boolean;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: Date;
  endDate: Date;
}

export interface ExpenseFormData {
  amount: string;
  category: string;
  subcategory?: string;
  description: string;
  date: Date;
  paymentMethod: string;
  tags: string[];
}