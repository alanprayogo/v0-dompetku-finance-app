'use client';

import { FinanceProvider } from '../context/FinanceContext';
import ProfileContent from '../components/ProfileContent';
import BottomNav from '../components/BottomNav';

export default function ProfilePage() {
  return (
    <FinanceProvider>
      <ProfileContent />
      <BottomNav />
    </FinanceProvider>
  );
}
