'use client';

import { useCartStore } from '@/store/useCartStore';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export function CartDrawer() {
  const { isCartOpen, setCartOpen, items, removeItem, updateQuantity, getCartTotal } = useCartStore();

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div 
        className="absolute top-0 right-0 h-full w-full max-w-md flex flex-col shadow-2xl transition-transform duration-300"
        style={{ background: '#0d0d0d', borderLeft: '1px solid #1e1e1e' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#1e1e1e' }}>
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5" style={{ color: '#c8922a' }} />
            <h2 className="text-lg font-black uppercase tracking-widest" style={{ color: '#f0ead6' }}>Your Bag</h2>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#c8922a', color: '#0d0d0d' }}>
              {items.length}
            </span>
          </div>
          <button onClick={() => setCartOpen(false)} style={{ color: '#f0ead6' }}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-10" style={{ color: '#f0ead6' }} />
              <p className="font-bold text-[#6a5a40]">Your bag is empty</p>
              <button 
                onClick={() => setCartOpen(false)}
                className="mt-6 px-8 py-3 text-sm font-bold uppercase tracking-widest border"
                style={{ borderColor: '#c8922a', color: '#c8922a' }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4">
                {/* Image Placeholder */}
                <div className="w-24 h-32 rounded bg-[#1a1a1a] flex-shrink-0 flex items-center justify-center overflow-hidden">
                   {item.product.image_url ? (
                     <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                   ) : (
                     <ShoppingBag className="w-8 h-8 opacity-20" />
                   )}
                </div>
                
                {/* Details */}
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold uppercase tracking-wide leading-tight" style={{ color: '#f0ead6' }}>
                      {item.product.name}
                    </h3>
                    <button 
                      onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
                      style={{ color: '#3a3020' }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs uppercase font-bold mb-4" style={{ color: '#5a4a30' }}>
                    {item.selectedSize} / {item.selectedColor}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center border" style={{ borderColor: '#2a2a2a' }}>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                        className="p-1 px-2 border-r" style={{ borderColor: '#2a2a2a', color: '#f0ead6' }}
                      ><Minus className="w-3 h-3" /></button>
                      <span className="px-3 text-xs font-bold" style={{ color: '#f0ead6' }}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                        className="p-1 px-2 border-l" style={{ borderColor: '#2a2a2a', color: '#f0ead6' }}
                      ><Plus className="w-3 h-3" /></button>
                    </div>
                    <p className="font-mono font-bold" style={{ color: '#c8922a' }}>
                      ₹{(Number(item.product.price_inr) * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t" style={{ borderColor: '#1e1e1e', background: '#0f0f0f' }}>
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-bold uppercase tracking-widest" style={{ color: '#6a5a40' }}>Subtotal</span>
              <span className="text-xl font-black" style={{ color: '#f0ead6' }}>
                ₹{getCartTotal().toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[10px] text-center mb-6 uppercase tracking-widest" style={{ color: '#3a3020' }}>
              Shipping and taxes calculated at checkout
            </p>
            <Link
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="block w-full py-4 text-center text-sm font-black uppercase tracking-[0.2em] transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #f5d97a 0%, #c8922a 50%, #8B6010 100%)', color: '#0d0d0d' }}
            >
              Checkout Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
