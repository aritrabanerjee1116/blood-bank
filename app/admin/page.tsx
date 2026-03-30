'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import StatsCard from '@/components/StatsCard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import {
  Users,
  Building2,
  Droplets,
  FileText,
  TrendingUp,
  Calendar,
  BarChart2,
  PieChart as PieIcon,
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
  const [chartTab, setChartTab] = useState<'bar' | 'donut'>('bar');

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

      {/* Blood Stock Overview – Charts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" />
            Blood Stock Overview
          </h2>
          {/* Chart type tabs */}
          <div style={{
            display: 'flex',
            gap: '6px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '10px',
            padding: '4px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <button
              onClick={() => setChartTab('bar')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px', borderRadius: '8px', fontSize: '13px',
                fontWeight: 600, border: 'none', cursor: 'pointer',
                transition: 'all 0.2s',
                background: chartTab === 'bar' ? 'var(--color-primary)' : 'transparent',
                color: chartTab === 'bar' ? '#fff' : 'var(--color-muted)',
              }}
            >
              <BarChart2 size={14} /> Bar
            </button>
            <button
              onClick={() => setChartTab('donut')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px', borderRadius: '8px', fontSize: '13px',
                fontWeight: 600, border: 'none', cursor: 'pointer',
                transition: 'all 0.2s',
                background: chartTab === 'donut' ? 'var(--color-primary)' : 'transparent',
                color: chartTab === 'donut' ? '#fff' : 'var(--color-muted)',
              }}
            >
              <PieIcon size={14} /> Donut
            </button>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          {chartTab === 'bar' ? (
            <>
              <p style={{ fontSize: '12px', color: 'var(--color-muted)', marginBottom: '16px' }}>
                Units available per blood group
              </p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={stock} margin={{ top: 4, right: 16, left: -10, bottom: 4 }} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis
                    dataKey="blood_group"
                    tick={{ fill: 'var(--color-muted)', fontSize: 13, fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(220,38,38,0.08)' }}
                    contentStyle={{
                      background: 'rgba(18,18,30,0.95)',
                      border: '1px solid rgba(220,38,38,0.3)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '13px',
                    }}
                    formatter={(value) => [`${Number(value)} units`, 'Stock']}
                    labelFormatter={(label) => `Blood Group: ${label}`}
                  />
                  <Bar dataKey="units" radius={[6, 6, 0, 0]} maxBarSize={48}>
                    {stock.map((entry) => {
                      const u = entry.units;
                      const color = u === 0 ? '#6B7280' : u <= 5 ? '#EF4444' : u <= 15 ? '#F59E0B' : '#22C55E';
                      return <Cell key={entry.blood_group} fill={color} fillOpacity={0.85} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div style={{ display: 'flex', gap: '20px', marginTop: '16px', flexWrap: 'wrap' }}>
                {[{color:'#22C55E',label:'Sufficient (>15)'},{color:'#F59E0B',label:'Low (6–15)'},{color:'#EF4444',label:'Critical (1–5)'},{color:'#6B7280',label:'Out of Stock'}].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-muted)' }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: l.color, display: 'inline-block' }} />
                    {l.label}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <p style={{ fontSize: '12px', color: 'var(--color-muted)', marginBottom: '8px' }}>
                Distribution of total blood units across all groups
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stock.map(s => ({ name: s.blood_group, value: s.units || 0 }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                    labelLine={false}
                  >
                    {stock.map((entry, index) => {
                      const palette = ['#DC2626','#EF4444','#F97316','#F59E0B','#22C55E','#10B981','#3B82F6','#8B5CF6'];
                      return <Cell key={entry.blood_group} fill={palette[index % palette.length]} fillOpacity={0.85} />;
                    })}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(18,18,30,0.95)',
                      border: '1px solid rgba(220,38,38,0.3)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '13px',
                    }}
                    formatter={(value, name) => [`${Number(value)} units`, String(name)]}
                  />
                  <Legend
                    formatter={(value) => <span style={{ color: 'var(--color-muted)', fontSize: '12px' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </>
          )}
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
