'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/LoadingSpinner';
import { CheckCircle, XCircle, Clock, Filter } from 'lucide-react';
import type { BloodRequest, RequestStatus } from '@/lib/types';

const demoRequests: BloodRequest[] = [
  { id: '1', hospital_id: 'h1', hospital_name: 'City General Hospital', blood_group: 'O+', units_requested: 5, urgency: 'emergency', status: 'pending', notes: 'Surgery scheduled tomorrow', created_at: '2026-03-27T10:00:00', updated_at: '' },
  { id: '2', hospital_id: 'h2', hospital_name: 'St. Mary Medical Center', blood_group: 'A-', units_requested: 3, urgency: 'urgent', status: 'pending', notes: 'ICU patient', created_at: '2026-03-26T14:00:00', updated_at: '' },
  { id: '3', hospital_id: 'h3', hospital_name: 'Metro Health Clinic', blood_group: 'B+', units_requested: 2, urgency: 'normal', status: 'approved', notes: 'Routine transfusion', created_at: '2026-03-26T09:00:00', updated_at: '' },
  { id: '4', hospital_id: 'h4', hospital_name: 'National Hospital', blood_group: 'AB+', units_requested: 4, urgency: 'urgent', status: 'rejected', notes: 'Stock unavailable', created_at: '2026-03-25T16:00:00', updated_at: '' },
  { id: '5', hospital_id: 'h5', hospital_name: 'Apollo Hospital', blood_group: 'O-', units_requested: 6, urgency: 'emergency', status: 'fulfilled', notes: 'Delivered successfully', created_at: '2026-03-24T11:00:00', updated_at: '' },
];

const urgencyColor = { normal: 'badge-info', urgent: 'badge-warning', emergency: 'badge-danger' };
const statusColor = { pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-danger', fulfilled: 'badge-info' };

export default function RequestsPage() {
  const [requests, setRequests] = useState<BloodRequest[]>(demoRequests);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | ''>('');

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase.from('blood_requests').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) setRequests(data);
    } catch { console.log('Using demo requests'); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id: string, status: RequestStatus) => {
    try {
      const { error } = await supabase.from('blood_requests').update({ status }).eq('id', id);
      if (error) throw error;
      fetchRequests();
    } catch {
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    }
  };

  const filtered = statusFilter ? requests.filter((r) => r.status === statusFilter) : requests;

  if (loading) return <div className="py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-1">Blood Requests</h1>
        <p className="text-sm text-[var(--color-muted)]">Review and process hospital blood requests</p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['pending', 'approved', 'rejected', 'fulfilled'] as RequestStatus[]).map((s) => (
          <button key={s} onClick={() => setStatusFilter(statusFilter === s ? '' : s)} className={`glass-card p-4 text-center cursor-pointer transition-all ${statusFilter === s ? 'ring-2 ring-[var(--color-primary)]' : ''}`}>
            <p className="text-2xl font-bold">{requests.filter((r) => r.status === s).length}</p>
            <p className="text-xs text-[var(--color-muted)] capitalize">{s}</p>
          </button>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-[var(--color-muted)]" />
        <span className="text-sm text-[var(--color-muted)]">
          Showing {filtered.length} request{filtered.length !== 1 ? 's' : ''}
        </span>
        {statusFilter && (
          <button onClick={() => setStatusFilter('')} className="btn btn-ghost btn-sm text-[var(--color-primary)]">
            Clear filter
          </button>
        )}
      </div>

      {/* Table */}
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((req) => (
                <tr key={req.id}>
                  <td className="font-medium">{req.hospital_name || 'Unknown'}</td>
                  <td><span className="badge badge-primary">{req.blood_group}</span></td>
                  <td>{req.units_requested}</td>
                  <td><span className={`badge ${urgencyColor[req.urgency]}`}>{req.urgency}</span></td>
                  <td><span className={`badge ${statusColor[req.status]}`}>{req.status}</span></td>
                  <td className="text-sm text-[var(--color-muted)]">{new Date(req.created_at).toLocaleDateString()}</td>
                  <td>
                    {req.status === 'pending' ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateStatus(req.id, 'approved')} className="btn btn-ghost btn-sm text-[var(--color-success)]" title="Approve">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => updateStatus(req.id, 'rejected')} className="btn btn-ghost btn-sm text-[var(--color-danger)]" title="Reject">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Processed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
