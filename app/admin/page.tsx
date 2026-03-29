'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import StatsCard from '@/components/StatsCard';
import BloodStockCard from '@/components/BloodStockCard';
import {
  Users,
  Building2,
  Droplets,
  FileText,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import type { BloodGroup, BloodRequest } from '@/lib/types';

interface DashboardStats {
  totalDonors: number;
  totalHospitals: number;
  totalStock: number;
  pendingRequests: number;
}

const defaultStats: DashboardStats = {
  totalDonors: 2500,
  totalHospitals: 48,
  totalStock: 185,
  pendingRequests: 12,
};

const demoStock: { blood_group: BloodGroup; units: number }[] = [
  { blood_group: 'A+', units: 42 },
  { blood_group: 'A-', units: 12 },
  { blood_group: 'B+', units: 35 },
  { blood_group: 'B-', units: 8 },
  { blood_group: 'AB+', units: 18 },
  { blood_group: 'AB-', units: 5 },
  { blood_group: 'O+', units: 50 },
  { blood_group: 'O-', units: 15 },
];

const demoRequests: Partial<BloodRequest>[] = [
  { id: '1', hospital_name: 'City General Hospital', blood_group: 'O+', units_requested: 5, urgency: 'emergency', status: 'pending', created_at: '2026-03-27' },
  { id: '2', hospital_name: 'St. Mary Medical Center', blood_group: 'A-', units_requested: 3, urgency: 'urgent', status: 'pending', created_at: '2026-03-26' },
  { id: '3', hospital_name: 'Metro Health Clinic', blood_group: 'B+', units_requested: 2, urgency: 'normal', status: 'approved', created_at: '2026-03-26' },
  { id: '4', hospital_name: 'National Hospital', blood_group: 'AB+', units_requested: 4, urgency: 'urgent', status: 'pending', created_at: '2026-03-25' },
];

const urgencyBadge = {
  normal: 'badge-info',
  urgent: 'badge-warning',
  emergency: 'badge-danger',
};
const statusBadge = {
  pending: 'badge-warning',
  approved: 'badge-success',
  rejected: 'badge-danger',
  fulfilled: 'badge-info',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [recentRequests, setRecentRequests] = useState<Partial<BloodRequest>[]>(demoRequests);
  const [stock, setStock] = useState(demoStock);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [donorsRes, hospitalsRes, stockRes, requestsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'donor'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'hospital'),
        supabase.from('blood_stock').select('blood_group, units_available').eq('status', 'available'),
        supabase.from('blood_requests').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      if (stockRes.data && stockRes.data.length > 0) {
        const aggregated: Record<string, number> = {};
        let total = 0;
        stockRes.data.forEach((item) => {
          aggregated[item.blood_group] = (aggregated[item.blood_group] || 0) + item.units_available;
          total += item.units_available;
        });

        const allGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        setStock(allGroups.map((bg) => ({ blood_group: bg, units: aggregated[bg] || 0 })));

        setStats((prev) => ({
          ...prev,
          totalStock: total,
          totalDonors: donorsRes.count || prev.totalDonors,
          totalHospitals: hospitalsRes.count || prev.totalHospitals,
          pendingRequests: requestsRes.data?.filter((r) => r.status === 'pending').length || prev.pendingRequests,
        }));
      }

      if (requestsRes.data && requestsRes.data.length > 0) {
        setRecentRequests(requestsRes.data);
      }
    } catch {
      console.log('Using demo dashboard data');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Overview of blood bank operations and statistics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatsCard
          label="Total Donors"
          value={stats.totalDonors.toLocaleString()}
          icon={<Users className="w-6 h-6" />}
          trend={{ value: 12, isPositive: true }}
          color="#22C55E"
        />
        <StatsCard
          label="Hospitals"
          value={stats.totalHospitals}
          icon={<Building2 className="w-6 h-6" />}
          trend={{ value: 8, isPositive: true }}
          color="#3B82F6"
        />
        <StatsCard
          label="Blood Units"
          value={stats.totalStock}
          icon={<Droplets className="w-6 h-6" />}
          trend={{ value: 5, isPositive: false }}
          color="#DC2626"
        />
        <StatsCard
          label="Pending Requests"
          value={stats.pendingRequests}
          icon={<FileText className="w-6 h-6" />}
          color="#F59E0B"
        />
      </div>

      {/* Blood Stock Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" />
            Blood Stock Overview
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 stagger-children">
          {stock.map((s) => (
            <BloodStockCard key={s.blood_group} bloodGroup={s.blood_group} units={s.units} />
          ))}
        </div>
      </div>

      {/* Recent Requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
            Recent Blood Requests
          </h2>
        </div>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Hospital</th>
                  <th>Blood Group</th>
                  <th>Units</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((req) => (
                  <tr key={req.id}>
                    <td className="font-medium">{req.hospital_name}</td>
                    <td>
                      <span className="badge badge-primary">{req.blood_group}</span>
                    </td>
                    <td>{req.units_requested}</td>
                    <td>
                      <span className={`badge ${urgencyBadge[req.urgency || 'normal']}`}>
                        {req.urgency}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${statusBadge[req.status || 'pending']}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="text-[var(--color-muted)]">
                      {req.created_at ? new Date(req.created_at).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
