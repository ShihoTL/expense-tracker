'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useExpenseStore } from '@/stores/expense-store';
import { CATEGORIES, PAYMENT_METHODS } from '@/lib/constants';
import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';

export function RecentExpenses() {
  const { expenses, deleteExpense } = useExpenseStore();
  
  // Get the 5 most recent expenses
  const recentExpenses = expenses
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  const getCategoryInfo = (categoryId: string) => {
    return CATEGORIES.find(c => c.id === categoryId);
  };

  const getPaymentMethodInfo = (methodId: string) => {
    return PAYMENT_METHODS.find(p => p.id === methodId);
  };

  if (recentExpenses.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No expenses found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recentExpenses.map((expense) => {
        const category = getCategoryInfo(expense.category);
        const paymentMethod = getPaymentMethodInfo(expense.paymentMethod);
        
        return (
          <div
            key={expense.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: category?.color }}
              >
                {category?.name.charAt(0)}
              </div>
              
              <div className="space-y-1">
                <p className="font-medium">{expense.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{format(expense.date, 'MMM dd, yyyy')}</span>
                  <span>•</span>
                  <span>{category?.name}</span>
                  <span>•</span>
                  <span>{paymentMethod?.name}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="font-semibold text-lg">${expense.amount.toFixed(2)}</p>
                {expense.tags.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {expense.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex gap-1 ml-4">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => deleteExpense(expense.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}