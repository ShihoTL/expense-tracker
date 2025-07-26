"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Expense } from "@/lib/types";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  subMonths,
} from "date-fns";

interface MonthlyTrendChartProps {
  expenses: Expense[];
}

export function MonthlyTrendChart({ expenses }: MonthlyTrendChartProps) {
  // Get last 6 months
  const now = new Date();
  const sixMonthsAgo = subMonths(now, 5);
  const months = eachMonthOfInterval({ start: sixMonthsAgo, end: now });

  const monthlyData = months.map((month) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    const monthExpenses = expenses.filter(
      (expense) => expense.date >= monthStart && expense.date <= monthEnd
    );

    const total = monthExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    return {
      month: format(month, "MMM"),
      amount: total,
      fullDate: format(month, "MMMM yyyy"),
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={monthlyData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
        <YAxis
          className="text-xs fill-muted-foreground"
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
          formatter={(value, name, props) => [`$${value}`, "Amount"]}
          labelFormatter={(label, payload) =>
            payload?.[0]?.payload?.fullDate || label
          }
        />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
