import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';
import { createClient } from '@/utils/supabase/server';
import { PageTransition, FadeIn } from '@/components/common/Animations';

export default async function Home() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .limit(8);

  const trendingProducts = products || [];

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen" style={{ background: '#0d0d0d' }}>

      {/* ── HERO SECTION ── */}
      <section className="relative w-full min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1800&q=90&auto=format&fit=crop"
            alt="Variety Vista Hero"
            className="w-full h-full object-cover object-center opacity-70"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(100deg, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.7) 45%, rgba(13,13,13,0.1) 100%)',
            }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-6 md:px-16 flex flex-col gap-8">
          <p className="text-[10px] font-black tracking-[0.5em] uppercase text-[#c8922a]">
            Exclusive Drop — 2025
          </p>
          <h1
            className="text-6xl sm:text-7xl md:text-9xl font-black uppercase leading-[0.85] tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif", color: '#f0ead6' }}
          >
            Wear The<br />
            <span
              style={{
                background: 'linear-gradient(135deg, #f5d97a 0%, #c8922a 60%, #8B6010 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Vista.
            </span>
          </h1>
          <p className="text-base md:text-lg max-w-lg text-[#a09070] leading-relaxed">
            Unrivalled craftsmanship for those who lead. Precision-cut denim tailored for the streets of India.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <Link href="/shop" className="px-10 py-4 bg-[#c8922a] text-[#0d0d0d] font-black uppercase tracking-widest text-xs transition-transform hover:scale-105">
              Explore Collection
            </Link>
            <Link href="/shop" className="px-10 py-4 border border-[#c8922a] text-[#c8922a] font-black uppercase tracking-widest text-xs transition-transform hover:scale-105">
              Seasonal Edit
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRENDING PRODUCTS ── */}
      <section className="py-32 px-6 container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <p className="text-[10px] font-black tracking-[0.4em] uppercase mb-3 text-[#c8922a]">
              The Edit
            </p>
            <h2
              className="text-4xl md:text-5xl font-black uppercase tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif", color: '#f0ead6' }}
            >
              Trending Now
            </h2>
          </div>
          <Link href="/shop" className="text-xs font-black uppercase tracking-[0.2em] border-b border-[#c8922a] pb-1 text-[#c8922a]">
            View Full Catalogue →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {trendingProducts.length > 0 ? (
            trendingProducts.map((product, i) => (
              <FadeIn key={product.id} delay={i * 0.1}>
                <ProductCard product={product} />
              </FadeIn>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-[#3a3020] uppercase font-bold tracking-widest">
              Catalog updating...
            </div>
          )}
        </div>
      </section>

      {/* ── FULL WIDTH BANNER ── */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
         <img 
           src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=1800&q=80" 
           alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" 
         />
         <div className="relative z-10 text-center px-6">
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-[#f0ead6] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Beyond Denim
            </h2>
            <p className="text-[#a09070] text-sm md:text-base uppercase tracking-[0.3em] font-bold">
              Elevating the everyday to extraordinary.
            </p>
         </div>
      </section>

      {/* ── CATEGORY STRIP ── */}
      <div className="py-6 border-y border-[#1e1e1e]" style={{ background: '#0a0a0a' }}>
        <div className="container mx-auto px-6 overflow-x-auto no-scrollbar">
           <div className="flex justify-between items-center min-w-[800px] gap-8">
             {['Baggy Fit', 'Straight Cut', 'Cargo Denim', 'Utility Wear', 'Vintage Wash', 'Limited Drop'].map(cat => (
               <span key={cat} className="text-[10px] font-black uppercase tracking-[0.3em] text-[#3a3020] hover:text-[#c8922a] transition-colors cursor-pointer whitespace-nowrap">
                 {cat}
               </span>
             ))}
           </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
}
