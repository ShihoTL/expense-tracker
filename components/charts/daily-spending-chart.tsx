'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Expense } from '@/lib/types';
import { format, eachDayOfInterval, subDays } from 'date-fns';

interface DailySpendingChartProps {
  expenses: Expense[];
}

export function DailySpendingChart({ expenses }: DailySpendingChartProps) {
  // Get last 30 days
  const now = new Date();
  const thirtyDaysAgo = subDays(now, 29);
  const days = eachDayOfInterval({ start: thirtyDaysAgo, end: now });

  const dailyData = days.map(day => {
    const dayExpenses = expenses.filter(expense => 
      format(expense.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
    
    const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      date: format(day, 'MMM dd'),
      amount: total,
      fullDate: format(day, 'MMMM dd, yyyy'),
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={dailyData}>
        <defs>
          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="date" 
          className="text-xs fill-muted-foreground"
          interval="preserveStartEnd"
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
          labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate || label}
        />
        <Area 
          type="monotone" 
          dataKey="amount" 
          stroke="hsl(var(--primary))" 
          fillOpacity={1} 
          fill="url(#colorAmount)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}