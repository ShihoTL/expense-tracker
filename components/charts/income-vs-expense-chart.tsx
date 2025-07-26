'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Expense } from '@/lib/types';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

interface IncomeVsExpenseChartProps {
  expenses: Expense[];
}

export function IncomeVsExpenseChart({ expenses }: IncomeVsExpenseChartProps) {
  // Get last 6 months
  const now = new Date();
  const sixMonthsAgo = subMonths(now, 5);
  const months = eachMonthOfInterval({ start: sixMonthsAgo, end: now });

  const monthlyData = months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    const monthExpenses = expenses.filter(expense => 
      expense.date >= monthStart && expense.date <= monthEnd
    );
    
    const totalExpenses = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    // Mock income data - in a real app this would come from income tracking
    const mockIncome = totalExpenses * (1.2 + Math.random() * 0.3); // 120-150% of expenses
    
    return {
      month: format(month, 'MMM'),
      expenses: totalExpenses,
      income: mockIncome,
      net: mockIncome - totalExpenses,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={monthlyData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="month" 
          className="text-xs fill-muted-foreground"
        />
        <YAxis 
          className="text-xs fill-muted-foreground"
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
          formatter={([value, name]) => [`$${value.toFixed(2)}`, name === 'income' ? 'Income' : name === 'expenses' ? 'Expenses' : 'Net']}
        />
        <Legend />
        <Bar dataKey="income" fill="hsl(var(--success))" name="Income" radius={[2, 2, 0, 0]} />
        <Bar dataKey="expenses" fill="hsl(var(--destructive))" name="Expenses" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}