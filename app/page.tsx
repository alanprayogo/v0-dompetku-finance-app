'use client';

import { FinanceProvider } from './context/FinanceContext';
import DashboardContent from './components/DashboardContent';
import BottomNav from './components/BottomNav';

export default function Home() {
  return (
    <FinanceProvider>
      <DashboardContent />
      <BottomNav />
    </FinanceProvider>
  );
}
