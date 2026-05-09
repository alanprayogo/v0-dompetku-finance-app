'use client';

import { useFinance } from '../context/FinanceContext';
import { ArrowLeft, Edit2, LogOut, Bell, Lock, HelpCircle, FileText, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onClick?: () => void;
}

function MenuItem({ icon, label, description, onClick }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 rounded-xl bg-card hover:bg-muted transition-colors border border-border"
    >
      <div className="flex items-center gap-3">
        <div className="text-primary">{icon}</div>
        <div className="text-left">
          <p className="font-medium text-foreground">{label}</p>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
    </button>
  );
}

export default function ProfileContent() {
  const { user, login } = useFinance();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSaveProfile = () => {
    if (name && email) {
      login({ name, email, avatar: user?.avatar || '' });
      setIsEditing(false);
    }
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
            <h1 className="text-xl font-semibold text-foreground">Profile & Settings</h1>
          </div>
        </div>
      </div>

      <div className="px-4 pt-6 space-y-6">
        {/* Profile Section */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 bg-muted text-foreground rounded-lg font-semibold hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name?.charAt(0) || 'D'}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground">{user?.name || 'Guest User'}</h2>
                  <p className="text-sm text-muted-foreground">{user?.email || 'Not set'}</p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-3 hover:bg-muted rounded-lg transition-colors"
                >
                  <Edit2 size={20} className="text-primary" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Account Settings */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground px-1">Account</h3>
          <MenuItem
            icon={<Bell size={20} />}
            label="Notifications"
            description="Manage your notifications"
          />
          <MenuItem
            icon={<Lock size={20} />}
            label="Security"
            description="Change password & 2FA"
          />
        </div>

        {/* App Settings */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground px-1">Preferences</h3>
          <MenuItem
            icon={<Zap size={20} />}
            label="Currency & Language"
            description="IDR • English"
          />
        </div>

        {/* Help & Support */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground px-1">Help & Support</h3>
          <MenuItem
            icon={<HelpCircle size={20} />}
            label="FAQs"
            description="Common questions answered"
          />
          <MenuItem
            icon={<FileText size={20} />}
            label="Terms & Privacy"
            description="Read our policies"
          />
        </div>

        {/* Logout */}
        <button className="w-full p-4 rounded-xl bg-destructive/10 hover:bg-destructive/20 transition-colors border border-destructive text-destructive font-semibold flex items-center justify-center gap-2">
          <LogOut size={20} />
          Logout
        </button>

        {/* Version Info */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">DompetKu v1.0.0</p>
          <p className="text-xs text-muted-foreground">© 2024 DompetKu. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
