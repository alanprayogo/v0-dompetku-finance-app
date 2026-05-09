'use client';

import { Bell, Settings, Moon, Sun } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { useEffect, useState } from 'react';

export default function Header() {
  const { user } = useFinance();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-card border-b border-border backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0) || 'D'}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Welcome back!</p>
            <p className="text-xs text-muted-foreground">{user?.name || 'Guest'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            aria-label="Toggle theme"
          >
            {mounted && (isDark ? <Sun size={20} /> : <Moon size={20} />)}
          </button>
          <button className="p-2 hover:bg-muted rounded-full transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </button>
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
