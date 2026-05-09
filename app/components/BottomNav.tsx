'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Send, BarChart3, User } from 'lucide-react';

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { href: '/', icon: <Home size={24} />, label: 'Home' },
  { href: '/transfer', icon: <Send size={24} />, label: 'Transfer' },
  { href: '/analytics', icon: <BarChart3 size={24} />, label: 'Analytics' },
  { href: '/profile', icon: <User size={24} />, label: 'Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border backdrop-blur-md">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-4 px-4 transition-all duration-200 ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 bg-primary rounded-full mt-1"></div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
