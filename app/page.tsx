'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, login } = useAuthStore();

  useEffect(() => {
    // Auto-login for demo purposes
    if (!isAuthenticated) {
      login({
        id: 'user1',
        email: 'demo@example.com',
        displayName: 'Demo User',
        createdAt: new Date(),
        preferences: {
          theme: 'dark',
          currency: 'USD',
          notifications: true,
        },
      });
    }
    
    router.push('/dashboard');
  }, [isAuthenticated, login, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">ExpenseTracker</h1>
        <p className="text-muted-foreground">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}