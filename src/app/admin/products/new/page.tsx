'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { 
  Save, X, Plus, Trash2, Upload, Image as ImageIcon, 
  Loader2, CheckCircle2, AlertCircle, Layers
} from 'lucide-react';

export default function NewProduct() {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price_inr: '',
    stock_count: '',
    is_active: true,
    category: 'Jeans',
    fit: 'Baggy',
    description: '',
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (images.length + files.length > 5) {
      alert('Maximum 5 images allowed per product.');
      return;
    }

    try {
      setUploading(true);
      const newImageUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        newImageUrls.push(publicUrl);
      }

      setImages(prev => [...prev, ...newImageUrls]);
    } catch (err: any) {
      console.error('Upload error:', err);
      alert('Error uploading images: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  async function handleSave() {
    if (!formData.name || !formData.sku || !formData.price_inr) {
      alert('Please fill in required fields (Name, SKU, Price)');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.from('products').insert([
        {
          ...formData,
          price_inr: parseFloat(formData.price_inr),
          stock_count: parseInt(formData.stock_count) || 0,
          image_url: images[0] || null, // First image is the main one
          images: images // All images for the gallery
        }
      ]);

      if (error) throw error;
      router.push('/admin/products');
    } catch (err: any) {
      console.error(err);
      alert('Error saving product: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-4xl font-black uppercase tracking-tight" style={{ color: '#f0ead6', fontFamily: "'Playfair Display', serif" }}>
             Create Product
           </h1>
           <p className="text-sm mt-1" style={{ color: '#4a4030' }}>Add a new piece to the Vista collection.</p>
        </div>
        <div className="flex gap-4">
           <button onClick={() => router.back()} className="px-8 py-3 text-xs font-black uppercase tracking-widest border border-[#1e1e1e] hover:bg-white/[0.03] transition-colors rounded">
             Discard
           </button>
           <button 
             onClick={handleSave} 
             disabled={loading || uploading}
             className="px-10 py-3 text-xs font-black uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2" 
             style={{ background: 'linear-gradient(135deg, #f5d97a, #c8922a)', color: '#0d0d0d', borderRadius: '4px' }}
           >
             {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
             {loading ? 'Publishing...' : 'Publish Drop'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
           <div className="rounded-xl border p-8 space-y-6" style={{ background: '#111', borderColor: '#1e1e1e' }}>
              <h3 className="text-sm font-black uppercase tracking-widest text-[#c8922a] border-b border-[#1e1e1e] pb-4">Essential Details</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest block mb-2 text-[#4a4030]">Product Title *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Vintage Wash Baggy Denim"
                    className="w-full px-4 py-3.5 rounded bg-[#0a0a0a] border border-[#1e1e1e] text-[#f0ead6] outline-none focus:border-[#c8922a] transition-colors"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest block mb-2 text-[#4a4030]">Brand Narrative / Description</label>
                  <textarea 
                    rows={6}
                    placeholder="Describe the craftsmanship, fit, and soul of this piece..."
                    className="w-full px-4 py-3.5 rounded bg-[#0a0a0a] border border-[#1e1e1e] text-[#f0ead6] outline-none focus:border-[#c8922a] transition-colors resize-none"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
           </div>

           {/* Media Gallery Section */}
           <div className="rounded-xl border p-8 space-y-6" style={{ background: '#111', borderColor: '#1e1e1e' }}>
              <div className="flex items-center justify-between border-b border-[#1e1e1e] pb-4">
                 <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#c8922a]" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#c8922a]">Product Gallery</h3>
                 </div>
                 <p className="text-[10px] font-black text-[#4a4030] uppercase">{images.length} / 5 Slots Used</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                 {images.map((url, i) => (
                    <div key={url} className="relative aspect-square rounded-xl overflow-hidden border border-[#1e1e1e] group">
                       <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            onClick={() => removeImage(i)}
                            className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                          >
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                       {i === 0 && (
                          <div className="absolute top-2 left-2 px-2 py-1 bg-[#c8922a] text-[#0d0d0d] text-[8px] font-black uppercase rounded">
                             Main Cover
                          </div>
                       )}
                    </div>
                 ))}
                 
                 {images.length < 5 && (
                    <div 
                      onClick={() => !uploading && fileInputRef.current?.click()}
                      className="aspect-square border-2 border-dashed border-[#1e1e1e] rounded-xl flex flex-col items-center justify-center gap-3 text-[#3a3020] hover:border-[#c8922a30] transition-colors cursor-pointer group bg-[#0a0a0a]"
                    >
                       <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center group-hover:scale-110 transition-transform">
                          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                       </div>
                       <p className="text-[9px] font-black uppercase tracking-widest">
                          {uploading ? 'Processing' : 'Add View'}
                       </p>
                    </div>
                 )}
              </div>

              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden" 
                accept="image/*"
                multiple
              />
           </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
           <div className="rounded-xl border p-8 space-y-6" style={{ background: '#111', borderColor: '#1e1e1e' }}>
              <h3 className="text-sm font-black uppercase tracking-widest text-[#c8922a] border-b border-[#1e1e1e] pb-4">Classification</h3>
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black uppercase tracking-widest block mb-2 text-[#4a4030]">Collection / Category</label>
                    <select 
                      className="w-full px-4 py-3.5 rounded bg-[#0a0a0a] border border-[#1e1e1e] text-[#f0ead6] outline-none"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                       <option value="Jeans">Jeans</option>
                       <option value="Cargo">Cargo</option>
                       <option value="Denim Jackets">Denim Jackets</option>
                       <option value="Limited Drop">Limited Drop</option>
                    </select>
                 </div>
                 <div>
                    <label className="text-[10px] font-black uppercase tracking-widest block mb-2 text-[#4a4030]">Silhouette / Fit</label>
                    <select 
                      className="w-full px-4 py-3.5 rounded bg-[#0a0a0a] border border-[#1e1e1e] text-[#f0ead6] outline-none"
                      value={formData.fit}
                      onChange={e => setFormData({...formData, fit: e.target.value})}
                    >
                       <option value="Baggy">Baggy Fit</option>
                       <option value="Straight">Straight Cut</option>
                       <option value="Slim">Slim Tapered</option>
                       <option value="Wide">Wide Leg</option>
                    </select>
                 </div>
                 <div className="flex items-center gap-3 p-4 bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg">
                    <input 
                      type="checkbox" 
                      id="isActive"
                      checked={formData.is_active} 
                      onChange={e => setFormData({...formData, is_active: e.target.checked})}
                      className="accent-yellow-600 w-4 h-4 cursor-pointer" 
                    />
                    <label htmlFor="isActive" className="text-xs font-black uppercase tracking-widest cursor-pointer text-[#f0ead6]">Live in Catalogue</label>
                 </div>
              </div>
           </div>

           <div className="rounded-xl border p-8 space-y-6" style={{ background: '#111', borderColor: '#1e1e1e' }}>
              <h3 className="text-sm font-black uppercase tracking-widest text-[#c8922a] border-b border-[#1e1e1e] pb-4">Inventory Control</h3>
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black uppercase tracking-widest block mb-2 text-[#4a4030]">SKU Code *</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3.5 rounded bg-[#0a0a0a] border border-[#1e1e1e] text-[#f0ead6] font-mono outline-none focus:border-[#c8922a]"
                      value={formData.sku}
                      onChange={e => setFormData({...formData, sku: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black uppercase tracking-widest block mb-2 text-[#4a4030]">Retail Price (INR) *</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-3.5 rounded bg-[#0a0a0a] border border-[#1e1e1e] text-[#f0ead6] font-mono outline-none focus:border-[#c8922a]"
                      value={formData.price_inr}
                      onChange={e => setFormData({...formData, price_inr: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black uppercase tracking-widest block mb-2 text-[#4a4030]">Initial Stock</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-3.5 rounded bg-[#0a0a0a] border border-[#1e1e1e] text-[#f0ead6] font-mono outline-none focus:border-[#c8922a]"
                      value={formData.stock_count}
                      onChange={e => setFormData({...formData, stock_count: e.target.value})}
                    />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
