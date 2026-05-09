'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, Package, ChevronDown, Edit2, Trash2, Eye, ArrowUpDown, Loader2 } from 'lucide-react';
import { fetchAdminProducts, deleteProduct } from '@/lib/admin-actions';
import { Product } from '@/lib/db-schema';

const statusStyle: Record<string, { bg: string; color: string }> = {
  Active:   { bg: '#4ade8015', color: '#4ade80' },
  Draft:    { bg: '#a3a3a315', color: '#a3a3a3' },
  Archived: { bg: '#f8717115', color: '#f87171' },
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await fetchAdminProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Error deleting product');
    }
  };

  const filtered = products.filter(p => {
    const matchesStatus = statusFilter === 'All' || 
      (statusFilter === 'Active' && p.is_active) || 
      (statusFilter === 'Draft' && !p.is_active);
    
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.sku.toLowerCase().includes(search.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const toggleSelect = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map(p => p.id));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#f0ead6', fontFamily: "'Playfair Display', serif" }}>
            Products
          </h1>
          <p className="text-sm mt-1" style={{ color: '#4a4030' }}>{products.length} products in your catalogue</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold uppercase tracking-widest transition-opacity hover:opacity-85"
          style={{ background: 'linear-gradient(135deg, #f5d97a, #c8922a)', color: '#0d0d0d', borderRadius: '4px' }}
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Filters + Search Bar */}
      <div
        className="rounded-xl border p-4 flex flex-col md:flex-row gap-4 items-start md:items-center"
        style={{ background: '#111', borderColor: '#1e1e1e' }}
      >
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#4a4030' }} />
          <input
            type="text"
            placeholder="Search products, SKU…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg outline-none"
            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f0ead6' }}
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 flex-wrap">
          {['All', 'Active', 'Draft'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all"
              style={{
                background: statusFilter === s ? 'rgba(200,146,42,0.15)' : 'transparent',
                color: statusFilter === s ? '#c8922a' : '#4a4030',
                border: statusFilter === s ? '1px solid rgba(200,146,42,0.3)' : '1px solid #2a2a2a',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: '#111', borderColor: '#1e1e1e' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid #1a1a1a', background: '#0f0f0f' }}>
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={selected.length === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                  className="accent-yellow-600 w-4 h-4 cursor-pointer"
                />
              </th>
              {['Product', 'SKU', 'Price', 'Stock', 'Status', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest" style={{ color: '#3a3020' }}>
                  <span className="flex items-center gap-1">
                    {h}
                    {['Product', 'Price', 'Stock'].includes(h) && <ArrowUpDown className="w-3 h-3 opacity-50" />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-16" style={{ color: '#3a3020' }}>
                  <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin opacity-30" />
                  <p className="font-bold">Loading products...</p>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16" style={{ color: '#3a3020' }}>
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-bold">No products found</p>
                </td>
              </tr>
            ) : filtered.map((product, i) => (
              <tr
                key={product.id}
                className="transition-colors"
                style={{
                  borderBottom: i < filtered.length - 1 ? '1px solid #141414' : 'none',
                  background: selected.includes(product.id) ? 'rgba(200,146,42,0.05)' : 'transparent',
                }}
              >
                <td className="px-4 py-3.5">
                  <input
                    type="checkbox"
                    checked={selected.includes(product.id)}
                    onChange={() => toggleSelect(product.id)}
                    className="accent-yellow-600 w-4 h-4 cursor-pointer"
                  />
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center"
                      style={{ background: '#1a1a1a' }}
                    >
                      {product.image_url ? (
                         <img src={product.image_url} alt="" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Package className="w-5 h-5" style={{ color: '#3a3020' }} />
                      )}
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#f0ead6' }}>{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-xs font-mono" style={{ color: '#5a4a30' }}>{product.sku}</td>
                <td className="px-4 py-3.5 text-sm font-mono font-bold" style={{ color: '#f0ead6' }}>
                  ₹{Number(product.price_inr).toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3.5 text-sm font-bold" style={{ color: product.stock_count === 0 ? '#f87171' : product.stock_count < 15 ? '#fb923c' : '#4ade80' }}>
                  {product.stock_count === 0 ? 'Out of Stock' : `${product.stock_count} units`}
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
                    style={statusStyle[product.is_active ? 'Active' : 'Draft']}
                  >
                    {product.is_active ? 'Active' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1 justify-end">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="p-1.5 rounded hover:opacity-70 transition-opacity"
                      style={{ color: '#c8922a' }}
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-1.5 rounded hover:opacity-70 transition-opacity"
                      style={{ color: '#f87171' }}
                      title="Delete"
                    >
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
  );
}
