import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="flex flex-col" style={{ background: '#0d0d0d' }}>
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1800&q=80" 
            className="w-full h-full object-cover opacity-40"
            alt="The Vista Atelier"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d] via-transparent to-[#0d0d0d]" />
        </div>
        
        <div className="relative z-10 text-center space-y-6 max-w-4xl px-6">
           <p className="text-[10px] font-black uppercase tracking-[0.6em] text-[#c8922a]">Founded 2024</p>
           <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none" style={{ color: '#f0ead6', fontFamily: "'Playfair Display', serif" }}>
             The Vista<br />Story.
           </h1>
           <div className="h-20 w-px bg-gradient-to-b from-[#c8922a] to-transparent mx-auto" />
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-32 px-6 container mx-auto">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
               <h2 className="text-4xl font-black uppercase tracking-tight" style={{ color: '#f0ead6', fontFamily: "'Playfair Display', serif" }}>
                  Defying the Ordinary.
               </h2>
               <div className="space-y-6 text-[#a09070] text-lg leading-relaxed">
                  <p>
                    Variety Vista was born from a singular obsession: to create the perfect denim silhouette for the modern Indian landscape. We believe that jeans are not just an article of clothing—they are an architectural statement.
                  </p>
                  <p>
                    Our journey began in the vibrant streets of Antop Hill, Mumbai, where we spent months deconstructing vintage fits and reconstructing them with premium, ethically sourced cotton. The result? A collection that bridges the gap between heritage denim and contemporary streetwear.
                  </p>
               </div>
               <div className="flex gap-12 pt-8 border-t border-[#1e1e1e]">
                  <div>
                     <p className="text-2xl font-black text-[#c8922a]">100%</p>
                     <p className="text-[9px] font-black uppercase tracking-widest text-[#3a3020]">Indian Craftsmanship</p>
                  </div>
                  <div>
                     <p className="text-2xl font-black text-[#c8922a]">Premium</p>
                     <p className="text-[9px] font-black uppercase tracking-widest text-[#3a3020]">Heavyweight Cotton</p>
                  </div>
               </div>
            </div>
            <div className="relative aspect-square">
               <div className="absolute inset-4 border border-[#c8922a30] z-10" />
               <img 
                 src="https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800" 
                 className="w-full h-full object-cover" 
                 alt="Craftsmanship"
               />
            </div>
         </div>
      </section>

      {/* Craftsmanship Banner */}
      <section className="py-40 bg-[#0a0a0a] border-y border-[#1e1e1e] text-center px-6">
         <div className="max-w-3xl mx-auto space-y-12">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic" style={{ color: '#f0ead6', fontFamily: "'Playfair Display', serif" }}>
               "Denim is the canvas of the streets."
            </h2>
            <div className="h-px w-24 bg-[#c8922a] mx-auto" />
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#6a5a40]">
               The Vista Manifesto — 2025
            </p>
         </div>
      </section>

      {/* CTA */}
      <section className="py-32 text-center space-y-8">
         <h3 className="text-2xl font-black uppercase tracking-widest" style={{ color: '#f0ead6' }}>Experience the Vision</h3>
         <Link href="/shop" className="inline-block px-12 py-5 bg-[#c8922a] text-[#0d0d0d] font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-transform">
            Shop Collection
         </Link>
      </section>

    </div>
  );
}
