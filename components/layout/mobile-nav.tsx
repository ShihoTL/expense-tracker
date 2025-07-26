'use client';

import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  CreditCard, 
  LayoutDashboard, 
  PieChart, 
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Expenses', href: '/expenses', icon: CreditCard },
  { name: 'Budget', href: '/budget', icon: PieChart },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 text-xs',
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              )}>
                <Icon className="h-5 w-5" />
                <span className="truncate">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}