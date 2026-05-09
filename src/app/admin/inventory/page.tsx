'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { 
  Save, RefreshCw, Search, AlertTriangle, 
  CheckCircle2, Loader2, Package, IndianRupee,
  ArrowUpDown, Filter
} from 'lucide-react';
import { Product } from '@/lib/db-schema';

export default function BulkInventory() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [editedProducts, setEditedProducts] = useState<Record<string, Partial<Product>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (id: string, field: keyof Product, value: any) => {
    setEditedProducts(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const saveAll = async () => {
    const updates = Object.entries(editedProducts).map(([id, changes]) => ({
      id,
      ...changes
    }));

    if (updates.length === 0) return;

    try {
      setSaving(true);
      setMessage(null);
      
      // Bulk update using upsert with the IDs
      const { error } = await supabase
        .from('products')
        .upsert(updates);

      if (error) throw error;

      setMessage({ type: 'success', text: `Successfully updated ${updates.length} products.` });
      setEditedProducts({});
      await loadProducts();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const hasChanges = Object.keys(editedProducts).length > 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#c8922a]" />
        <p className="text-[10px] font-black uppercase tracking-widest text-[#3a3020]">Syncing Master Stock List...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#f0ead6', fontFamily: "'Playfair Display', serif" }}>
            Bulk Inventory
          </h1>
          <p className="text-sm mt-1" style={{ color: '#4a4030' }}>Direct access to price and stock control.</p>
        </div>
        <div className="flex gap-4">
           {hasChanges && (
             <button 
               onClick={() => setEditedProducts({})}
               className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-colors rounded border border-red-500/20"
             >
               Discard Changes
             </button>
           )}
           <button 
             onClick={saveAll}
             disabled={!hasChanges || saving}
             className="px-10 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30 flex items-center gap-2"
             style={{ background: hasChanges ? 'linear-gradient(135deg, #f5d97a, #c8922a)' : '#1a1a1a', color: hasChanges ? '#0d0d0d' : '#4a4030', borderRadius: '4px' }}
           >
             {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
             Save {Object.keys(editedProducts).length || ''} Changes
           </button>
        </div>
      </div>

      {/* Feedback Bar */}
      {message && (
        <div className={`p-4 rounded-lg border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span className="text-xs font-bold uppercase tracking-widest">{message.text}</span>
        </div>
      )}

      {/* Search & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="md:col-span-3 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3a3020]" />
            <input 
              type="text" 
              placeholder="Filter by SKU or Name..."
              className="w-full pl-12 pr-4 py-3 bg-[#111] border border-[#1e1e1e] rounded-xl text-sm outline-none focus:border-[#c8922a] transition-colors"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
         </div>
         <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-3 flex items-center justify-center gap-4">
            <div className="text-center border-r border-[#1e1e1e] pr-4">
               <p className="text-xs font-black text-[#c8922a]">{products.length}</p>
               <p className="text-[8px] uppercase tracking-widest text-[#3a3020]">Total SKUs</p>
            </div>
            <div className="text-center">
               <p className="text-xs font-black text-red-500">{products.filter(p => p.stock_count === 0).length}</p>
               <p className="text-[8px] uppercase tracking-widest text-[#3a3020]">Out of Stock</p>
            </div>
         </div>
      </div>

      {/* Grid */}
      <div className="rounded-xl border overflow-hidden" style={{ background: '#0a0a0a', borderColor: '#1e1e1e' }}>
         <div className="overflow-x-auto">
            <table className="w-full border-collapse">
               <thead>
                  <tr style={{ background: '#0f0f0f', borderBottom: '1px solid #1e1e1e' }}>
                     <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[#3a3020]">Product Description</th>
                     <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[#3a3020]">SKU Identity</th>
                     <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[#3a3020] w-48">Retail Price (₹)</th>
                     <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[#3a3020] w-40">Current Stock</th>
                     <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[#3a3020] w-32">Status</th>
                  </tr>
               </thead>
               <tbody>
                  {filtered.map((product, i) => {
                     const isEdited = !!editedProducts[product.id];
                     const currentStock = editedProducts[product.id]?.stock_count ?? product.stock_count;
                     const currentPrice = editedProducts[product.id]?.price_inr ?? product.price_inr;

                     return (
                        <tr key={product.id} className={`transition-colors border-b border-[#141414] hover:bg-white/[0.01] ${isEdited ? 'bg-[#c8922a08]' : ''}`}>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-[#111] rounded border border-[#1e1e1e] overflow-hidden flex-shrink-0">
                                    {product.image_url && <img src={product.image_url} className="w-full h-full object-cover" alt="" />}
                                 </div>
                                 <div>
                                    <p className="text-xs font-bold text-[#f0ead6]">{product.name}</p>
                                    <p className="text-[10px] text-[#4a4030] uppercase mt-0.5">{product.category}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-[10px] font-mono font-bold text-[#5a4a30]">
                              {product.sku}
                           </td>
                           <td className="px-6 py-4">
                              <div className="relative flex items-center">
                                 <IndianRupee className="absolute left-3 w-3 h-3 text-[#3a3020]" />
                                 <input 
                                   type="number" 
                                   className={`w-full pl-8 pr-3 py-2 rounded bg-transparent border transition-all text-xs font-mono font-bold outline-none ${isEdited && editedProducts[product.id]?.price_inr !== undefined ? 'border-[#c8922a] text-[#c8922a]' : 'border-transparent text-[#f0ead6] focus:border-[#1e1e1e]'}`}
                                   value={currentPrice}
                                   onChange={e => handleEdit(product.id, 'price_inr', parseFloat(e.target.value))}
                                 />
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <div className="relative flex items-center">
                                 <Package className="absolute left-3 w-3 h-3 text-[#3a3020]" />
                                 <input 
                                   type="number" 
                                   className={`w-full pl-8 pr-3 py-2 rounded bg-transparent border transition-all text-xs font-mono font-bold outline-none ${isEdited && editedProducts[product.id]?.stock_count !== undefined ? 'border-[#c8922a] text-[#c8922a]' : 'border-transparent text-[#f0ead6] focus:border-[#1e1e1e]'}`}
                                   value={currentStock}
                                   onChange={e => handleEdit(product.id, 'stock_count', parseInt(e.target.value))}
                                 />
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${currentStock === 0 ? 'bg-red-500/10 text-red-500' : currentStock < 10 ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-500'}`}>
                                 {currentStock === 0 ? 'Out of Stock' : currentStock < 10 ? 'Low Stock' : 'Stable'}
                              </span>
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
