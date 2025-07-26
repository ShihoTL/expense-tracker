import { z } from 'zod';

export const expenseSchema = z.object({
  amount: z.string().min(1, 'Amount is required').refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    'Amount must be a positive number'
  ),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  description: z.string().min(1, 'Description is required').max(200, 'Description is too long'),
  date: z.date(),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  tags: z.array(z.string()).default([]),
});

export const budgetSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  amount: z.string().min(1, 'Amount is required').refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    'Amount must be a positive number'
  ),
  period: z.enum(['monthly', 'weekly', 'yearly']),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Name is too long'),
  icon: z.string().min(1, 'Icon is required'),
  color: z.string().min(1, 'Color is required'),
});