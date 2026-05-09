'use client';

import { useFinance } from '../context/FinanceContext';
import { ChevronRight, TrendingDown, TrendingUp, ArrowRightLeft } from 'lucide-react';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
  }
}

export default function RecentTransactions() {
  const { transactions } = useFinance();
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
        <button className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
          View All <ChevronRight size={16} />
        </button>
      </div>

      <div className="space-y-2">
        {recentTransactions.map((transaction) => {
          const isIncome = transaction.type === 'income';
          const isExpense = transaction.type === 'expense';
          const isTransfer = transaction.type === 'transfer';

          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-xl bg-card hover:bg-muted transition-colors border border-border"
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isIncome ? 'bg-green-100 dark:bg-green-900/40' : 
                    isExpense ? 'bg-red-100 dark:bg-red-900/40' : 
                    'bg-blue-100 dark:bg-blue-900/40'
                  }`}
                >
                  {isIncome ? (
                    <TrendingUp size={24} className="text-secondary" />
                  ) : isExpense ? (
                    <TrendingDown size={24} className="text-destructive" />
                  ) : (
                    <ArrowRightLeft size={24} className="text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{transaction.category}</p>
                  <p className="text-sm text-muted-foreground">{transaction.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-semibold ${
                    isIncome ? 'text-secondary' :
                    isExpense ? 'text-destructive' :
                    'text-primary'
                  }`}
                >
                  {isIncome ? '+' : isExpense ? '-' : ''}{formatCurrency(transaction.amount)}
                </p>
                <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
