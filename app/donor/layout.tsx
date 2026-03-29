'use client';

import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  LayoutDashboard,
  Calendar,
  User,
} from 'lucide-react';
import type { NavItem } from '@/lib/types';

const donorNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/donor', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Appointments', href: '/donor/appointments', icon: <Calendar className="w-5 h-5" /> },
  { label: 'Profile', href: '/donor/profile', icon: <User className="w-5 h-5" /> },
];

export default function DonorLayout({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!profile || profile.role !== 'donor')) {
      router.push('/login');
    }
  }, [profile, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center"><LoadingSpinner size="lg" /></div>
      </div>
    );
  }

  if (!profile || profile.role !== 'donor') return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar items={donorNavItems} title="Donor Portal" />
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
