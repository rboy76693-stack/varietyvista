'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Package, ShoppingCart, Users, IndianRupee, Plus, ArrowRight, Clock, Loader2, AlertCircle } from 'lucide-react';
import { fetchDashboardStats, fetchAdminOrders } from '@/lib/admin-actions';
import { Order } from '@/lib/db-schema';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setError(null);
        const [statsData, ordersData] = await Promise.all([
          fetchDashboardStats(),
          fetchAdminOrders()
        ]);
        setStats(statsData);
        setRecentOrders(ordersData.slice(0, 5));
      } catch (err: any) {
        console.error('Admin Load Error:', err);
        setError(err.message || 'Failed to connect to Supabase. Check your API keys and RLS policies.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#c8922a]" />
        <p className="text-[10px] font-black uppercase tracking-widest text-[#3a3020]">Syncing with Supabase...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-[#111] border border-[#1e1e1e] rounded-xl max-w-2xl mx-auto">
        <AlertCircle className="w-12 h-12 text-red-500 mb-6" />
        <h2 className="text-xl font-black uppercase tracking-tight text-[#f0ead6] mb-2">Connection Blocked</h2>
        <p className="text-sm text-[#4a4030] leading-relaxed mb-8">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-[#c8922a] text-[#0d0d0d] font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Revenue',   value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,  icon: IndianRupee, color: '#c8922a' },
    { label: 'Total Orders',    value: (stats?.totalOrders || 0).toString(),        icon: ShoppingCart, color: '#4ade80' },
    { label: 'Total Products',  value: (stats?.productCount || 0).toString(),       icon: Package,      color: '#60a5fa' },
    { label: 'Total Customers', value: (stats?.customerCount || 0).toString(),      icon: Users,        color: '#c084fc' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#f0ead6', fontFamily: "'Playfair Display', serif" }}>
            Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: '#4a4030' }}>Real-time business performance from Supabase.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold uppercase tracking-widest transition-opacity hover:opacity-85"
          style={{ background: 'linear-gradient(135deg, #f5d97a, #c8922a)', color: '#0d0d0d', borderRadius: '4px' }}
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="p-6 rounded-xl border" style={{ background: '#111', borderColor: '#1e1e1e' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}18` }}>
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-2xl font-black" style={{ color: '#f0ead6' }}>{stat.value}</p>
              <p className="text-xs mt-1 uppercase tracking-widest" style={{ color: '#4a4030' }}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-3 rounded-xl border overflow-hidden" style={{ background: '#111', borderColor: '#1e1e1e' }}>
          <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: '#1e1e1e' }}>
            <h2 className="font-bold uppercase tracking-widest text-sm" style={{ color: '#f0ead6' }}>Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                  {['Order', 'Customer', 'Amount', 'Status', 'Time'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest" style={{ color: '#3a3020' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                   <tr><td colSpan={5} className="p-10 text-center text-xs opacity-50">No orders yet.</td></tr>
                ) : recentOrders.map((order, i) => (
                  <tr key={order.id} className="transition-colors" style={{ borderBottom: i < recentOrders.length - 1 ? '1px solid #141414' : 'none' }}>
                    <td className="px-5 py-3.5 text-xs font-mono font-bold" style={{ color: '#c8922a' }}>{order.id.slice(0,8)}</td>
                    <td className="px-5 py-3.5 text-sm font-medium" style={{ color: '#f0ead6' }}>{order.profile?.full_name || 'Guest'}</td>
                    <td className="px-5 py-3.5 text-sm font-mono font-bold" style={{ color: '#f0ead6' }}>₹{Number(order.total_amount_inr || 0).toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wide rounded-full" style={{ background: 'rgba(200,146,42,0.1)', color: '#c8922a' }}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs flex items-center gap-1" style={{ color: '#3a3020' }}>
                      <Clock className="w-3 h-3" />{new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
