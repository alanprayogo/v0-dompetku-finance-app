'use client';

import { Wallet, useFinance } from '../context/FinanceContext';
import { ArrowLeft, Plus, Send, MoreVertical, PiggyBank, Wallet as WalletIcon, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const iconMap = {
  PiggyBank: PiggyBank,
  Wallet: WalletIcon,
  CreditCard: CreditCard,
};

function formatCurrency(amount: number, currency: string): string {
  if (currency === 'IDR') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
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

interface WalletDetailViewProps {
  wallet: Wallet;
}

export default function WalletDetailView({ wallet }: WalletDetailViewProps) {
  const { getTransactionsByWallet, getTotalIncome, getTotalExpense } = useFinance();
  const transactions = getTransactionsByWallet(wallet.id);
  const totalIncome = getTotalIncome(wallet.id);
  const totalExpense = getTotalExpense(wallet.id);
  const Icon = iconMap[wallet.icon as keyof typeof iconMap] || WalletIcon;
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-24">
      {/* Header */}
      <div className={`h-48 bg-gradient-to-br ${wallet.color} text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>

        <div className="relative z-10 px-4 pt-6 pb-8 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </Link>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors relative"
            >
              <MoreVertical size={24} />
              {showMenu && (
                <div className="absolute right-0 top-12 bg-card text-foreground rounded-lg shadow-lg overflow-hidden z-50">
                  <button className="w-full px-4 py-2 text-left hover:bg-muted transition-colors">
                    Edit Wallet
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-muted transition-colors">
                    Delete Wallet
                  </button>
                </div>
              )}
            </button>
          </div>

          <div>
            <p className="text-sm font-medium opacity-90 mb-2">{wallet.name}</p>
            <p className="text-4xl font-bold mb-2">
              {formatCurrency(wallet.balance, wallet.currency)}
            </p>
            <p className="text-xs opacity-75">{wallet.type.toUpperCase()} • {wallet.currency}</p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6 relative z-20 mb-6">
        {/* Quick Actions */}
        <div className="flex gap-3 bg-card rounded-2xl p-4 border border-border shadow-md">
          <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
            <Send size={18} />
            Send
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-medium">
            <Plus size={18} />
            Add
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 grid grid-cols-3 gap-3 mb-8">
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground mb-2">Income</p>
          <p className="text-lg font-semibold text-secondary">
            {formatCurrency(totalIncome, wallet.currency)}
          </p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground mb-2">Expense</p>
          <p className="text-lg font-semibold text-destructive">
            {formatCurrency(totalExpense, wallet.currency)}
          </p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground mb-2">Net</p>
          <p className={`text-lg font-semibold ${totalIncome - totalExpense >= 0 ? 'text-secondary' : 'text-destructive'}`}>
            {formatCurrency(totalIncome - totalExpense, wallet.currency)}
          </p>
        </div>
      </div>

      {/* Transactions */}
      <div className="px-4 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Transactions</h2>
        
        {transactions.length === 0 ? (
          <div className="bg-card rounded-xl p-8 text-center border border-border">
            <p className="text-muted-foreground">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-xl bg-card hover:bg-muted transition-colors border border-border"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">{transaction.category}</p>
                  <p className="text-sm text-muted-foreground">{transaction.description}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      transaction.type === 'income' ? 'text-secondary' :
                      transaction.type === 'expense' ? 'text-destructive' :
                      'text-primary'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}{formatCurrency(transaction.amount, wallet.currency)}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
