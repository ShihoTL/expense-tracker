'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useExpenseStore } from '@/stores/expense-store';
import { CATEGORIES } from '@/lib/constants';

export function CategoryChart() {
  const { expenses } = useExpenseStore();

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
      return (
        <div className="rounded-lg border bg-card p-2 shadow-md">
          <p className="text-sm font-medium">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

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