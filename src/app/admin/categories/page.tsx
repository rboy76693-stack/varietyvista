'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check, Tag } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  status: 'Active' | 'Hidden';
}

const initialCategories: Category[] = [
  { id: '1', name: 'Jeans',       slug: 'jeans',       description: 'All denim jeans styles — baggy, straight, flared and more.',   productCount: 34, status: 'Active' },
  { id: '2', name: 'Tops',        slug: 'tops',         description: 'T-shirts, shirts, and oversized tops.',                         productCount: 12, status: 'Active' },
  { id: '3', name: 'Jackets',     slug: 'jackets',      description: 'Denim jackets, bombers, and outerwear.',                        productCount:  7, status: 'Active' },
  { id: '4', name: 'Shorts',      slug: 'shorts',       description: 'Denim and cargo shorts.',                                       productCount:  5, status: 'Hidden' },
  { id: '5', name: 'Accessories', slug: 'accessories',  description: 'Belts, hats, bags and other accessories.',                      productCount:  3, status: 'Hidden' },
  { id: '6', name: 'Footwear',    slug: 'footwear',     description: 'Sneakers, boots and more.',                                     productCount:  0, status: 'Hidden' },
];

const emptyForm = { name: '', slug: '', description: '', status: 'Active' as 'Active' | 'Hidden' };

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const slugify = (val: string) =>
    val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleNameChange = (name: string) => {
    setForm({ ...form, name, slug: slugify(name) });
  };

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };

  const openEdit = (cat: Category) => {
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, status: cat.status });
    setEditId(cat.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editId) {
      setCategories(categories.map(c => c.id === editId ? { ...c, ...form } : c));
    } else {
      setCategories([...categories, {
        id: String(Date.now()),
        ...form,
        productCount: 0,
      }]);
    }
    setShowForm(false);
    setEditId(null);
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    setDeleteId(null);
  };

  const toggleStatus = (id: string) => {
    setCategories(categories.map(c =>
      c.id === id ? { ...c, status: c.status === 'Active' ? 'Hidden' : 'Active' } : c
    ));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#f0ead6', fontFamily: "'Playfair Display', serif" }}>
            Categories
          </h1>
          <p className="text-sm mt-1" style={{ color: '#4a4030' }}>
            Organise your products into categories. Add new ones as you expand your range.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg transition-opacity hover:opacity-85"
          style={{ background: 'linear-gradient(135deg, #f5d97a, #c8922a)', color: '#0d0d0d' }}
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="rounded-xl border overflow-hidden" style={{ background: '#111', borderColor: '#c8922a40' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#1a1a1a', background: '#0f0f0f' }}>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" style={{ color: '#c8922a' }} />
              <h3 className="font-bold uppercase tracking-widest text-sm" style={{ color: '#f0ead6' }}>
                {editId ? 'Edit Category' : 'New Category'}
              </h3>
            </div>
            <button onClick={() => setShowForm(false)} style={{ color: '#4a4030' }}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6a5a40' }}>Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="e.g. Jackets"
                className="px-3 py-2.5 text-sm rounded-lg outline-none"
                style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f0ead6' }}
              />
            </div>
            {/* Slug */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6a5a40' }}>URL Slug</label>
              <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid #2a2a2a' }}>
                <span className="px-3 py-2.5 text-xs border-r flex-shrink-0" style={{ background: '#0d0d0d', borderColor: '#2a2a2a', color: '#3a3020' }}>
                  /category/
                </span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={e => setForm({ ...form, slug: slugify(e.target.value) })}
                  className="flex-1 px-3 py-2.5 text-sm outline-none"
                  style={{ background: '#1a1a1a', color: '#f0ead6' }}
                />
              </div>
            </div>
            {/* Description */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6a5a40' }}>Description</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Short description of this category…"
                className="px-3 py-2.5 text-sm rounded-lg outline-none resize-none"
                style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f0ead6' }}
              />
            </div>
            {/* Status */}
            <div className="flex items-center gap-4 sm:col-span-2">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6a5a40' }}>Status</span>
              {(['Active', 'Hidden'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setForm({ ...form, status: s })}
                  className="px-4 py-2 text-xs font-bold rounded-lg"
                  style={{
                    background: form.status === s ? 'rgba(200,146,42,0.15)' : '#1a1a1a',
                    color: form.status === s ? '#c8922a' : '#4a4030',
                    border: form.status === s ? '1px solid rgba(200,146,42,0.4)' : '1px solid #2a2a2a',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="px-5 pb-5 flex gap-3 justify-end">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm font-bold rounded-lg border"
              style={{ borderColor: '#2a2a2a', color: '#6a5a40' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-lg"
              style={{ background: 'linear-gradient(135deg, #f5d97a, #c8922a)', color: '#0d0d0d' }}
            >
              <Check className="w-4 h-4" />
              {editId ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="rounded-xl border p-5 flex items-center justify-between gap-4" style={{ background: '#1a0a0a', borderColor: '#f8717130' }}>
          <p className="text-sm font-medium" style={{ color: '#f87171' }}>
            Delete &quot;{categories.find(c => c.id === deleteId)?.name}&quot;? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteId(null)}
              className="px-4 py-2 text-sm font-bold border rounded-lg"
              style={{ borderColor: '#2a2a2a', color: '#6a5a40' }}
            >Cancel</button>
            <button
              onClick={() => handleDelete(deleteId)}
              className="px-4 py-2 text-sm font-bold rounded-lg"
              style={{ background: '#f87171', color: '#0d0d0d' }}
            >Delete</button>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: '#111', borderColor: '#1e1e1e' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid #1a1a1a', background: '#0f0f0f' }}>
              {['Category', 'Slug', 'Products', 'Status', ''].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest" style={{ color: '#3a3020' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, i) => (
              <tr
                key={cat.id}
                style={{ borderBottom: i < categories.length - 1 ? '1px solid #141414' : 'none' }}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(200,146,42,0.12)' }}
                    >
                      <Tag className="w-4 h-4" style={{ color: '#c8922a' }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: '#f0ead6' }}>{cat.name}</p>
                      <p className="text-xs mt-0.5 max-w-xs truncate" style={{ color: '#4a4030' }}>{cat.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-xs font-mono" style={{ color: '#5a4a30' }}>
                  /category/{cat.slug}
                </td>
                <td className="px-5 py-4">
                  <span
                    className="px-2.5 py-1 text-xs font-bold rounded-full"
                    style={{ background: '#1e1e1e', color: '#6a5a40' }}
                  >
                    {cat.productCount} products
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => toggleStatus(cat.id)}
                    className="px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide transition-all"
                    style={{
                      background: cat.status === 'Active' ? '#4ade8015' : '#a3a3a315',
                      color: cat.status === 'Active' ? '#4ade80' : '#a3a3a3',
                    }}
                  >
                    {cat.status}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => openEdit(cat)}
                      className="p-1.5 rounded hover:opacity-70 transition-opacity"
                      style={{ color: '#c8922a' }}
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(cat.id)}
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

      {/* Info Banner */}
      <div
        className="rounded-xl border p-4 flex items-start gap-3"
        style={{ background: 'rgba(200,146,42,0.05)', borderColor: 'rgba(200,146,42,0.15)' }}
      >
        <Tag className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#c8922a' }} />
        <div>
          <p className="text-sm font-bold" style={{ color: '#c8922a' }}>Expanding beyond Jeans?</p>
          <p className="text-xs mt-1" style={{ color: '#5a4a30' }}>
            Create a new category first, then add products to it. Hidden categories won't appear in navigation until you activate them — perfect for preparing a new launch.
          </p>
        </div>
      </div>
    </div>
  );
}
