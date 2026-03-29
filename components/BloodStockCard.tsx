'use client';

import { Droplets } from 'lucide-react';
import type { BloodGroup } from '@/lib/types';

interface BloodStockCardProps {
  bloodGroup: BloodGroup;
  units: number;
  status?: 'available' | 'low' | 'critical' | 'out';
}

const statusConfig = {
  available: { label: 'Available', class: 'badge-success' },
  low: { label: 'Low Stock', class: 'badge-warning' },
  critical: { label: 'Critical', class: 'badge-danger' },
  out: { label: 'Out of Stock', class: 'badge-danger' },
};

function getStatus(units: number): 'available' | 'low' | 'critical' | 'out' {
  if (units === 0) return 'out';
  if (units <= 5) return 'critical';
  if (units <= 15) return 'low';
  return 'available';
}

export default function BloodStockCard({
  bloodGroup,
  units,
  status,
}: BloodStockCardProps) {
  const effectiveStatus = status || getStatus(units);
  const config = statusConfig[effectiveStatus];

  return (
    <div className="glass-card p-5 text-center group">
      <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[rgba(220,38,38,0.1)] flex items-center justify-center group-hover:animate-pulse-glow transition-all">
        <Droplets className="w-7 h-7 text-[var(--color-primary)]" />
      </div>
      <h3 className="text-2xl font-bold gradient-text mb-1">{bloodGroup}</h3>
      <p className="text-3xl font-extrabold text-[var(--foreground)] mb-2">
        {units}
      </p>
      <p className="text-xs text-[var(--color-muted)] mb-3">Units Available</p>
      <span className={`badge ${config.class}`}>{config.label}</span>
    </div>
  );
}
