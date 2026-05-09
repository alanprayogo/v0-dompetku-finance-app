'use client';

import { useFinance } from '../context/FinanceContext';
import Header from './Header';
import WalletCarousel from './WalletCarousel';
import QuickActions from './QuickActions';
import RecentTransactions from './RecentTransactions';

export default function DashboardContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      <main className="pb-24">
        <div className="px-4 pt-4">
          <WalletCarousel />
          <QuickActions />
          <RecentTransactions />
        </div>
      </main>
    </div>
  );
}
