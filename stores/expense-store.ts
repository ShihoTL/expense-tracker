import { create } from 'zustand';
import { Expense } from '@/lib/types';
import { mockExpenses } from '@/lib/mock-data';

interface ExpenseState {
  expenses: Expense[];
  filteredExpenses: Expense[];
  searchTerm: string;
  selectedCategory: string;
  dateRange: { from: Date | null; to: Date | null };
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setDateRange: (range: { from: Date | null; to: Date | null }) => void;
  filterExpenses: () => void;
}

export const useExpenseStore = create<ExpenseState>()((set, get) => ({
  expenses: mockExpenses,
  filteredExpenses: mockExpenses,
  searchTerm: '',
  selectedCategory: 'all',
  dateRange: { from: null, to: null },
  
  addExpense: (expenseData) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({ 
      expenses: [newExpense, ...state.expenses],
    }));
    get().filterExpenses();
  },
  
  updateExpense: (id, updates) => {
    set((state) => ({
      expenses: state.expenses.map((expense) =>
        expense.id === id 
          ? { ...expense, ...updates, updatedAt: new Date() }
          : expense
      ),
    }));
    get().filterExpenses();
  },
  
  deleteExpense: (id) => {
    set((state) => ({
      expenses: state.expenses.filter((expense) => expense.id !== id),
    }));
    get().filterExpenses();
  },
  
  setSearchTerm: (searchTerm) => {
    set({ searchTerm });
    get().filterExpenses();
  },
  
  setSelectedCategory: (selectedCategory) => {
    set({ selectedCategory });
    get().filterExpenses();
  },
  
  setDateRange: (dateRange) => {
    set({ dateRange });
    get().filterExpenses();
  },
  
  filterExpenses: () => {
    const { expenses, searchTerm, selectedCategory, dateRange } = get();
    
    let filtered = expenses.filter((expense) => {
      const matchesSearch = !searchTerm || 
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
      
      const matchesDateRange = !dateRange.from || !dateRange.to ||
        (expense.date >= dateRange.from && expense.date <= dateRange.to);
      
      return matchesSearch && matchesCategory && matchesDateRange;
    });
    
    set({ filteredExpenses: filtered });
  },
}));