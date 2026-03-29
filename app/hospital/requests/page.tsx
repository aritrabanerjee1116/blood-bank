'use client';

import { useAuth } from '@/context/AuthProvider';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/Modal';
import { Plus, FileText, Clock, Droplets } from 'lucide-react';
import type { BloodGroup, BloodRequest, UrgencyLevel } from '@/lib/types';

const allBloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const demoRequests: BloodRequest[] = [
  { id: '1', hospital_id: 'h1', blood_group: 'O+', units_requested: 5, urgency: 'emergency', status: 'pending', notes: 'Emergency case - surgery', created_at: '2026-03-27T10:00:00', updated_at: '' },
  { id: '2', hospital_id: 'h1', blood_group: 'A-', units_requested: 3, urgency: 'urgent', status: 'approved', notes: 'ICU patient needs', created_at: '2026-03-25T14:00:00', updated_at: '' },
  { id: '3', hospital_id: 'h1', blood_group: 'B+', units_requested: 2, urgency: 'normal', status: 'fulfilled', notes: 'Routine transfusion', created_at: '2026-03-20T09:00:00', updated_at: '' },
];

const urgencyBadge = { normal: 'badge-info', urgent: 'badge-warning', emergency: 'badge-danger' };
const statusBadge = { pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-danger', fulfilled: 'badge-info' };

export default function HospitalRequestsPage() {
  const { profile } = useAuth();
  const [requests, setRequests] = useState<BloodRequest[]>(demoRequests);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ blood_group: '' as BloodGroup | '', units: '', urgency: 'normal' as UrgencyLevel, notes: '' });

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      if (!profile) return;
      const { data, error } = await supabase.from('blood_requests').select('*').eq('hospital_id', profile.id).order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) setRequests(data);
    } catch { console.log('Using demo requests'); }
  };

  const handleSubmit = async () => {
    const payload = {
      hospital_id: profile?.id,
      hospital_name: profile?.hospital_name,
      blood_group: form.blood_group,
      units_requested: parseInt(form.units),
      urgency: form.urgency,
      status: 'pending' as const,
      notes: form.notes,
    };

    try {
      const { error } = await supabase.from('blood_requests').insert(payload);
      if (error) throw error;
      fetchRequests();
    } catch {
      const newReq: BloodRequest = { ...payload, id: Math.random().toString(36).slice(2), hospital_id: profile?.id || '', blood_group: form.blood_group as BloodGroup, created_at: new Date().toISOString(), updated_at: '' };
      setRequests((prev) => [newReq, ...prev]);
    }
    setShowModal(false);
    setForm({ blood_group: '', units: '', urgency: 'normal', notes: '' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Blood Requests</h1>
          <p className="text-sm text-[var(--color-muted)]">Submit and track blood requests</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus className="w-4 h-4" /> New Request
        </button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['pending', 'approved', 'rejected', 'fulfilled'] as const).map((s) => (
          <div key={s} className="glass-card p-4 text-center">
            <p className="text-2xl font-bold">{requests.filter((r) => r.status === s).length}</p>
            <p className="text-xs text-[var(--color-muted)] capitalize">{s}</p>
          </div>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-3 stagger-children">
        {requests.map((req) => (
          <div key={req.id} className="glass-card p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[rgba(220,38,38,0.1)] flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-lg">{req.blood_group}</span>
                    <span className="text-[var(--color-muted)]">·</span>
                    <span className="text-sm">{req.units_requested} units</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[var(--color-muted)]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(req.created_at).toLocaleDateString()}
                    </span>
                    {req.notes && (
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" /> {req.notes}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge ${urgencyBadge[req.urgency]}`}>{req.urgency}</span>
                <span className={`badge ${statusBadge[req.status]}`}>{req.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Request Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Submit Blood Request">
        <div className="space-y-4">
          <div>
            <label className="input-label">Blood Group</label>
            <select value={form.blood_group} onChange={(e) => setForm({ ...form, blood_group: e.target.value as BloodGroup })} className="select-field" required>
              <option value="">Select Blood Group</option>
              {allBloodGroups.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
          <div>
            <label className="input-label">Units Required</label>
            <input type="number" value={form.units} onChange={(e) => setForm({ ...form, units: e.target.value })} className="input-field" placeholder="Enter number of units" min="1" required />
          </div>
          <div>
            <label className="input-label">Urgency Level</label>
            <select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value as UrgencyLevel })} className="select-field">
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
          <div>
            <label className="input-label">Notes</label>
            <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field" placeholder="Reason or details..." />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
            <button onClick={handleSubmit} className="btn btn-primary">Submit Request</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
