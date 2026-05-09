'use client';

import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { ArrowLeft, ArrowRightLeft, Check } from 'lucide-react';
import Link from 'next/link';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function TransferContent() {
  const { wallets, addTransaction } = useFinance();
  const [fromWalletId, setFromWalletId] = useState(wallets[0]?.id || '');
  const [toWalletId, setToWalletId] = useState(wallets[1]?.id || '');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fromWallet = wallets.find(w => w.id === fromWalletId);
  const toWallet = wallets.find(w => w.id === toWalletId);

  const canSubmit = fromWalletId && toWalletId && amount && fromWalletId !== toWalletId;
  const numAmount = parseFloat(amount) || 0;
  const hasEnoughBalance = fromWallet && numAmount <= fromWallet.balance;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !hasEnoughBalance) return;

    setIsSubmitting(true);
    setTimeout(() => {
      addTransaction({
        id: Date.now().toString(),
        walletId: fromWalletId,
        type: 'transfer',
        amount: numAmount,
        category: 'Transfer',
        description: description || `Transfer to ${toWallet?.name}`,
        date: new Date(),
        recipientWalletId: toWalletId,
      });
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setAmount('');
        setDescription('');
      }, 2000);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border backdrop-blur-md">
        <div className="flex items-center gap-4 px-4 py-4">
          <Link href="/" className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground">Transfer Money</h1>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mx-4 mt-4 p-4 bg-secondary/10 border border-secondary text-secondary rounded-xl flex items-center gap-3 animate-in">
          <Check size={24} />
          <div>
            <p className="font-medium">Transfer successful!</p>
            <p className="text-sm opacity-75">{formatCurrency(numAmount)} transferred</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="px-4 pt-6 space-y-6">
        {/* From Wallet Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground">From</label>
          <select
            value={fromWalletId}
            onChange={(e) => setFromWalletId(e.target.value)}
            className="w-full p-4 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          >
            {wallets.map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.name} • {formatCurrency(wallet.balance)}
              </option>
            ))}
          </select>
          {fromWallet && (
            <p className="text-xs text-muted-foreground">
              Available: {formatCurrency(fromWallet.balance)}
            </p>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => {
              const temp = fromWalletId;
              setFromWalletId(toWalletId);
              setToWalletId(temp);
            }}
            className="p-2 bg-muted hover:bg-muted/80 rounded-full transition-colors"
          >
            <ArrowRightLeft size={20} />
          </button>
        </div>

        {/* To Wallet Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground">To</label>
          <select
            value={toWalletId}
            onChange={(e) => setToWalletId(e.target.value)}
            className="w-full p-4 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          >
            {wallets.map((wallet) => (
              <option key={wallet.id} value={wallet.id} disabled={wallet.id === fromWalletId}>
                {wallet.name}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Input */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              Rp
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full pl-8 pr-4 py-4 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-lg font-semibold"
            />
          </div>
          {!hasEnoughBalance && amount && (
            <p className="text-xs text-destructive">Insufficient balance</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground">Description (Optional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., For rent, shared expense"
            className="w-full p-4 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          />
        </div>

        {/* Summary */}
        {fromWallet && toWallet && amount && (
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">From</span>
              <span className="font-medium text-foreground">{fromWallet.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">To</span>
              <span className="font-medium text-foreground">{toWallet.name}</span>
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Amount</span>
                <span className="text-lg font-bold text-destructive">-{formatCurrency(numAmount)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!canSubmit || !hasEnoughBalance || isSubmitting}
          className={`w-full py-4 rounded-lg font-semibold transition-all ${
            canSubmit && hasEnoughBalance
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95'
              : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
          }`}
        >
          {isSubmitting ? 'Processing...' : 'Confirm Transfer'}
        </button>
      </form>
    </div>
  );
}
