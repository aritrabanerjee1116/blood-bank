'use client';

import { useAuth } from '@/context/AuthProvider';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import StatsCard from '@/components/StatsCard';
import {
  Heart,
  Calendar,
  Clock,
  Droplets,
  Award,
  Activity,
} from 'lucide-react';
import type { Appointment } from '@/lib/types';

const demoAppointments: Partial<Appointment>[] = [
  { id: '1', scheduled_date: '2026-04-15', scheduled_time: '10:00 AM', location: 'Central Blood Bank, Mumbai', status: 'scheduled' },
  { id: '2', scheduled_date: '2026-01-10', scheduled_time: '09:30 AM', location: 'City Blood Bank, Mumbai', status: 'completed' },
  { id: '3', scheduled_date: '2025-10-05', scheduled_time: '11:00 AM', location: 'Red Cross Center, Pune', status: 'completed' },
];

export default function DonorDashboard() {
  const { profile } = useAuth();
  const [appointments, setAppointments] = useState<Partial<Appointment>[]>(demoAppointments);
  const [totalDonations, setTotalDonations] = useState(8);

  useEffect(() => {
    fetchDonorData();
  }, []);

  const fetchDonorData = async () => {
    try {
      if (!profile) return;
      const { data } = await supabase
        .from('appointments')
        .select('*')
        .eq('donor_id', profile.id)
        .order('scheduled_date', { ascending: false })
        .limit(5);
      if (data && data.length > 0) {
        setAppointments(data);
        setTotalDonations(data.filter((a) => a.status === 'completed').length);
      }
    } catch {
      console.log('Using demo donor data');
    }
  };

  const nextEligible = '2026-04-10';
  const daysUntilEligible = Math.max(0, Math.ceil((new Date(nextEligible).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold mb-1">
          Welcome back, <span className="gradient-text">{profile?.full_name || 'Donor'}</span>
        </h1>
        <p className="text-sm text-[var(--color-muted)]">
          Thank you for being a lifesaver. Here&apos;s your donation overview.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatsCard
          label="Total Donations"
          value={totalDonations}
          icon={<Heart className="w-6 h-6" />}
          color="#DC2626"
        />
        <StatsCard
          label="Blood Group"
          value={profile?.blood_group || 'N/A'}
          icon={<Droplets className="w-6 h-6" />}
          color="#3B82F6"
        />
        <StatsCard
          label="Days Until Eligible"
          value={daysUntilEligible}
          icon={<Clock className="w-6 h-6" />}
          color="#F59E0B"
        />
        <StatsCard
          label="Lives Impacted"
          value={totalDonations * 3}
          icon={<Award className="w-6 h-6" />}
          color="#22C55E"
        />
      </div>

      {/* Eligibility Card */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-3">
          <Activity className="w-5 h-5 text-[var(--color-primary)]" />
          <h2 className="text-lg font-semibold">Eligibility Status</h2>
        </div>
        {daysUntilEligible > 0 ? (
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-2 rounded-full bg-[var(--color-surface-lighter)] overflow-hidden">
                <div className="h-full rounded-full bg-[var(--gradient-primary)]" style={{ width: `${Math.max(5, 100 - (daysUntilEligible / 90) * 100)}%` }} />
              </div>
            </div>
            <span className="text-sm text-[var(--color-warning)] font-medium">
              Eligible on {nextEligible}
            </span>
          </div>
        ) : (
          <p className="text-[var(--color-success)] font-medium">
            ✓ You are eligible to donate! Schedule an appointment below.
          </p>
        )}
      </div>

      {/* Recent Appointments */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
          Appointments
        </h2>
        <div className="space-y-3 stagger-children">
          {appointments.map((apt) => (
            <div key={apt.id} className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="font-medium">{apt.location}</p>
                <p className="text-sm text-[var(--color-muted)]">
                  {apt.scheduled_date} at {apt.scheduled_time}
                </p>
              </div>
              <span className={`badge ${apt.status === 'completed' ? 'badge-success' : apt.status === 'scheduled' ? 'badge-info' : 'badge-danger'}`}>
                {apt.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
