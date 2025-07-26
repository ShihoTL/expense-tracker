'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useExpenseStore } from '@/stores/expense-store';
import { useCategoryStore } from '@/stores/category-store';
import { CATEGORIES } from '@/lib/constants';
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2,
  MoreHorizontal,
  TrendingUp,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CategoryModal } from '@/components/categories/category-modal';

export default function CategoriesPage() {
  const { expenses } = useExpenseStore();
  const { categories, deleteCategory } = useCategoryStore();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate category usage statistics
  const categoryStats = categories.map(category => {
    const categoryExpenses = expenses.filter(expense => expense.category === category.id);
    const totalSpent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const transactionCount = categoryExpenses.length;
    const lastUsed = categoryExpenses.length > 0 
      ? Math.max(...categoryExpenses.map(e => e.date.getTime()))
      : null;

    return {
      ...category,
      totalSpent,
      transactionCount,
      lastUsed: lastUsed ? new Date(lastUsed) : null,
    };
  });

  const filteredCategories = categoryStats.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCategories = categories.length;
  const activeCategories = categoryStats.filter(cat => cat.transactionCount > 0).length;
  const totalSpent = categoryStats.reduce((sum, cat) => sum + cat.totalSpent, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage your expense categories and track usage
          </p>
        </div>
        <Button onClick={() => setShowCategoryModal(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Badge variant="secondary">{totalCategories}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
            <p className="text-xs text-muted-foreground">
              {activeCategories} active categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Used</CardTitle>
            <div 
              className="h-4 w-4 rounded-full"
              style={{ 
                backgroundColor: categoryStats
                  .sort((a, b) => b.transactionCount - a.transactionCount)[0]?.color 
              }}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categoryStats
                .sort((a, b) => b.transactionCount - a.transactionCount)[0]?.name || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {categoryStats
                .sort((a, b) => b.transactionCount - a.transactionCount)[0]?.transactionCount || 0} transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: category.color }}
                >
                  {category.name.charAt(0)}
                </div>
                <div>
                  <CardTitle className="text-base">{category.name}</CardTitle>
                  {category.isDefault && (
                    <Badge variant="outline" className="text-xs mt-1">
                      Default
                    </Badge>
                  )}
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setEditingCategory(category);
                      setShowCategoryModal(true);
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  {!category.isDefault && (
                    <DropdownMenuItem
                      onClick={() => deleteCategory(category.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Spent:</span>
                  <span className="font-medium">${category.totalSpent.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transactions:</span>
                  <span className="font-medium">{category.transactionCount}</span>
                </div>
                {category.lastUsed && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Used:</span>
                    <span className="font-medium">
                      {category.lastUsed.toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              {searchTerm ? 'No categories found matching your search' : 'No categories available'}
            </div>
            {!searchTerm && (
              <Button onClick={() => setShowCategoryModal(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create your first category
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <CategoryModal 
        open={showCategoryModal}
        onOpenChange={setShowCategoryModal}
        category={editingCategory}
        onClose={() => {
          setShowCategoryModal(false);
          setEditingCategory(null);
        }}
      />
    </div>
  );
}