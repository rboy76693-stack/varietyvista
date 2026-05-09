'use client';

import { useState } from 'react';
import { Product } from '@/lib/db-schema';
import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';
import { Minus, Plus, Heart, Ruler, ChevronDown, ChevronUp, ShieldCheck, Truck, RotateCcw, Check, ShoppingBag, MessageCircle } from 'lucide-react';
import { ReviewSystem } from '@/components/product/ReviewSystem';
import { SizeGuide } from '@/components/product/SizeGuide';

export default function ProductDetails({ product }: { product: Product }) {
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const gallery = product.images && product.images.length > 0 ? product.images : [product.image_url || ''];
  
  const [activeImage, setActiveImage] = useState(gallery[0]);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>('description');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  
  const { addItem, setCartOpen } = useCartStore();

  const handleAddToCart = () => {
    addItem({
      product,
      quantity,
      selectedSize,
      selectedColor: 'Default'
    });
    setCartOpen(true);
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-20">
      <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
        
        {/* Left: Premium Image Gallery */}
        <div className="w-full lg:w-[60%] space-y-6">
          {/* Main Stage */}
          <div className="relative aspect-[3/4] bg-[#0d0d0d] rounded-sm overflow-hidden border border-[#1e1e1e] group">
            {activeImage ? (
              <Image 
                src={activeImage} 
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-5">
                <ShoppingBag className="w-32 h-32" />
              </div>
            )}
            <div className="absolute bottom-6 left-6 flex items-center gap-2">
               <span className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded text-[10px] font-black uppercase text-[#c8922a]">
                  Studio Shot
               </span>
            </div>
          </div>

          {/* Thumbnails */}
          {gallery.length > 1 && (
            <div className="grid grid-cols-5 gap-4">
              {gallery.map((url, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImage(url)}
                  className={`relative aspect-[3/4] rounded-sm overflow-hidden border transition-all ${activeImage === url ? 'border-[#c8922a] opacity-100' : 'border-[#1e1e1e] opacity-40 hover:opacity-70'}`}
                >
                  <Image src={url} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="w-full lg:w-[40%]">
          <div className="sticky top-40 space-y-10">
            
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] px-2 py-1 bg-[#c8922a] text-[#0d0d0d]">
                  Exclusive Edit
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5a4a30]">
                  SKU: {product.sku}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-[0.9]" style={{ color: '#f0ead6', fontFamily: "'Playfair Display', serif" }}>
                {product.name}
              </h1>
              <div className="flex items-baseline gap-4">
                <p className="text-3xl font-black" style={{ color: '#c8922a' }}>
                  ₹{Number(product.price_inr).toLocaleString('en-IN')}
                </p>
                <span className="text-xs font-bold uppercase tracking-widest text-[#3a3020]">
                  Inclusive of all taxes
                </span>
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: '#6a5a40' }}>
                  Select Size: <span className="text-[#f0ead6] ml-2">{selectedSize}</span>
                </span>
                <button 
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-[10px] font-black uppercase tracking-widest border-b border-[#c8922a] pb-0.5 flex items-center gap-2" 
                  style={{ color: '#c8922a' }}
                >
                  <Ruler className="w-3 h-3" /> Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="w-14 h-14 flex items-center justify-center text-xs font-black border transition-all"
                    style={{ 
                      background: selectedSize === size ? 'rgba(200,146,42,0.1)' : 'transparent',
                      color: selectedSize === size ? '#c8922a' : '#5a4a30',
                      borderColor: selectedSize === size ? '#c8922a' : '#1e1e1e'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Bag */}
            <div className="space-y-4 pt-4">
              <div className="flex gap-4">
                <div className="flex items-center border border-[#1e1e1e] w-32">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 h-16 flex items-center justify-center hover:bg-[#111] transition-colors" style={{ color: '#f0ead6' }}>
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="flex-1 text-center font-bold" style={{ color: '#f0ead6' }}>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="flex-1 h-16 flex items-center justify-center hover:bg-[#111] transition-colors" style={{ color: '#f0ead6' }}>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 h-16 font-black uppercase tracking-[0.2em] text-sm transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #f5d97a 0%, #c8922a 50%, #8B6010 100%)', color: '#0d0d0d' }}
                >
                  Add to Bag — ₹{(Number(product.price_inr) * quantity).toLocaleString('en-IN')}
                </button>

                <button 
                   onClick={() => {
                     const msg = encodeURIComponent(`Hi Variety Vista! I'm interested in the ${product.name} (SKU: ${product.sku}). Can you share more details? Link: ${typeof window !== 'undefined' ? window.location.href : ''}`);
                     window.open(`https://wa.me/917977479210?text=${msg}`, '_blank');
                   }}
                   className="w-16 flex items-center justify-center border border-[#1e1e1e] hover:bg-[#25D366]/10 transition-colors group"
                >
                  <MessageCircle className="w-6 h-6 group-hover:text-[#25D366] transition-colors" />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-6 py-8 border-y border-[#1e1e1e]">
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck className="w-5 h-5 text-[#c8922a]" />
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#4a4030]">Free Express Delivery</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <RotateCcw className="w-5 h-5 text-[#c8922a]" />
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#4a4030]">7-Day Easy Returns</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#c8922a]" />
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#4a4030]">100% Made in India</span>
                </div>
              </div>
            </div>

            {/* Product Details Accordions */}
            <div className="space-y-1">
              {[
                { id: 'description', title: 'Product Story', content: product.description || 'Our signature denim collection, meticulously crafted in India using premium 100% cotton. This piece features a refined silhouette, precision-engineered hardware, and a luxury finish designed to evolve with every wear.' },
                { id: 'fabric', title: 'Fabric & Care', content: '100% Premium Heavyweight Cotton. Bio-washed for ultimate softness. Cold wash inside out. Do not tumble dry. Iron on reverse.' },
                { id: 'shipping', title: 'Shipping & Logistics', content: 'Prepaid orders include complimentary express shipping. COD orders incur a standard ₹99 convenience fee. Expected delivery: 3-5 business days.' }
              ].map((section) => (
                <div key={section.id} className="border-b border-[#1e1e1e]">
                  <button 
                    onClick={() => toggleAccordion(section.id)}
                    className="w-full py-5 flex justify-between items-center text-[11px] font-black uppercase tracking-[0.2em]"
                    style={{ color: openAccordion === section.id ? '#c8922a' : '#f0ead6' }}
                  >
                    {section.title}
                    {openAccordion === section.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openAccordion === section.id && (
                    <div className="pb-6 text-xs leading-relaxed text-[#6a5a40]">
                      {section.content}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Reviews Section */}
            <div className="pt-20">
               <ReviewSystem productId={product.id} />
            </div>

          </div>
        </div>
      </div>
      <SizeGuide isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
}
