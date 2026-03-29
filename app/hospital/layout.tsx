'use client';

import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  LayoutDashboard,
  FileText,
} from 'lucide-react';
import type { NavItem } from '@/lib/types';

const hospitalNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/hospital', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Blood Requests', href: '/hospital/requests', icon: <FileText className="w-5 h-5" /> },
];

export default function HospitalLayout({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!profile || profile.role !== 'hospital')) {
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

  if (!profile || profile.role !== 'hospital') return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar items={hospitalNavItems} title="Hospital Portal" />
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
