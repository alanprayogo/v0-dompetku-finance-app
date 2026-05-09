'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Wallet {
  id: string;
  name: string;
  type: 'savings' | 'checking' | 'credit';
  balance: number;
  currency: 'IDR' | 'USD';
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  category: string;
  description: string;
  date: Date;
  recipientWalletId?: string;
}

interface FinanceContextType {
  wallets: Wallet[];
  transactions: Transaction[];
  user: { name: string; email: string; avatar: string } | null;
  addWallet: (wallet: Wallet) => void;
  updateWallet: (id: string, updates: Partial<Wallet>) => void;
  deleteWallet: (id: string) => void;
  addTransaction: (transaction: Transaction) => void;
  getWalletBalance: (walletId: string) => number;
  getTransactionsByWallet: (walletId: string) => Transaction[];
  getTotalIncome: (walletId?: string) => number;
  getTotalExpense: (walletId?: string) => number;
  login: (user: { name: string; email: string; avatar: string }) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [wallets, setWallets] = useState<Wallet[]>([
    {
      id: '1',
      name: 'Savings Account',
      type: 'savings',
      balance: 5250000,
      currency: 'IDR',
      color: 'from-blue-500 to-blue-600',
      icon: 'PiggyBank',
    },
    {
      id: '2',
      name: 'Daily Spending',
      type: 'checking',
      balance: 1800000,
      currency: 'IDR',
      color: 'from-green-500 to-green-600',
      icon: 'Wallet',
    },
    {
      id: '3',
      name: 'Credit Card',
      type: 'credit',
      balance: 500000,
      currency: 'IDR',
      color: 'from-purple-500 to-purple-600',
      icon: 'CreditCard',
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      walletId: '2',
      type: 'expense',
      amount: 125000,
      category: 'Food & Drink',
      description: 'Lunch at cafe',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      walletId: '2',
      type: 'income',
      amount: 50000,
      category: 'Freelance',
      description: 'Project payment',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      walletId: '1',
      type: 'transfer',
      amount: 200000,
      category: 'Savings',
      description: 'Monthly savings',
      date: new Date(),
      recipientWalletId: '1',
    },
    {
      id: '4',
      walletId: '2',
      type: 'expense',
      amount: 89000,
      category: 'Transportation',
      description: 'Fuel',
      date: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
      id: '5',
      walletId: '2',
      type: 'expense',
      amount: 250000,
      category: 'Shopping',
      description: 'Groceries',
      date: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
  ]);

  const [user, setUser] = useState<{ name: string; email: string; avatar: string } | null>(null);

  const addWallet = useCallback((wallet: Wallet) => {
    setWallets((prev) => [...prev, wallet]);
  }, []);

  const updateWallet = useCallback((id: string, updates: Partial<Wallet>) => {
    setWallets((prev) =>
      prev.map((wallet) => (wallet.id === id ? { ...wallet, ...updates } : wallet))
    );
  }, []);

  const deleteWallet = useCallback((id: string) => {
    setWallets((prev) => prev.filter((wallet) => wallet.id !== id));
  }, []);

  const addTransaction = useCallback((transaction: Transaction) => {
    setTransactions((prev) => [...prev, transaction]);
    if (transaction.type === 'transfer' && transaction.recipientWalletId) {
      updateWallet(transaction.walletId, {
        balance: wallets.find((w) => w.id === transaction.walletId)?.balance! - transaction.amount,
      });
      updateWallet(transaction.recipientWalletId, {
        balance: wallets.find((w) => w.id === transaction.recipientWalletId)?.balance! + transaction.amount,
      });
    } else if (transaction.type === 'expense') {
      updateWallet(transaction.walletId, {
        balance: wallets.find((w) => w.id === transaction.walletId)?.balance! - transaction.amount,
      });
    } else if (transaction.type === 'income') {
      updateWallet(transaction.walletId, {
        balance: wallets.find((w) => w.id === transaction.walletId)?.balance! + transaction.amount,
      });
    }
  }, [wallets, updateWallet]);

  const getWalletBalance = useCallback((walletId: string): number => {
    return wallets.find((w) => w.id === walletId)?.balance || 0;
  }, [wallets]);

  const getTransactionsByWallet = useCallback((walletId: string): Transaction[] => {
    return transactions.filter((t) => t.walletId === walletId);
  }, [transactions]);

  const getTotalIncome = useCallback((walletId?: string): number => {
    const filtered = walletId
      ? transactions.filter((t) => t.walletId === walletId && t.type === 'income')
      : transactions.filter((t) => t.type === 'income');
    return filtered.reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const getTotalExpense = useCallback((walletId?: string): number => {
    const filtered = walletId
      ? transactions.filter((t) => t.walletId === walletId && t.type === 'expense')
      : transactions.filter((t) => t.type === 'expense');
    return filtered.reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const login = useCallback((userData: { name: string; email: string; avatar: string }) => {
    setUser(userData);
  }, []);

  return (
    <FinanceContext.Provider
      value={{
        wallets,
        transactions,
        user,
        addWallet,
        updateWallet,
        deleteWallet,
        addTransaction,
        getWalletBalance,
        getTransactionsByWallet,
        getTotalIncome,
        getTotalExpense,
        login,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
}
