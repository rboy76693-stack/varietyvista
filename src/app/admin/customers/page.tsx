'use client';

import { useState, useEffect } from 'react';
import { Search, Users, ShoppingBag, IndianRupee, MapPin, Phone, Mail, Loader2 } from 'lucide-react';
import { fetchAdminCustomers } from '@/lib/admin-actions';
import { Profile } from '@/lib/db-schema';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAdminCustomers();
        setCustomers(data);
      } catch (err) {
        console.error('Customer fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = customers.filter(c =>
    (c.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.address || '').toLowerCase().includes(search.toLowerCase())
  );

  const selectedCustomer = customers.find(c => c.id === selected);
  
  // Note: For real stats, we'd normally join with orders, but for now we show profile info
  const totalCustomers = customers.length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#c8922a]" />
        <p className="text-[10px] font-black uppercase tracking-widest text-[#3a3020]">Syncing Customer Directory...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#f0ead6', fontFamily: "'Playfair Display', serif" }}>Customers</h1>
        <p className="text-sm mt-1" style={{ color: '#4a4030' }}>{totalCustomers} registered customers found in Supabase.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Customers', value: String(totalCustomers), icon: Users, color: '#c084fc' },
          { label: 'Verified Profiles', value: String(customers.filter(c => c.phone).length), icon: Phone, color: '#c8922a' },
          { label: 'Active Leads', value: String(customers.length), icon: ShoppingBag, color: '#4ade80' },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-xl border p-5" style={{ background: '#111', borderColor: '#1e1e1e' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${card.color}18` }}>
                  <Icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
                <div>
                  <p className="text-xl font-black" style={{ color: '#f0ead6' }}>{card.value}</p>
                  <p className="text-xs uppercase tracking-widest" style={{ color: '#4a4030' }}>{card.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="rounded-xl border p-4" style={{ background: '#111', borderColor: '#1e1e1e' }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#4a4030' }} />
          <input type="text" placeholder="Search by name, email or address…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg outline-none"
            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f0ead6' }}
          />
        </div>
      </div>

      <div className={`grid gap-6 ${selected ? 'grid-cols-1 xl:grid-cols-3' : 'grid-cols-1'}`}>
        <div className={`rounded-xl border overflow-hidden ${selected ? 'xl:col-span-2' : ''}`} style={{ background: '#111', borderColor: '#1e1e1e' }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #1a1a1a', background: '#0f0f0f' }}>
                {['Customer', 'Contact', 'Joined', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest" style={{ color: '#3a3020' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="p-20 text-center text-xs opacity-50 uppercase font-black tracking-widest">No customers in database.</td></tr>
              ) : filtered.map((c, i) => (
                <tr key={c.id} className="cursor-pointer hover:bg-white/[0.02] transition-colors"
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid #141414' : 'none', background: selected === c.id ? 'rgba(200,146,42,0.05)' : 'transparent' }}
                  onClick={() => setSelected(selected === c.id ? null : c.id)}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #c8922a, #8B6010)', color: '#0d0d0d' }}>
                        {(c.full_name || 'U')[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: '#f0ead6' }}>{c.full_name || 'New Customer'}</p>
                        <p className="text-xs" style={{ color: '#4a4030' }}>{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: '#6a5a40' }}>{c.phone || 'No phone'}</td>
                  <td className="px-5 py-3.5 text-xs font-mono" style={{ color: '#4a4030' }}>{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 text-xs font-bold rounded-full uppercase"
                      style={{ background: '#4ade8015', color: '#4ade80' }}>
                      Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedCustomer && (
          <div className="rounded-xl border overflow-hidden" style={{ background: '#111', borderColor: '#1e1e1e' }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#1a1a1a', background: '#0f0f0f' }}>
              <h3 className="font-bold text-sm uppercase tracking-widest" style={{ color: '#f0ead6' }}>Customer Profile</h3>
              <button onClick={() => setSelected(null)} style={{ color: '#4a4030' }}>✕</button>
            </div>
            <div className="p-5 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black"
                  style={{ background: 'linear-gradient(135deg, #c8922a, #8B6010)', color: '#0d0d0d' }}>
                  {(selectedCustomer.full_name || 'U')[0]}
                </div>
                <div>
                  <p className="font-black text-lg" style={{ color: '#f0ead6' }}>{selectedCustomer.full_name || 'New Customer'}</p>
                  <p className="text-xs" style={{ color: '#4a4030' }}>ID: {selectedCustomer.id.slice(0,8)}</p>
                </div>
              </div>
              <hr style={{ borderColor: '#1e1e1e' }} />
              {[{ icon: Mail, val: selectedCustomer.email }, { icon: Phone, val: selectedCustomer.phone || 'No phone saved' }, { icon: MapPin, val: selectedCustomer.address || 'No address saved' }].map(({ icon: Icon, val }) => (
                <div key={val} className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color: '#4a4030' }} />
                  <span className="text-sm" style={{ color: '#6a5a40' }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
