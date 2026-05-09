'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingCart, Users, IndianRupee, Package, Loader2 } from 'lucide-react';
import { fetchDashboardStats } from '@/lib/admin-actions';

const weeklyRevenue = [28000, 42000, 35000, 61000, 48000, 73000, 55000];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const maxRevenue = Math.max(...weeklyRevenue);

const topCities = [
  { city: 'Mumbai',    orders: 312, pct: 28 },
  { city: 'Delhi',     orders: 245, pct: 22 },
  { city: 'Bengaluru', orders: 198, pct: 18 },
  { city: 'Hyderabad', orders: 143, pct: 13 },
  { city: 'Pune',      orders: 121, pct: 11 },
  { city: 'Others',    orders:  88, pct:  8 },
];

const topProducts = [
  { name: 'Baggy Cargo Denim',  revenue: 68568, pct: 24 },
  { name: 'Straight Fit Black', revenue: 51513, pct: 18 },
  { name: 'Flared Wide Leg',    revenue: 50249, pct: 17 },
  { name: 'Jogger Denim',       revenue: 47475, pct: 16 },
  { name: 'Classic Skinny',     revenue: 30231, pct: 10 },
];

export default function AdminAnalytics() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Analytics load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#c8922a]" />
        <p className="text-[10px] font-black uppercase tracking-widest text-[#3a3020]">Generating Business Insights...</p>
      </div>
    );
  }

  const kpiCards = [
    { label: 'Total Revenue',  value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: IndianRupee, color: '#c8922a' },
    { label: 'Total Orders',   value: (stats?.totalOrders || 0).toLocaleString(),        icon: ShoppingCart, color: '#4ade80' },
    { label: 'Active Profiles', value: (stats?.customerCount || 0).toLocaleString(),     icon: Users,        color: '#c084fc' },
    { label: 'Product Range',  value: (stats?.productCount || 0).toLocaleString(),       icon: Package,      color: '#60a5fa' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#f0ead6', fontFamily: "'Playfair Display', serif" }}>Analytics</h1>
          <p className="text-sm mt-1" style={{ color: '#4a4030' }}>Performance metrics synced with Supabase</p>
        </div>
        <div className="px-4 py-2 bg-[#4ade8010] border border-[#4ade8020] rounded-full flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
           <span className="text-[9px] font-black uppercase tracking-widest text-[#4ade80]">Live Database Sync</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-xl border p-5" style={{ background: '#111', borderColor: '#1e1e1e' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${card.color}18` }}>
                  <Icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest text-[#3a3020]">Live Data</span>
              </div>
              <p className="text-2xl font-black" style={{ color: '#f0ead6' }}>{card.value}</p>
              <p className="text-xs uppercase tracking-widest mt-1" style={{ color: '#4a4030' }}>{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue Bar Chart (Simulated) */}
        <div className="rounded-xl border p-5" style={{ background: '#111', borderColor: '#1e1e1e' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold uppercase tracking-widest text-sm" style={{ color: '#f0ead6' }}>Weekly Revenue Projection</h3>
            <span className="text-xs font-bold px-3 py-1 rounded" style={{ background: 'rgba(200,146,42,0.1)', color: '#c8922a' }}>Simulated</span>
          </div>
          <div className="flex items-end gap-3 h-40">
            {weeklyRevenue.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-bold" style={{ color: '#c8922a' }}>
                  ₹{(val / 1000).toFixed(0)}k
                </span>
                <div className="w-full rounded-t-md transition-all duration-500 relative overflow-hidden" style={{ height: `${(val / maxRevenue) * 120}px`, background: 'rgba(200,146,42,0.15)', minHeight: 8 }}>
                  <div className="absolute bottom-0 left-0 right-0 rounded-t-md" style={{ height: '40%', background: 'linear-gradient(135deg, #f5d97a, #c8922a)' }} />
                </div>
                <span className="text-xs" style={{ color: '#3a3020' }}>{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Cities (Simulated) */}
        <div className="rounded-xl border p-5" style={{ background: '#111', borderColor: '#1e1e1e' }}>
          <h3 className="font-bold uppercase tracking-widest text-sm mb-6" style={{ color: '#f0ead6' }}>Customer Density by City</h3>
          <div className="space-y-4">
            {topCities.map(city => (
              <div key={city.city}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span style={{ color: '#f0ead6' }}>{city.city}</span>
                  <span className="font-bold font-mono" style={{ color: '#c8922a' }}>{city.orders} leads · {city.pct}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: '#1e1e1e' }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${city.pct}%`, background: 'linear-gradient(90deg, #f5d97a, #c8922a)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products by Revenue (Simulated) */}
        <div className="rounded-xl border p-5" style={{ background: '#111', borderColor: '#1e1e1e' }}>
          <h3 className="font-bold uppercase tracking-widest text-sm mb-6" style={{ color: '#f0ead6' }}>Top Revenue Drivers</h3>
          <div className="space-y-4">
            {topProducts.map((p, i) => (
              <div key={p.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-bold w-4" style={{ color: '#3a3020' }}>{i + 1}</span>
                    <span style={{ color: '#f0ead6' }}>{p.name}</span>
                  </span>
                  <span className="font-bold font-mono" style={{ color: '#c8922a' }}>₹{p.revenue.toLocaleString('en-IN')}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: '#1e1e1e' }}>
                  <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: 'linear-gradient(90deg, #8B6010, #c8922a)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods (Simulated) */}
        <div className="rounded-xl border p-5" style={{ background: '#111', borderColor: '#1e1e1e' }}>
          <h3 className="font-bold uppercase tracking-widest text-sm mb-6" style={{ color: '#f0ead6' }}>Regional Payment Trends</h3>
          <div className="space-y-5">
            {[
              { method: 'UPI (GPay/PhonePe)', pct: 52, color: '#4ade80' },
              { method: 'Credit / Debit Card', pct: 31, color: '#60a5fa' },
              { method: 'Cash on Delivery',    pct: 17, color: '#c8922a' },
            ].map(p => (
              <div key={p.method}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span style={{ color: '#f0ead6' }}>{p.method}</span>
                  <span className="font-bold" style={{ color: p.color }}>{p.pct}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: '#1e1e1e' }}>
                  <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
