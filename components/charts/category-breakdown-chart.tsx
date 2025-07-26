'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Expense } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';

interface CategoryBreakdownChartProps {
  expenses: Expense[];
}

export function CategoryBreakdownChart({ expenses }: CategoryBreakdownChartProps) {
  const categoryData = expenses.reduce((acc, expense) => {
    const category = CATEGORIES.find(c => c.id === expense.category);
    const existingCategory = acc.find(item => item.name === category?.name);
    
    if (existingCategory) {
      existingCategory.value += expense.amount;
    } else if (category) {
      acc.push({
        name: category.name,
        value: expense.amount,
        color: category.color,
      });
    }
    
    return acc;
  }, [] as { name: string; value: number; color: string }[]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / expenses.reduce((sum, e) => sum + e.amount, 0)) * 100).toFixed(1);
      return (
        <div className="rounded-lg border bg-card p-3 shadow-md">
          <p className="text-sm font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            ${data.value.toFixed(2)} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  if (categoryData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={categoryData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          dataKey="value"
        >
          {categoryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          formatter={(value) => value}
          wrapperStyle={{ fontSize: '12px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}