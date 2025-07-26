'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useExpenseStore } from '@/stores/expense-store';
import { useBudgetStore } from '@/stores/budget-store';
import { CATEGORIES } from '@/lib/constants';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { 
  PlusCircle, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Target,
  DollarSign,
} from 'lucide-react';
import { BudgetModal } from '@/components/budget/budget-modal';

export default function BudgetPage() {
  const { expenses } = useExpenseStore();
  const { budgets } = useBudgetStore();
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  // Calculate current month expenses by category
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const monthlyExpenses = expenses.filter(expense => 
    expense.date >= monthStart && expense.date <= monthEnd
  );

  const expensesByCategory = monthlyExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);
  const remainingBudget = totalBudget - totalSpent;

  const getBudgetStatus = (spent: number, budgeted: number) => {
    const percentage = (spent / budgeted) * 100;
    if (percentage >= 100) return 'over';
    if (percentage >= 80) return 'warning';
    return 'good';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'over': return 'text-destructive';
      case 'warning': return 'text-warning';
      default: return 'text-success';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'over': return <TrendingUp className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      default: return <TrendingDown className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget</h1>
          <p className="text-muted-foreground">
            Track your spending against your budget goals
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setShowBudgetModal(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Budget
          </Button>
        </div>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {format(currentMonth, 'MMMM yyyy')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {((totalSpent / totalBudget) * 100).toFixed(1)}% of budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-success' : 'text-destructive'}`}>
              ${Math.abs(remainingBudget).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {remainingBudget >= 0 ? 'Under budget' : 'Over budget'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Badge variant="secondary">{budgets.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgets.length}</div>
            <p className="text-xs text-muted-foreground">
              Budget categories set
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {budgets.map((budget) => {
              const category = CATEGORIES.find(c => c.id === budget.categoryId);
              const spent = expensesByCategory[budget.categoryId] || 0;
              const percentage = Math.min((spent / budget.amount) * 100, 100);
              const status = getBudgetStatus(spent, budget.amount);

              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category?.color }}
                      />
                      <span className="font-medium">{category?.name}</span>
                      <Badge variant="outline" className={getStatusColor(status)}>
                        {getStatusIcon(status)}
                        {status === 'over' ? 'Over Budget' : 
                         status === 'warning' ? 'Near Limit' : 'On Track'}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        ${spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-2"
                    style={{
                      '--progress-background': status === 'over' ? 'hsl(var(--destructive))' : 
                                             status === 'warning' ? 'hsl(var(--warning))' : 
                                             'hsl(var(--primary))'
                    } as React.CSSProperties}
                  />
                </div>
              );
            })}

            {budgets.length === 0 && (
              <div className="text-center py-8">
                <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No budgets set</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first budget to start tracking your spending goals
                </p>
                <Button onClick={() => setShowBudgetModal(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Budget
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <BudgetModal 
        open={showBudgetModal}
        onOpenChange={setShowBudgetModal}
        onClose={() => setShowBudgetModal(false)}
      />
    </div>
  );
}