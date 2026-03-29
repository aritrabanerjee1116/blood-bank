'use client';

import type { StatsCardData } from '@/lib/types';

export default function StatsCard({ label, value, icon, trend, color }: StatsCardData) {
  return (
    <div className="glass-card p-5 relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-[var(--color-muted)] font-medium">{label}</p>
          <p className="text-2xl font-bold text-[var(--foreground)]">{value}</p>
          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={`text-xs font-semibold ${
                  trend.isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-[var(--color-muted)]">vs last month</span>
            </div>
          )}
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
          style={{
            background: `${color || 'var(--color-primary)'}15`,
          }}
        >
          <span style={{ color: color || 'var(--color-primary)' }}>{icon}</span>
        </div>
      </div>
      {/* Decorative accent */}
      <div
        className="absolute bottom-0 left-0 h-[3px] w-1/3 rounded-full opacity-60"
        style={{ background: color || 'var(--gradient-primary)' }}
      />
    </div>
  );
}
