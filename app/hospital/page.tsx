'use client';

import { useAuth } from '@/context/AuthProvider';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import StatsCard from '@/components/StatsCard';
import BloodStockCard from '@/components/BloodStockCard';
import {
  FileText,
  CheckCircle,
  Clock,
  Droplets,
  Activity,
  Calendar,
  Users,
} from 'lucide-react';
import type { BloodGroup, BloodRequest, Appointment } from '@/lib/types';

const demoRequests: Partial<BloodRequest>[] = [
  { id: '1', blood_group: 'O+', units_requested: 5, urgency: 'emergency', status: 'pending', created_at: '2026-03-27' },
  { id: '2', blood_group: 'A-', units_requested: 3, urgency: 'urgent', status: 'approved', created_at: '2026-03-25' },
  { id: '3', blood_group: 'B+', units_requested: 2, urgency: 'normal', status: 'fulfilled', created_at: '2026-03-20' },
];

const demoStock: { blood_group: BloodGroup; units: number }[] = [
  { blood_group: 'A+', units: 42 }, { blood_group: 'A-', units: 12 },
  { blood_group: 'B+', units: 35 }, { blood_group: 'B-', units: 8 },
  { blood_group: 'AB+', units: 18 }, { blood_group: 'AB-', units: 5 },
  { blood_group: 'O+', units: 50 }, { blood_group: 'O-', units: 15 },
];

const urgencyBadge = { normal: 'badge-info', urgent: 'badge-warning', emergency: 'badge-danger' };
const statusBadge = { pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-danger', fulfilled: 'badge-info' };
const appointmentBadge = { scheduled: 'badge-info', completed: 'badge-success', cancelled: 'badge-danger' };

export default function HospitalDashboard() {
  const { profile } = useAuth();
  const [requests, setRequests] = useState<Partial<BloodRequest>[]>(demoRequests);
  const [stock, setStock] = useState(demoStock);
  const [appointments, setAppointments] = useState<Partial<Appointment>[]>([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      if (!profile) return;

      const hospitalName = profile.hospital_name || '';

      const [reqRes, stockRes, aptRes] = await Promise.all([
        supabase.from('blood_requests').select('*').eq('hospital_id', profile.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('blood_stock').select('blood_group, units_available').eq('status', 'available'),
        // Fetch appointments where location contains this hospital's name
        supabase.from('appointments').select('*').ilike('location', `%${hospitalName}%`).order('scheduled_date', { ascending: true }),
      ]);

      if (reqRes.data && reqRes.data.length > 0) setRequests(reqRes.data);
      if (stockRes.data && stockRes.data.length > 0) {
        const agg: Record<string, number> = {};
        stockRes.data.forEach((item) => { agg[item.blood_group] = (agg[item.blood_group] || 0) + item.units_available; });
        const allGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        setStock(allGroups.map((bg) => ({ blood_group: bg, units: agg[bg] || 0 })));
      }
      if (aptRes.data) setAppointments(aptRes.data);
    } catch { console.log('Using demo hospital data'); }
  };

  const pending = requests.filter((r) => r.status === 'pending').length;
  const approved = requests.filter((r) => r.status === 'approved').length;
  const fulfilled = requests.filter((r) => r.status === 'fulfilled').length;
  const upcomingApts = appointments.filter((a) => a.status === 'scheduled').length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-1">
          <span className="gradient-text">{profile?.hospital_name || 'Hospital'}</span> Dashboard
        </h1>
        <p className="text-sm text-[var(--color-muted)]">Manage blood requests, track availability, and view donor appointments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 stagger-children">
        <StatsCard label="Total Requests" value={requests.length} icon={<FileText className="w-6 h-6" />} color="#3B82F6" />
        <StatsCard label="Pending" value={pending} icon={<Clock className="w-6 h-6" />} color="#F59E0B" />
        <StatsCard label="Approved" value={approved} icon={<CheckCircle className="w-6 h-6" />} color="#22C55E" />
        <StatsCard label="Fulfilled" value={fulfilled} icon={<Droplets className="w-6 h-6" />} color="#DC2626" />
        <StatsCard label="Upcoming Donors" value={upcomingApts} icon={<Users className="w-6 h-6" />} color="#8B5CF6" />
      </div>

      {/* Blood Availability */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-[var(--color-primary)]" />
          Current Blood Availability
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 stagger-children">
          {stock.map((s) => (
            <BloodStockCard key={s.blood_group} bloodGroup={s.blood_group} units={s.units} />
          ))}
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
          Donor Appointments
        </h2>
        {appointments.length > 0 ? (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Donor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr key={apt.id}>
                      <td className="font-medium">{apt.donor_name || 'Unknown'}</td>
                      <td className="text-sm">{apt.scheduled_date}</td>
                      <td className="text-sm">{apt.scheduled_time}</td>
                      <td>
                        <span className={`badge ${appointmentBadge[apt.status || 'scheduled']}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="text-sm text-[var(--color-muted)]">{apt.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="glass-card p-6 text-center">
            <p className="text-[var(--color-muted)]">No donor appointments scheduled at this hospital yet.</p>
          </div>
        )}
      </div>

      {/* Recent Requests */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Requests</h2>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Blood Group</th><th>Units</th><th>Urgency</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td><span className="badge badge-primary">{req.blood_group}</span></td>
                    <td>{req.units_requested}</td>
                    <td><span className={`badge ${urgencyBadge[req.urgency || 'normal']}`}>{req.urgency}</span></td>
                    <td><span className={`badge ${statusBadge[req.status || 'pending']}`}>{req.status}</span></td>
                    <td className="text-sm text-[var(--color-muted)]">{req.created_at ? new Date(req.created_at).toLocaleDateString() : '-'}</td>
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

