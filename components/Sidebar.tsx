'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Droplets, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { NavItem } from '@/lib/types';

interface SidebarProps {
  items: NavItem[];
  title: string;
}

export default function Sidebar({ items, title }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`sticky top-16 h-[calc(100vh-4rem)] flex flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--color-border)]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-[var(--color-primary)]" />
            <span className="text-sm font-semibold text-[var(--foreground)]">
              {title}
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-[var(--color-muted)] hover:text-white hover:bg-white/5 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-[rgba(220,38,38,0.1)] text-[var(--color-primary)] border border-[rgba(220,38,38,0.2)]'
                  : 'text-[var(--color-muted)] hover:text-white hover:bg-white/5'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <span
                className={`flex-shrink-0 ${
                  isActive ? 'text-[var(--color-primary)]' : 'group-hover:text-white'
                }`}
              >
                {item.icon}
              </span>
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-[var(--color-primary)] text-white">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
