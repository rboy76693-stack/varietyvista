'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import { PageTransition } from '@/components/common/Animations';

export default function OrderSuccess() {
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Get order ID from URL if available
    const params = new URLSearchParams(window.location.search);
    setOrderId(params.get('order_id'));
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0d0d0d] pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-8">
           <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-[#4ade8010] flex items-center justify-center mx-auto border border-[#4ade8020]">
                 <CheckCircle className="w-12 h-12 text-[#4ade80]" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#c8922a] rounded-full flex items-center justify-center text-[10px] font-black text-[#0d0d0d]">
                 VV
              </div>
           </div>

           <div className="space-y-4">
              <h1 className="text-5xl font-black uppercase tracking-tight text-[#f0ead6]" style={{ fontFamily: "'Playfair Display', serif" }}>
                 Order Confirmed
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c8922a]">
                 Welcome to the Vista Archive
              </p>
           </div>

           <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-8 space-y-6 text-left">
              <div className="flex items-center justify-between">
                 <span className="text-xs font-bold uppercase tracking-widest text-[#3a3020]">Order Status</span>
                 <span className="px-3 py-1 bg-[#4ade8010] text-[#4ade80] text-[10px] font-black uppercase rounded-full">Paid & Verified</span>
              </div>
              
              <div className="space-y-2">
                 <p className="text-[10px] font-black uppercase tracking-widest text-[#5a4a30]">Tracking Identity</p>
                 <p className="font-mono text-lg font-bold text-[#f0ead6] break-all">{orderId || 'VISTA-' + Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              </div>

              <div className="flex items-start gap-4 p-4 bg-[#0a0a0a] rounded-xl border border-[#1e1e1e]">
                 <Package className="w-5 h-5 text-[#c8922a] flex-shrink-0" />
                 <div>
                    <p className="text-xs font-bold text-[#f0ead6]">Manifesting your denim...</p>
                    <p className="text-[10px] text-[#4a4030] mt-1 leading-relaxed">Our artisans are preparing your selection. You will receive a WhatsApp notification once the shipment departs Mumbai HQ.</p>
                 </div>
              </div>
           </div>

           <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/shop"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#c8922a] text-[#0d0d0d] font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform"
              >
                 <ShoppingBag className="w-4 h-4" /> Continue Exploring
              </Link>
              <Link 
                href="/account"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 border border-[#1e1e1e] text-[#f0ead6] font-black uppercase tracking-widest text-xs hover:bg-white/[0.03] transition-colors"
              >
                 View My Orders <ArrowRight className="w-4 h-4" />
              </Link>
           </div>
        </div>
      </div>
    </PageTransition>
  );
}
