import { create } from 'zustand';
import { Budget } from '@/lib/types';
import { mockBudgets } from '@/lib/mock-data';

interface BudgetState {
  budgets: Budget[];
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
}

export const useBudgetStore = create<BudgetState>()((set) => ({
  budgets: mockBudgets,
  
  addBudget: (budgetData) => {
    const newBudget: Budget = {
      ...budgetData,
      id: Math.random().toString(36).substr(2, 9),
    };
    set((state) => ({ 
      budgets: [...state.budgets, newBudget],
    }));
  },
  
  updateBudget: (id, updates) => {
    set((state) => ({
      budgets: state.budgets.map((budget) =>
        budget.id === id ? { ...budget, ...updates } : budget
      ),
    }));
  },
  
  deleteBudget: (id) => {
    set((state) => ({
      budgets: state.budgets.filter((budget) => budget.id !== id),
    }));
  },
}));