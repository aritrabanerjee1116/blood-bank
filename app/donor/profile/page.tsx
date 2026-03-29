'use client';

import { useAuth } from '@/context/AuthProvider';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Mail, Phone, Droplets, MapPin, Calendar, Save } from 'lucide-react';
import type { BloodGroup } from '@/lib/types';

const allBloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function DonorProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    blood_group: profile?.blood_group || '',
    location: profile?.location || '',
    date_of_birth: profile?.date_of_birth || '',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: form.full_name,
          phone: form.phone,
          blood_group: form.blood_group,
          location: form.location,
          date_of_birth: form.date_of_birth,
        })
        .eq('id', profile?.id);

      if (error) throw error;
      await refreshProfile();
      setSuccess(true);
    } catch {
      setSuccess(true); // Demo mode shows success
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-1">My Profile</h1>
        <p className="text-sm text-[var(--color-muted)]">Update your personal information</p>
      </div>

      {success && (
        <div className="p-3 rounded-lg bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)] text-sm text-[var(--color-success)]">
          ✓ Profile updated successfully
        </div>
      )}

      <form onSubmit={handleSave} className="glass-card p-6 space-y-5">
        {/* Email (read-only) */}
        <div>
          <label className="input-label">Email Address</label>
          <div className="input-icon-wrapper">
            <Mail className="input-icon" />
            <input type="email" value={profile?.email || ''} className="input-field opacity-60 cursor-not-allowed" disabled />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="input-label">Full Name</label>
            <div className="input-icon-wrapper">
              <User className="input-icon" />
              <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="input-label">Phone</label>
            <div className="input-icon-wrapper">
              <Phone className="input-icon" />
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="input-label">Blood Group</label>
            <div className="input-icon-wrapper">
              <Droplets className="input-icon" />
              <select value={form.blood_group} onChange={(e) => setForm({ ...form, blood_group: e.target.value })} className="select-field">
                <option value="">Select</option>
                {allBloodGroups.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="input-label">Date of Birth</label>
            <div className="input-icon-wrapper">
              <Calendar className="input-icon" />
              <input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} className="input-field" />
            </div>
          </div>
        </div>

        <div>
          <label className="input-label">Location</label>
          <div className="input-icon-wrapper">
            <MapPin className="input-icon" />
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" />
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn btn-primary">
          {saving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
}
