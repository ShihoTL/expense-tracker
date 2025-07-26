'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useExpenseStore } from '@/stores/expense-store';

export function ExpenseChart() {
  const { expenses = [] } = useExpenseStore();

  const monthlyData = expenses.reduce((acc, expense) => {
    const rawDate = new Date(expense.date); // Ensure valid Date
    const month = rawDate.toLocaleDateString('en-US', { month: 'short' });
    const existingMonth = acc.find(item => item.month === month);

    if (existingMonth) {
      existingMonth.amount += expense.amount;
    } else {
      acc.push({ month, amount: expense.amount });
    }

    return acc;
  }, [] as { month: string; amount: number }[]);

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
          formatter={([value]) => [`$${value}`, 'Amount']}
          formatter={(value) => [`$${value}`, 'Amount']}
        />
        <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
