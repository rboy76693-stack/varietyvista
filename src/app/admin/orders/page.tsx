'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Download, ChevronDown, Package, Clock, CheckCircle, Truck, XCircle, Loader2 } from 'lucide-react';
import { fetchAdminOrders, updateOrderStatus } from '@/lib/admin-actions';
import { Order, OrderStatus } from '@/lib/db-schema';

const statusConfig: Record<string, { color: string; bg: string; icon: any }> = {
  paid:       { color: '#4ade80', bg: '#4ade8015', icon: CheckCircle },
  pending:    { color: '#c8922a', bg: '#c8922a15', icon: Clock },
  processing: { color: '#c8922a', bg: '#c8922a15', icon: Clock },
  shipped:    { color: '#60a5fa', bg: '#60a5fa15', icon: Truck },
  delivered:  { color: '#a3a3a3', bg: '#a3a3a315', icon: Package },
  cancelled:  { color: '#f87171', bg: '#f8717115', icon: XCircle },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      const data = await fetchAdminOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(id: string, newStatus: string) {
    try {
      await updateOrderStatus(id, newStatus);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus as OrderStatus } : o));
    } catch (err) {
      alert('Error updating status');
    }
  }

  const filtered = orders.filter(o =>
    (statusFilter === 'All' || o.status === statusFilter.toLowerCase()) &&
    (o.id.toLowerCase().includes(search.toLowerCase()) ||
     (o.profile?.full_name || '').toLowerCase().includes(search.toLowerCase()))
  );

  const selectedOrder = orders.find(o => o.id === selected);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#f0ead6', fontFamily: "'Playfair Display', serif" }}>Orders</h1>
          <p className="text-sm mt-1" style={{ color: '#4a4030' }}>{orders.length} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border p-4 flex flex-col md:flex-row gap-4" style={{ background: '#111', borderColor: '#1e1e1e' }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#4a4030' }} />
          <input
            type="text"
            placeholder="Search by order ID or customer name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg outline-none"
            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f0ead6' }}
          />
        </div>
      </div>

      <div className={`grid gap-6 ${selected ? 'grid-cols-1 xl:grid-cols-3' : 'grid-cols-1'}`}>
        {/* Table */}
        <div className={`rounded-xl border overflow-hidden ${selected ? 'xl:col-span-2' : ''}`} style={{ background: '#111', borderColor: '#1e1e1e' }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #1a1a1a', background: '#0f0f0f' }}>
                {['Order ID', 'Customer', 'Amount', 'Status', 'Date', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest" style={{ color: '#3a3020' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                     <Loader2 className="w-8 h-8 mx-auto animate-spin opacity-30" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16" style={{ color: '#3a3020' }}>
                    <p className="font-bold">No orders found</p>
                  </td>
                </tr>
              ) : filtered.map((order, i) => {
                const sc = statusConfig[order.status] || statusConfig.pending;
                const Icon = sc.icon;
                return (
                  <tr
                    key={order.id}
                    className="cursor-pointer transition-colors"
                    style={{
                      borderBottom: i < filtered.length - 1 ? '1px solid #141414' : 'none',
                      background: selected === order.id ? 'rgba(200,146,42,0.05)' : 'transparent',
                    }}
                    onClick={() => setSelected(selected === order.id ? null : order.id)}
                  >
                    <td className="px-4 py-3.5 text-xs font-mono font-bold" style={{ color: '#c8922a' }}>{order.id.slice(0, 8)}...</td>
                    <td className="px-4 py-3.5 text-sm font-medium" style={{ color: '#f0ead6' }}>{order.profile?.full_name || 'Guest'}</td>
                    <td className="px-4 py-3.5 text-sm font-mono font-bold" style={{ color: '#f0ead6' }}>₹{Number(order.total_amount_inr).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full w-fit uppercase" style={{ background: sc.bg, color: sc.color }}>
                        <Icon className="w-3 h-3" />{order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs" style={{ color: '#4a4030' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3.5 text-right">
                      <Eye className="w-4 h-4 ml-auto" style={{ color: '#3a3020' }} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Detail Panel */}
        {selectedOrder && (
          <div className="rounded-xl border overflow-hidden" style={{ background: '#111', borderColor: '#1e1e1e' }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#1a1a1a', background: '#0f0f0f' }}>
              <h3 className="font-bold text-sm uppercase tracking-widest" style={{ color: '#f0ead6' }}>Order Details</h3>
              <button onClick={() => setSelected(null)} style={{ color: '#4a4030' }}>✕</button>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#3a3020' }}>Order ID</p>
                <p className="font-mono font-black text-sm" style={{ color: '#c8922a' }}>{selectedOrder.id}</p>
                <p className="text-xs mt-1" style={{ color: '#4a4030' }}>{new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
              <hr style={{ borderColor: '#1e1e1e' }} />
              <div>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#3a3020' }}>Customer</p>
                <p className="font-bold" style={{ color: '#f0ead6' }}>{selectedOrder.profile?.full_name || 'Guest'}</p>
                <p className="text-sm" style={{ color: '#5a4a30' }}>{selectedOrder.profile?.email}</p>
                <p className="text-sm" style={{ color: '#5a4a30' }}>{selectedOrder.profile?.phone}</p>
              </div>
              <hr style={{ borderColor: '#1e1e1e' }} />
              <div>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#3a3020' }}>Update Status</p>
                <select
                  className="w-full px-3 py-2.5 text-sm rounded-lg outline-none"
                  defaultValue={selectedOrder.status}
                  onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                  style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f0ead6' }}
                >
                  {Object.keys(statusConfig).map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
