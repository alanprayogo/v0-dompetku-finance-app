'use client';

import { FinanceProvider } from '../context/FinanceContext';
import AnalyticsContent from '../components/AnalyticsContent';
import BottomNav from '../components/BottomNav';

export default function AnalyticsPage() {
  return (
    <FinanceProvider>
      <AnalyticsContent />
      <BottomNav />
    </FinanceProvider>
  );
}
