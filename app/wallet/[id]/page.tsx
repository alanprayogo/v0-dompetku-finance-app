'use client';

import { useFinance } from '../../context/FinanceContext';
import { useParams } from 'next/navigation';
import WalletDetailView from '../../components/WalletDetailView';

export default function WalletDetailPage() {
  const params = useParams();
  const walletId = params.id as string;
  const { wallets } = useFinance();
  const wallet = wallets.find(w => w.id === walletId);

  if (!wallet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Wallet not found</p>
      </div>
    );
  }

  return <WalletDetailView wallet={wallet} />;
}
