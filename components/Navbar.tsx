'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthProvider';
import {
  Droplets,
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
} from 'lucide-react';

export default function Navbar() {
  const { user, profile, signOut, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getDashboardPath = () => {
    if (!profile) return '/login';
    switch (profile.role) {
      case 'admin':
        return '/admin';
      case 'donor':
        return '/donor';
      case 'hospital':
        return '/hospital';
      default:
        return '/login';
    }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-custom border-b border-[var(--color-border)] bg-[rgba(11,10,26,0.85)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-[var(--gradient-primary)] flex items-center justify-center group-hover:shadow-[var(--shadow-glow)] transition-shadow">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">BloodLink</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 text-sm text-[var(--color-muted)] hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 text-sm text-[var(--color-muted)] hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              About Us
            </Link>
            <Link
              href="/blood-availability"
              className="px-4 py-2 text-sm text-[var(--color-muted)] hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              Blood Availability
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 text-sm text-[var(--color-muted)] hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              Contact
            </Link>
            {!loading && user ? (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  href={getDashboardPath()}
                  className="btn btn-secondary btn-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                  <User className="w-4 h-4 text-[var(--color-primary)]" />
                  <span className="text-sm text-[var(--color-muted)]">
                    {profile?.full_name || profile?.email || 'User'}
                  </span>
                </div>
                <button
                  onClick={signOut}
                  className="btn btn-ghost btn-sm text-[var(--color-danger)]"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link href="/login" className="btn btn-secondary btn-sm">
                  Sign In
                </Link>
                <Link href="/register/donor" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 text-[var(--color-muted)] hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] animate-slide-down">
          <div className="px-4 py-4 space-y-2">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-sm text-[var(--color-muted)] hover:text-white hover:bg-white/5"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-sm text-[var(--color-muted)] hover:text-white hover:bg-white/5"
            >
              About Us
            </Link>
            <Link
              href="/blood-availability"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-sm text-[var(--color-muted)] hover:text-white hover:bg-white/5"
            >
              Blood Availability
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-sm text-[var(--color-muted)] hover:text-white hover:bg-white/5"
            >
              Contact
            </Link>
            {!loading && user ? (
              <>
                <Link
                  href={getDashboardPath()}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-sm text-[var(--color-muted)] hover:text-white hover:bg-white/5"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-[var(--color-danger)] hover:bg-white/5"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-sm text-[var(--color-muted)] hover:text-white hover:bg-white/5"
                >
                  Sign In
                </Link>
                <Link
                  href="/register/donor"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center btn btn-primary btn-sm"
                >
                  Register as Donor
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
