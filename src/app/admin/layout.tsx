'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, Package, Tag, ShoppingCart,
  Users, BarChart2, Settings, ChevronRight,
  Menu, X, LogOut, Bell, ExternalLink
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard',   href: '/admin',                icon: LayoutDashboard },
  { label: 'Products',    href: '/admin/products',       icon: Package },
  { label: 'Inventory',   href: '/admin/inventory',      icon: Tag },
  { label: 'Categories',  href: '/admin/categories',     icon: Tag },
  { label: 'Orders',      href: '/admin/orders',         icon: ShoppingCart },
  { label: 'Customers',   href: '/admin/customers',      icon: Users },
  { label: 'Analytics',   href: '/admin/analytics',      icon: BarChart2 },
  { label: 'Settings',    href: '/admin/settings',       icon: Settings },
];

function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (v: boolean) => void }) {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col transition-all duration-300"
      style={{
        width: collapsed ? '72px' : '260px',
        background: '#0a0a0a',
        borderRight: '1px solid #1e1e1e',
      }}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 gap-3 border-b" style={{ borderColor: '#1e1e1e' }}>
        <div className="flex-shrink-0">
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
            <defs>
              <radialGradient id="ag" cx="40%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#f5d97a" />
                <stop offset="50%" stopColor="#c8922a" />
                <stop offset="100%" stopColor="#8B6010" />
              </radialGradient>
            </defs>
            <circle cx="18" cy="18" r="5" fill="url(#ag)" />
            <circle cx="18" cy="10" r="3" fill="url(#ag)" />
            <circle cx="18" cy="26" r="3" fill="url(#ag)" />
            <circle cx="10" cy="18" r="3" fill="url(#ag)" />
            <circle cx="26" cy="18" r="3" fill="url(#ag)" />
            <circle cx="11.5" cy="11.5" r="2" fill="url(#ag)" opacity="0.85" />
            <circle cx="24.5" cy="11.5" r="2" fill="url(#ag)" opacity="0.85" />
            <circle cx="11.5" cy="24.5" r="2" fill="url(#ag)" opacity="0.85" />
            <circle cx="24.5" cy="24.5" r="2" fill="url(#ag)" opacity="0.85" />
          </svg>
        </div>
        {!collapsed && (
          <span
            className="text-lg font-semibold whitespace-nowrap overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #f5d97a, #c8922a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Variety Vista
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto flex-shrink-0 p-1.5 rounded hover:opacity-70 transition-opacity"
          style={{ color: '#5a4a30' }}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav Label */}
      {!collapsed && (
        <p className="px-4 pt-5 pb-2 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#3a3020' }}>
          Navigation
        </p>
      )}

      {/* Nav Items */}
      <nav className="flex-1 px-2 pt-2 flex flex-col gap-1 overflow-y-auto">
        {navItems.map(item => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group"
              style={{
                background: active ? 'rgba(200,146,42,0.12)' : 'transparent',
                color: active ? '#c8922a' : '#5a4a30',
              }}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
              )}
              {!collapsed && active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#c8922a' }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: View Store + Logout */}
      <div className="p-2 border-t flex flex-col gap-1" style={{ borderColor: '#1e1e1e' }}>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-opacity hover:opacity-70"
          style={{ color: '#4a4030' }}
          title={collapsed ? 'View Store' : undefined}
        >
          <ExternalLink className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm">View Store</span>}
        </Link>
        <button
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-opacity hover:opacity-70 w-full text-left"
          style={{ color: '#4a4030' }}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Build breadcrumb
  const crumbs = pathname.replace('/admin', '').split('/').filter(Boolean);

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#0d0d0d] text-[#f0ead6] flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main content */}
      <div
        className="transition-all duration-300 flex-1 flex flex-col"
        style={{ marginLeft: collapsed ? '72px' : '260px' }}
      >
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between h-16 px-6"
          style={{ background: 'rgba(13,13,13,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1e1e1e' }}
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <Link href="/admin" className="hover:opacity-70 transition-opacity" style={{ color: '#5a4a30' }}>
              Admin
            </Link>
            {crumbs.map((crumb, i) => (
              <span key={crumb} className="flex items-center gap-2">
                <ChevronRight className="w-3 h-3" style={{ color: '#3a3020' }} />
                <span
                  className="capitalize font-medium"
                  style={{ color: i === crumbs.length - 1 ? '#c8922a' : '#5a4a30' }}
                >
                  {crumb.replace(/-/g, ' ')}
                </span>
              </span>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <button suppressHydrationWarning className="relative p-2 hover:opacity-70 transition-opacity" style={{ color: '#5a4a30' }}>
              <Bell className="w-5 h-5" />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: '#c8922a' }}
              />
            </button>
            <div
              className="flex items-center gap-2 pl-4"
              style={{ borderLeft: '1px solid #2a2a2a' }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: 'linear-gradient(135deg, #c8922a, #8B6010)', color: '#0d0d0d' }}
              >
                A
              </div>
              {!collapsed && (
                <div className="hidden md:block">
                  <p className="text-xs font-semibold" style={{ color: '#f0ead6' }}>Admin</p>
                  <p className="text-xs" style={{ color: '#4a4030' }}>contact@varietyvista.co.in</p>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
