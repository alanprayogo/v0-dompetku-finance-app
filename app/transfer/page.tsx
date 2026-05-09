'use client';

import { FinanceProvider } from '../context/FinanceContext';
import TransferContent from '../components/TransferContent';
import BottomNav from '../components/BottomNav';

export default function TransferPage() {
  return (
    <FinanceProvider>
      <TransferContent />
      <BottomNav />
    </FinanceProvider>
  );
}
