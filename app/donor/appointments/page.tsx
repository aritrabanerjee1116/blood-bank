'use client';

import { useAuth } from '@/context/AuthProvider';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, MapPin, Plus } from 'lucide-react';
import Modal from '@/components/Modal';
import type { Appointment } from '@/lib/types';

const demoAppointments: Appointment[] = [
  { id: '1', donor_id: 'd1', scheduled_date: '2026-04-15', scheduled_time: '10:00', location: 'Central Blood Bank, Mumbai', status: 'scheduled', created_at: '', updated_at: '' },
  { id: '2', donor_id: 'd1', scheduled_date: '2026-01-10', scheduled_time: '09:30', location: 'City Blood Bank, Mumbai', status: 'completed', created_at: '', updated_at: '' },
];

const fallbackLocations = [
  'Central Blood Bank, Mumbai',
  'City Blood Bank, Delhi',
  'Red Cross Center, Pune',
];

export default function AppointmentsPage() {
  const { profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>(demoAppointments);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ date: '', time: '', location: '', notes: '' });
  const [locations, setLocations] = useState<string[]>(fallbackLocations);

  useEffect(() => { fetchAppointments(); }, []);

  // Fetch hospital locations from profiles table when modal opens
  useEffect(() => {
    if (showModal) {
      fetchLocations();
    }
  }, [showModal]);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('hospital_name, address')
        .eq('role', 'hospital')
        .eq('is_approved', true);

      if (error) throw error;

      if (data && data.length > 0) {
        const hospitalLocations = data.map((h) => {
          if (h.address && h.hospital_name) {
            return `${h.hospital_name}, ${h.address}`;
          }
          return h.hospital_name || h.address || '';
        }).filter(Boolean);

        if (hospitalLocations.length > 0) {
          setLocations(hospitalLocations);
        }
      }
    } catch {
      console.log('Using fallback locations');
    }
  };

  const fetchAppointments = async () => {
    try {
      if (!profile) return;
      const { data, error } = await supabase.from('appointments').select('*').eq('donor_id', profile.id).order('scheduled_date', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) setAppointments(data);
    } catch { console.log('Using demo appointments'); }
  };

  const handleSchedule = async () => {
    const payload = {
      donor_id: profile?.id,
      donor_name: profile?.full_name,
      scheduled_date: form.date,
      scheduled_time: form.time,
      location: form.location,
      status: 'scheduled' as const,
      notes: form.notes,
    };

    try {
      const { error } = await supabase.from('appointments').insert(payload);
      if (error) throw error;
      fetchAppointments();
    } catch {
      const newApt: Appointment = { ...payload, id: Math.random().toString(36).slice(2), donor_id: profile?.id || '', created_at: new Date().toISOString(), updated_at: '' };
      setAppointments((prev) => [newApt, ...prev]);
    }
    setShowModal(false);
    setForm({ date: '', time: '', location: '', notes: '' });
  };

  const cancelAppointment = async (id: string) => {
    try {
      const { error } = await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', id);
      if (error) throw error;
      fetchAppointments();
    } catch {
      setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: 'cancelled' as const } : a));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Appointments</h1>
          <p className="text-sm text-[var(--color-muted)]">Schedule and manage your donation appointments</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus className="w-4 h-4" /> Schedule
        </button>
      </div>

      <div className="space-y-4 stagger-children">
        {appointments.map((apt) => (
          <div key={apt.id} className="glass-card p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                  <span className="font-medium">{apt.location}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-[var(--color-muted)]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {apt.scheduled_date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {apt.scheduled_time}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`badge ${apt.status === 'completed' ? 'badge-success' : apt.status === 'scheduled' ? 'badge-info' : 'badge-danger'}`}>
                  {apt.status}
                </span>
                {apt.status === 'scheduled' && (
                  <button onClick={() => cancelAppointment(apt.id)} className="btn btn-ghost btn-sm text-[var(--color-danger)]">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Schedule Appointment">
        <div className="space-y-4">
          <div>
            <label className="input-label">Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="input-label">Time</label>
            <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="input-label">Location</label>
            <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="select-field" required>
              <option value="">Select a hospital / location</option>
              {locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>
          <div>
            <label className="input-label">Notes (optional)</label>
            <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field" placeholder="Any special notes..." />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
            <button onClick={handleSchedule} className="btn btn-primary">Schedule</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

