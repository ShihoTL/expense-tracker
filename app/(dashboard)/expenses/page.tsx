'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useExpenseStore } from '@/stores/expense-store';
import { CATEGORIES, PAYMENT_METHODS } from '@/lib/constants';
import { format } from 'date-fns';
import { Edit, Filter, PlusCircle, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { ExpenseModal } from '@/components/expenses/expense-modal';

export default function ExpensesPage() {
  const { 
    filteredExpenses, 
    searchTerm, 
    selectedCategory,
    setSearchTerm, 
    setSelectedCategory,
    deleteExpense 
  } = useExpenseStore();
  
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const getCategoryInfo = (categoryId: string) => {
    return CATEGORIES.find(c => c.id === categoryId);
  };

  const getPaymentMethodInfo = (methodId: string) => {
    return PAYMENT_METHODS.find(p => p.id === methodId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">
            Manage and track all your expenses
          </p>
        </div>
        <Button onClick={() => setShowExpenseModal(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Expenses ({filteredExpenses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredExpenses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No expenses found</p>
              <Button 
                className="mt-4" 
                onClick={() => setShowExpenseModal(true)}
              >
                Add your first expense
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredExpenses.map((expense) => {
                const category = getCategoryInfo(expense.category);
                const paymentMethod = getPaymentMethodInfo(expense.paymentMethod);
                
                return (
                  <div 
                    key={expense.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium"
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
                        {expense.tags.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {expense.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-xl">${expense.amount.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setEditingExpense(expense);
                            setShowExpenseModal(true);
                          }}
                        >
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
          )}
        </CardContent>
      </Card>

      <ExpenseModal 
        open={showExpenseModal}
        onOpenChange={setShowExpenseModal}
        expense={editingExpense}
        onClose={() => {
          setShowExpenseModal(false);
          setEditingExpense(null);
        }}
      />
    </div>
  );
}