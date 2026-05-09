'use client';

import { Product } from '@/lib/db-schema';
import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const { addItem, items } = useCartStore();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    const total = items.reduce((acc, item) => acc + (Number(item.product.price_inr) * item.quantity), 0);
    const formattedTotal = total.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    addItem({
      product,
      quantity: 1,
      selectedSize: 'M', // Default for quick add
      selectedColor: 'Black', // Default for quick add
    });
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div
        className="relative aspect-[3/4] overflow-hidden mb-4 rounded-sm"
        style={{ background: '#111' }}
      >
        {product.image_url ? (
           <Image
            src={product.image_url}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-1000 ease-in-out ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
             <ShoppingBag className="w-12 h-12 opacity-10" />
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
          className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ background: 'rgba(13,13,13,0.8)', backdropFilter: 'blur(8px)', border: '1px solid #1e1e1e' }}
        >
          <Heart
            className="w-4 h-4"
            style={{ color: wishlisted ? '#c8922a' : '#f0ead6', fill: wishlisted ? '#c8922a' : 'none' }}
          />
        </button>

        {/* Quick Add Overlay */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 transform transition-all duration-500 ease-out ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <button
            onClick={handleQuickAdd}
            className="w-full font-black uppercase tracking-[0.2em] py-4 text-[10px] transition-all hover:opacity-90 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #f5d97a 0%, #c8922a 50%, #8B6010 100%)',
              color: '#0d0d0d',
            }}
          >
            Quick Add +
          </button>
        </div>

        {/* Stock / New badge */}
        {product.stock_count < 10 && product.stock_count > 0 && (
          <div
            className="absolute top-4 left-4 text-[9px] font-black px-3 py-1.5 uppercase tracking-widest"
            style={{ background: '#c8922a', color: '#0d0d0d' }}
          >
            Low Stock
          </div>
        )}
        {product.stock_count === 0 && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 border border-[#f0ead6]" style={{ color: '#f0ead6' }}>
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="flex flex-col gap-1.5 px-0.5 text-center sm:text-left">
        <div className="p-4 space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-tight text-[#f0ead6] truncate">{product.name}</h3>
          <div className="flex items-center justify-between">
            <p className="text-sm font-black text-[#c8922a]">
              ₹{Number(product.price_inr || 0).toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#3a3020]">
              {(product as any).fit || 'Premium'}
            </span>
          </div>
        </div>
        <p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: '#3a3020' }}>
          Premium Denim Edit
        </p>
      </div>
    </Link>
  );
}
