'use client';

import { useFinance, Wallet } from '../context/FinanceContext';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, PiggyBank, Wallet as WalletIcon, CreditCard } from 'lucide-react';

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

function WalletCard({ wallet }: { wallet: Wallet }) {
  const Icon = iconMap[wallet.icon as keyof typeof iconMap] || WalletIcon;

  return (
    <div className="flex-shrink-0 w-80">
      <div
        className={`h-48 rounded-2xl p-6 text-white shadow-lg bg-gradient-to-br ${wallet.color} relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium opacity-90">{wallet.name}</p>
              <p className="text-xs opacity-75 mt-1">{wallet.type.toUpperCase()}</p>
            </div>
            <Icon size={32} />
          </div>

          <div>
            <p className="text-xs opacity-75 mb-1">Total Balance</p>
            <p className="text-2xl font-bold">{formatCurrency(wallet.balance, wallet.currency)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WalletCarousel() {
  const { wallets } = useFinance();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 320;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between px-0">
        <h2 className="text-lg font-semibold text-foreground">My Wallets</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide"
      >
        {wallets.map((wallet) => (
          <WalletCard key={wallet.id} wallet={wallet} />
        ))}
      </div>
    </div>
  );
}
