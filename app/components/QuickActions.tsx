'use client';

import { Send, Plus, BarChart3, Eye } from 'lucide-react';

const actions = [
  {
    id: 'send',
    icon: Send,
    label: 'Send Money',
    color: 'bg-blue-100 dark:bg-blue-900/40 text-primary',
  },
  {
    id: 'add',
    icon: Plus,
    label: 'Add Money',
    color: 'bg-green-100 dark:bg-green-900/40 text-secondary',
  },
  {
    id: 'analytics',
    icon: BarChart3,
    label: 'Analytics',
    color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
  },
  {
    id: 'visibility',
    icon: Eye,
    label: 'Visibility',
    color: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400',
  },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-4 gap-3 mb-8">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            className="flex flex-col items-center gap-2 p-4 rounded-xl hover:scale-105 transition-transform"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${action.color}`}>
              <Icon size={24} />
            </div>
            <p className="text-xs font-medium text-center text-foreground">{action.label}</p>
          </button>
        );
      })}
    </div>
  );
}
