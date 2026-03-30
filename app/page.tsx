'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BloodStockCard from '@/components/BloodStockCard';
import { supabase } from '@/lib/supabase';
import {
  Droplets,
  Heart,
  Building2,
  Clock,
  Shield,
  Users,
  ArrowRight,
  Phone,
  AlertTriangle,
  Activity,
  Zap,
} from 'lucide-react';
import type { BloodGroup } from '@/lib/types';

const allBloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const demoBloodGroups: { group: BloodGroup; units: number }[] = [
  { group: 'A+', units: 42 },
  { group: 'A-', units: 12 },
  { group: 'B+', units: 35 },
  { group: 'B-', units: 8 },
  { group: 'AB+', units: 18 },
  { group: 'AB-', units: 5 },
  { group: 'O+', units: 50 },
  { group: 'O-', units: 15 },
];

const steps = [
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Register',
    desc: 'Create your account as a Donor or Hospital representative.',
  },
  {
    icon: <Droplets className="w-6 h-6" />,
    title: 'Donate or Request',
    desc: 'Schedule a donation appointment or submit a blood request.',
  },
  {
    icon: <Activity className="w-6 h-6" />,
    title: 'Track in Real-time',
    desc: 'Monitor stock levels, request status, and delivery tracking.',
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Save Lives',
    desc: 'Every donation counts. Help ensure blood reaches those in need.',
  },
];

export default function HomePage() {
  const [bloodGroups, setBloodGroups] = useState(demoBloodGroups);

  useEffect(() => {
    async function fetchStock() {
      try {
        const { data, error } = await supabase
          .from('blood_stock')
          .select('blood_group, units_available')
          .eq('status', 'available');

        if (error) throw error;

        if (data && data.length > 0) {
          const aggregated: Record<string, number> = {};
          data.forEach((item) => {
            const bg = item.blood_group as BloodGroup;
            aggregated[bg] = (aggregated[bg] || 0) + item.units_available;
          });

          const liveStock = allBloodGroups.map((bg) => ({
            group: bg,
            units: aggregated[bg] || 0,
          }));

          setBloodGroups(liveStock);
        }
      } catch {
        console.log('Using demo blood stock data on home page');
      }
    }
    fetchStock();
  }, []);

  const totalUnits = bloodGroups.reduce((sum, bg) => sum + bg.units, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* ═══ Hero Section ═══ */}
      <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(220,38,38,0.08)_0%,transparent_70%)] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(249,115,22,0.06)_0%,transparent_70%)] rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(220,38,38,0.3)] bg-[rgba(220,38,38,0.08)] mb-6">
              <Zap className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="text-sm font-medium text-[var(--color-primary)]">
                Real-time Blood Bank Management
              </span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up">
            Every Drop{' '}
            <span className="gradient-text">Saves a Life</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-[var(--color-muted)] mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            A comprehensive platform connecting donors, hospitals, and blood banks.
            Manage inventory, track requests, and respond to emergencies — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/register/donor" className="btn btn-primary btn-lg">
              <Heart className="w-5 h-5" />
              Become a Donor
            </Link>
            <Link href="/register/hospital" className="btn btn-secondary btn-lg">
              <Building2 className="w-5 h-5" />
              Register Hospital
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {[
              { label: 'Active Donors', value: '2,500+', icon: <Users className="w-5 h-5" /> },
              { label: 'Units Available', value: totalUnits, icon: <Droplets className="w-5 h-5" /> },
              { label: 'Hospitals', value: '48', icon: <Building2 className="w-5 h-5" /> },
              { label: 'Lives Saved', value: '12,000+', icon: <Heart className="w-5 h-5" /> },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-4">
                <div className="text-[var(--color-primary)] mb-2">{stat.icon}</div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-[var(--color-muted)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Blood Stock Preview ═══ */}
      <section className="py-16 sm:py-20 blood-drop-bg">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              Live <span className="gradient-text">Blood Stock</span>
            </h2>
            <p className="text-[var(--color-muted)] max-w-lg mx-auto">
              Real-time availability of blood groups across our network.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 stagger-children">
            {bloodGroups.map((bg) => (
              <BloodStockCard
                key={bg.group}
                bloodGroup={bg.group}
                units={bg.units}
              />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/blood-availability"
              className="btn btn-secondary inline-flex items-center gap-2"
            >
              View Full Inventory
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ How It Works ═══ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              How <span className="gradient-text">It Works</span>
            </h2>
            <p className="text-[var(--color-muted)] max-w-lg mx-auto">
              Simple steps to get started with BloodLink.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
            {steps.map((step, i) => (
              <div key={step.title} className="glass-card p-6 relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[var(--gradient-primary)] flex items-center justify-center text-white text-sm font-bold">
                  {i + 1}
                </div>
                <div className="w-12 h-12 rounded-xl bg-[rgba(220,38,38,0.1)] flex items-center justify-center text-[var(--color-primary)] mb-4">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Emergency Banner ═══ */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl p-8 sm:p-12" style={{ background: 'linear-gradient(135deg, rgba(220,38,38,0.15) 0%, rgba(249,115,22,0.1) 100%)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(220,38,38,0.15)_0%,transparent_70%)] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative flex flex-col sm:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-2xl font-bold mb-2">Emergency Blood Needed?</h3>
                <p className="text-[var(--color-muted)]">
                  Call our 24/7 emergency hotline or submit an urgent request through the platform.
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <a href="tel:+911234567890" className="btn btn-primary btn-lg">
                  <Phone className="w-5 h-5" />
                  Emergency Line
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Features ═══ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              Why <span className="gradient-text">BloodLink?</span>
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
            {[
              {
                icon: <Clock className="w-6 h-6" />,
                title: '24/7 Availability',
                desc: 'Access the platform anytime, anywhere. Real-time updates on blood availability.',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Secure & Encrypted',
                desc: 'Enterprise-grade security with encrypted data storage and secure authentication.',
              },
              {
                icon: <Activity className="w-6 h-6" />,
                title: 'Real-time Tracking',
                desc: 'Track blood requests from submission to delivery with live status updates.',
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: 'Donor Network',
                desc: 'Connect with a large network of verified donors across multiple locations.',
              },
              {
                icon: <Building2 className="w-6 h-6" />,
                title: 'Hospital Integration',
                desc: 'Seamless integration for hospitals to manage requests and track deliveries.',
              },
              {
                icon: <Heart className="w-6 h-6" />,
                title: 'Smart Matching',
                desc: 'Intelligent matching of blood requests with available donors and stock.',
              },
            ].map((feature) => (
              <div key={feature.title} className="glass-card p-6">
                <div className="w-12 h-12 rounded-xl bg-[rgba(220,38,38,0.1)] flex items-center justify-center text-[var(--color-primary)] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <Footer />
    </div>
  );
}
