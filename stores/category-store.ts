import { create } from 'zustand';
import { Category } from '@/lib/types';
import { mockCategories } from '@/lib/mock-data';

interface CategoryState {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

export const useCategoryStore = create<CategoryState>()((set) => ({
  categories: mockCategories,
  
  addCategory: (categoryData) => {
    const newCategory: Category = {
      ...categoryData,
      id: Math.random().toString(36).substr(2, 9),
    };
    set((state) => ({ 
      categories: [...state.categories, newCategory],
    }));
  },
  
  updateCategory: (id, updates) => {
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id === id ? { ...category, ...updates } : category
      ),
    }));
  },
  
  deleteCategory: (id) => {
    set((state) => ({
      categories: state.categories.filter((category) => category.id !== id),
    }));
  },
}));