'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Users, Building2, CheckCircle, XCircle, Search } from 'lucide-react';
import type { Profile } from '@/lib/types';

const demoDonors: Profile[] = [
  { id: 'd1', email: 'john@email.com', role: 'donor', full_name: 'John Doe', phone: '+91 9876543210', blood_group: 'O+', location: 'Mumbai', is_approved: true, created_at: '2026-03-20', updated_at: '' },
  { id: 'd2', email: 'jane@email.com', role: 'donor', full_name: 'Jane Smith', phone: '+91 9876543211', blood_group: 'A-', location: 'Delhi', is_approved: true, created_at: '2026-03-18', updated_at: '' },
  { id: 'd3', email: 'amit@email.com', role: 'donor', full_name: 'Amit Patel', phone: '+91 9876543212', blood_group: 'B+', location: 'Pune', is_approved: true, created_at: '2026-03-15', updated_at: '' },
];

const demoHospitals: Profile[] = [
  { id: 'h1', email: 'city@hospital.com', role: 'hospital', full_name: 'Dr. Sharma', phone: '+91 8765432109', hospital_name: 'City General Hospital', license_number: 'HSP-001', address: 'Mumbai', is_approved: true, created_at: '2026-03-10', updated_at: '' },
  { id: 'h2', email: 'stmary@hospital.com', role: 'hospital', full_name: 'Dr. Williams', phone: '+91 8765432108', hospital_name: 'St. Mary Medical Center', license_number: 'HSP-002', address: 'Delhi', is_approved: false, created_at: '2026-03-22', updated_at: '' },
];

export default function UsersPage() {
  const [tab, setTab] = useState<'donors' | 'hospitals'>('donors');
  const [donors, setDonors] = useState<Profile[]>(demoDonors);
  const [hospitals, setHospitals] = useState<Profile[]>(demoHospitals);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const [donorRes, hospitalRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('role', 'donor').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').eq('role', 'hospital').order('created_at', { ascending: false }),
      ]);
      if (donorRes.data && donorRes.data.length > 0) setDonors(donorRes.data);
      if (hospitalRes.data && hospitalRes.data.length > 0) setHospitals(hospitalRes.data);
    } catch { console.log('Using demo user data'); }
    finally { setLoading(false); }
  };

  const toggleApproval = async (id: string, isApproved: boolean) => {
    try {
      const { error } = await supabase.from('profiles').update({ is_approved: !isApproved }).eq('id', id);
      if (error) throw error;
      fetchUsers();
    } catch {
      if (tab === 'hospitals') {
        setHospitals((prev) => prev.map((h) => h.id === id ? { ...h, is_approved: !isApproved } : h));
      } else {
        setDonors((prev) => prev.map((d) => d.id === id ? { ...d, is_approved: !isApproved } : d));
      }
    }
  };

  const currentList = tab === 'donors' ? donors : hospitals;
  const filtered = search
    ? currentList.filter((u) =>
        u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.hospital_name?.toLowerCase().includes(search.toLowerCase())
      )
    : currentList;

  if (loading) return <div className="py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-1">User Management</h1>
        <p className="text-sm text-[var(--color-muted)]">Manage donors and hospital registrations</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab('donors')} className={`btn btn-sm flex items-center gap-2 ${tab === 'donors' ? 'btn-primary' : 'btn-secondary'}`}>
          <Users className="w-4 h-4" /> Donors ({donors.length})
        </button>
        <button onClick={() => setTab('hospitals')} className={`btn btn-sm flex items-center gap-2 ${tab === 'hospitals' ? 'btn-primary' : 'btn-secondary'}`}>
          <Building2 className="w-4 h-4" /> Hospitals ({hospitals.length})
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10 text-sm" placeholder={`Search ${tab}...`} />
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {tab === 'donors' && <th>Blood Group</th>}
                {tab === 'hospitals' && <th>Hospital</th>}
                <th>Phone</th>
                <th>{tab === 'donors' ? 'Location' : 'License'}</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id}>
                  <td className="font-medium">{user.full_name}</td>
                  <td className="text-sm text-[var(--color-muted)]">{user.email}</td>
                  {tab === 'donors' && (
                    <td><span className="badge badge-primary">{user.blood_group}</span></td>
                  )}
                  {tab === 'hospitals' && (
                    <td className="text-sm">{user.hospital_name}</td>
                  )}
                  <td className="text-sm text-[var(--color-muted)]">{user.phone}</td>
                  <td className="text-sm text-[var(--color-muted)]">
                    {tab === 'donors' ? user.location : user.license_number}
                  </td>
                  <td>
                    <span className={`badge ${user.is_approved ? 'badge-success' : 'badge-warning'}`}>
                      {user.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleApproval(user.id, user.is_approved)}
                      className={`btn btn-ghost btn-sm ${user.is_approved ? 'text-[var(--color-danger)]' : 'text-[var(--color-success)]'}`}
                      title={user.is_approved ? 'Revoke approval' : 'Approve'}
                    >
                      {user.is_approved ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </button>
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
