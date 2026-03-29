'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/Modal';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Plus, Pencil, Trash2, Search, Droplets } from 'lucide-react';
import type { BloodGroup, BloodStock } from '@/lib/types';

const allBloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const demoInventory: BloodStock[] = [
  { id: '1', blood_group: 'A+', units_available: 42, expiry_date: '2026-06-15', collected_date: '2026-03-15', status: 'available', created_at: '', updated_at: '' },
  { id: '2', blood_group: 'A-', units_available: 12, expiry_date: '2026-05-20', collected_date: '2026-02-20', status: 'available', created_at: '', updated_at: '' },
  { id: '3', blood_group: 'B+', units_available: 35, expiry_date: '2026-06-10', collected_date: '2026-03-10', status: 'available', created_at: '', updated_at: '' },
  { id: '4', blood_group: 'B-', units_available: 8, expiry_date: '2026-05-25', collected_date: '2026-02-25', status: 'available', created_at: '', updated_at: '' },
  { id: '5', blood_group: 'O+', units_available: 50, expiry_date: '2026-07-01', collected_date: '2026-04-01', status: 'available', created_at: '', updated_at: '' },
  { id: '6', blood_group: 'O-', units_available: 15, expiry_date: '2026-06-20', collected_date: '2026-03-20', status: 'available', created_at: '', updated_at: '' },
  { id: '7', blood_group: 'AB+', units_available: 18, expiry_date: '2026-05-30', collected_date: '2026-02-28', status: 'available', created_at: '', updated_at: '' },
  { id: '8', blood_group: 'AB-', units_available: 5, expiry_date: '2026-04-15', collected_date: '2026-01-15', status: 'available', created_at: '', updated_at: '' },
];

export default function InventoryPage() {
  const [inventory, setInventory] = useState<BloodStock[]>(demoInventory);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<BloodStock | null>(null);
  const [form, setForm] = useState({
    blood_group: '' as BloodGroup | '',
    units_available: '',
    expiry_date: '',
    collected_date: '',
    status: 'available' as 'available' | 'reserved' | 'expired',
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('blood_stock')
        .select('*')
        .order('blood_group');
      if (error) throw error;
      if (data && data.length > 0) setInventory(data);
    } catch {
      console.log('Using demo inventory');
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingItem(null);
    setForm({ blood_group: '', units_available: '', expiry_date: '', collected_date: '', status: 'available' });
    setShowModal(true);
  };

  const openEdit = (item: BloodStock) => {
    setEditingItem(item);
    setForm({
      blood_group: item.blood_group,
      units_available: String(item.units_available),
      expiry_date: item.expiry_date,
      collected_date: item.collected_date,
      status: item.status,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    const payload = {
      blood_group: form.blood_group,
      units_available: parseInt(form.units_available),
      expiry_date: form.expiry_date,
      collected_date: form.collected_date,
      status: form.status,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingItem) {
        const { error } = await supabase.from('blood_stock').update(payload).eq('id', editingItem.id);
        if (error) {
          console.error('Supabase update error:', error);
          throw error;
        }
      } else {
        const { error } = await supabase.from('blood_stock').insert(payload);
        if (error) {
          console.error('Supabase insert error:', error);
          throw error;
        }
      }
      await fetchInventory();
    } catch (err) {
      console.error('Save failed, updating local state:', err);
      // For demo, update local state
      if (editingItem) {
        setInventory((prev) => prev.map((item) => item.id === editingItem.id ? { ...item, ...payload } as BloodStock : item));
      } else {
        const newItem: BloodStock = { ...payload, id: Math.random().toString(36).slice(2), created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as BloodStock;
        setInventory((prev) => [...prev, newItem]);
      }
    }
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const { error } = await supabase.from('blood_stock').delete().eq('id', id);
      if (error) throw error;
      fetchInventory();
    } catch {
      setInventory((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const filtered = filter ? inventory.filter((i) => i.blood_group === filter) : inventory;

  if (loading) return <div className="py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Blood Inventory</h1>
          <p className="text-sm text-[var(--color-muted)]">Manage blood units across all groups</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary">
          <Plus className="w-4 h-4" /> Add Blood Unit
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <div className="max-w-xs input-icon-wrapper">
          <Search className="input-icon" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="select-field text-sm">
            <option value="">All Blood Groups</option>
            {allBloodGroups.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
          </select>
        </div>
        <span className="text-sm text-[var(--color-muted)]">{filtered.length} items</span>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Blood Group</th>
                <th>Units</th>
                <th>Collected</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-[var(--color-primary)]" />
                      <span className="font-semibold">{item.blood_group}</span>
                    </div>
                  </td>
                  <td className="font-medium">{item.units_available}</td>
                  <td className="text-sm text-[var(--color-muted)]">{item.collected_date}</td>
                  <td className="text-sm text-[var(--color-muted)]">{item.expiry_date}</td>
                  <td>
                    <span className={`badge ${item.status === 'available' ? 'badge-success' : item.status === 'reserved' ? 'badge-warning' : 'badge-danger'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(item)} className="btn btn-ghost btn-sm" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="btn btn-ghost btn-sm text-[var(--color-danger)]" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingItem ? 'Edit Blood Unit' : 'Add Blood Unit'}>
        <div className="space-y-4">
          <div>
            <label className="input-label">Blood Group</label>
            <select value={form.blood_group} onChange={(e) => setForm({ ...form, blood_group: e.target.value as BloodGroup })} className="select-field">
              <option value="">Select Group</option>
              {allBloodGroups.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
          <div>
            <label className="input-label">Units Available</label>
            <input type="number" value={form.units_available} onChange={(e) => setForm({ ...form, units_available: e.target.value })} className="input-field" placeholder="Enter units" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Collected Date</label>
              <input type="date" value={form.collected_date} onChange={(e) => setForm({ ...form, collected_date: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="input-label">Expiry Date</label>
              <input type="date" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="input-label">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'available' | 'reserved' | 'expired' })} className="select-field">
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
            <button onClick={handleSave} className="btn btn-primary">{editingItem ? 'Update' : 'Add'} Unit</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
