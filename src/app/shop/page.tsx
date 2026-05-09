import { ProductCard } from '@/components/product/ProductCard';
import { createClient } from '@/utils/supabase/server';
import { SlidersHorizontal, Search } from 'lucide-react';
import { PageTransition, FadeIn } from '@/components/common/Animations';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const category = params.category as string;
  const fit = params.fit as string;
  const filter = params.filter as string;

  const supabase = await createClient();
  let query = supabase.from('products').select('*').eq('is_active', true);

  if (category) {
    // Assuming categories are tags or we can add a category column
    // For now filtering by name or just fetching all
  }

  const { data: products } = await query.order('created_at', { ascending: false });
  const allProducts = products || [];

  return (
    <PageTransition>
      <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-20">
      
      {/* Page Header */}
      <div className="mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-[10px] font-black tracking-[0.5em] uppercase text-[#c8922a] mb-3">
              The Collection
            </p>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight" style={{ color: '#f0ead6', fontFamily: "'Playfair Display', serif" }}>
              Shop All
            </h1>
            <p className="text-sm font-bold uppercase tracking-widest text-[#4a4030] mt-2">
              {allProducts.length} Exceptional Pieces
            </p>
          </div>

          <div className="flex gap-3">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3a3020]" />
                <input 
                  type="text" 
                  placeholder="Search catalogue..." 
                  className="pl-12 pr-6 py-4 bg-[#0d0d0d] border border-[#1e1e1e] text-xs font-bold uppercase tracking-widest text-[#f0ead6] outline-none focus:border-[#c8922a] w-full md:w-64"
                />
             </div>
             <button className="px-6 py-4 border border-[#1e1e1e] flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[#f0ead6] hover:border-[#c8922a] transition-colors">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
             </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filter (Luxury Desktop) */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-12">
           <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#f0ead6] mb-6 border-b border-[#1e1e1e] pb-4">
                Refine by Category
              </h3>
              <ul className="space-y-4">
                 {['Baggy Fits', 'Straight Cut', 'Cargo Denim', 'Utility Wear', 'New Arrivals'].map(cat => (
                   <li key={cat} className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5a4a30] hover:text-[#c8922a] cursor-pointer transition-colors flex justify-between items-center group">
                      {cat}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                   </li>
                 ))}
              </ul>
           </div>

           <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#f0ead6] mb-6 border-b border-[#1e1e1e] pb-4">
                Select Size
              </h3>
              <div className="grid grid-cols-3 gap-2">
                 {['S', 'M', 'L', 'XL', '30', '32', '34'].map(size => (
                   <button key={size} className="py-3 border border-[#1e1e1e] text-[10px] font-black text-[#5a4a30] hover:border-[#c8922a] hover:text-[#c8922a] transition-all">
                      {size}
                   </button>
                 ))}
              </div>
           </div>

           <div className="p-6 bg-[#c8922a10] border border-[#c8922a30] rounded-sm">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#c8922a] mb-2">Exclusive Offer</p>
              <p className="text-xs font-bold text-[#f0ead6] leading-relaxed">
                Free Express Delivery on all orders above ₹999.
              </p>
           </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
              {allProducts.length > 0 ? (
                allProducts.map((product, i) => (
                  <FadeIn key={product.id} delay={i * 0.05}>
                    <ProductCard product={product} />
                  </FadeIn>
                ))
              ) : (
                <div className="col-span-full py-40 text-center">
                   <p className="text-xs font-black uppercase tracking-[0.3em] text-[#3a3020]">
                     No products match your criteria.
                   </p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
}
