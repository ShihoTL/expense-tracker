'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  CreditCard, 
  DollarSign, 
  PlusCircle,
  TrendingUp,
} from 'lucide-react';
import { useExpenseStore } from '@/stores/expense-store';
import { CATEGORIES } from '@/lib/constants';
import Link from 'next/link';
import { ExpenseChart } from '@/components/charts/expense-chart';
import { CategoryChart } from '@/components/charts/category-chart';
import { RecentExpenses } from '@/components/expenses/recent-expenses';

export default function DashboardPage() {
  const { expenses } = useExpenseStore();

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const thisMonthExpenses = expenses
    .filter(expense => {
      const now = new Date();
      const expenseMonth = expense.date.getMonth();
      const expenseYear = expense.date.getFullYear();
      return expenseMonth === now.getMonth() && expenseYear === now.getFullYear();
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your expenses and manage your budget
          </p>
        </div>
        <Link href="/expenses/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-destructive flex items-center">
                <ArrowUpIcon className="mr-1 h-3 w-3" />
                +8.2%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${thisMonthExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success flex items-center">
                <ArrowDownIcon className="mr-1 h-3 w-3" />
                -2.1%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Daily</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(thisMonthExpenses / new Date().getDate()).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on current month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <div className="h-4 w-4 rounded-full" 
                 style={{ backgroundColor: CATEGORIES.find(c => c.id === topCategory?.[0])?.color }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {CATEGORIES.find(c => c.id === topCategory?.[0])?.name || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              ${topCategory?.[1]?.toFixed(2) || '0.00'} spent
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentExpenses />
        </CardContent>
      </Card>
    </div>
  );
}