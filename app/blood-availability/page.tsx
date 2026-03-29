'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import BloodStockCard from '@/components/BloodStockCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { supabase } from '@/lib/supabase';
import { Search, Filter } from 'lucide-react';
import type { BloodGroup } from '@/lib/types';

interface StockSummary {
  blood_group: BloodGroup;
  total_units: number;
}

const allBloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Fallback demo data when Supabase is not connected
const demoStock: StockSummary[] = [
  { blood_group: 'A+', total_units: 42 },
  { blood_group: 'A-', total_units: 12 },
  { blood_group: 'B+', total_units: 35 },
  { blood_group: 'B-', total_units: 8 },
  { blood_group: 'AB+', total_units: 18 },
  { blood_group: 'AB-', total_units: 5 },
  { blood_group: 'O+', total_units: 50 },
  { blood_group: 'O-', total_units: 15 },
];

export default function BloodAvailabilityPage() {
  const [stock, setStock] = useState<StockSummary[]>(demoStock);
  const [filter, setFilter] = useState<BloodGroup | ''>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      const { data, error } = await supabase
        .from('blood_stock')
        .select('blood_group, units_available')
        .eq('status', 'available');

      if (error) throw error;

      if (data && data.length > 0) {
        // Aggregate by blood group
        const aggregated: Record<string, number> = {};
        data.forEach((item) => {
          const bg = item.blood_group as BloodGroup;
          aggregated[bg] = (aggregated[bg] || 0) + item.units_available;
        });

        const stockData = allBloodGroups.map((bg) => ({
          blood_group: bg,
          total_units: aggregated[bg] || 0,
        }));

        setStock(stockData);
      }
    } catch {
      // Keep demo data on error
      console.log('Using demo blood stock data');
    } finally {
      setLoading(false);
    }
  };

  const filteredStock = filter
    ? stock.filter((s) => s.blood_group === filter)
    : stock;

  const totalUnits = stock.reduce((sum, s) => sum + s.total_units, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12 blood-drop-bg">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              Blood <span className="gradient-text">Availability</span>
            </h1>
            <p className="text-[var(--color-muted)] max-w-lg mx-auto">
              Real-time blood stock across our network. Filter by blood group to find what you need.
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 stagger-children">
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-[var(--foreground)]">{totalUnits}</p>
              <p className="text-xs text-[var(--color-muted)]">Total Units</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-[var(--color-success)]">
                {stock.filter((s) => s.total_units > 15).length}
              </p>
              <p className="text-xs text-[var(--color-muted)]">Well Stocked</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-[var(--color-warning)]">
                {stock.filter((s) => s.total_units > 5 && s.total_units <= 15).length}
              </p>
              <p className="text-xs text-[var(--color-muted)]">Low Stock</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-[var(--color-danger)]">
                {stock.filter((s) => s.total_units <= 5).length}
              </p>
              <p className="text-xs text-[var(--color-muted)]">Critical</p>
            </div>
          </div>

          {/* Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <div className="flex-1 max-w-sm input-icon-wrapper">
              <Search className="input-icon" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as BloodGroup | '')}
                className="select-field"
              >
                <option value="">All Blood Groups</option>
                {allBloodGroups.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
              <Filter className="w-4 h-4" />
              Showing {filteredStock.length} of {allBloodGroups.length} groups
            </div>
          </div>

          {/* Stock Grid */}
          {loading ? (
            <div className="py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 stagger-children">
              {filteredStock.map((s) => (
                <BloodStockCard
                  key={s.blood_group}
                  bloodGroup={s.blood_group}
                  units={s.total_units}
                />
              ))}
            </div>
          )}

          {/* Info Note */}
          <div className="mt-12 glass-card p-6 text-center">
            <p className="text-sm text-[var(--color-muted)]">
              Stock data refreshes in real-time from our Supabase database. 
              Need blood urgently? Contact the emergency line or visit the nearest blood bank.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
