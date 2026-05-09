import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { Package, Truck, CheckCircle, Clock, ArrowLeft, MapPin, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default async function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:product_id (name, image_url)
      )
    `)
    .eq('id', id)
    .single();

  if (!order) notFound();

  const steps = [
    { label: 'Ordered', icon: Clock, date: order.created_at, active: true },
    { label: 'Processing', icon: Package, active: ['processing', 'shipped', 'delivered'].includes(order.status) },
    { label: 'Shipped', icon: Truck, active: ['shipped', 'delivered'].includes(order.status) },
    { label: 'Delivered', icon: CheckCircle, active: order.status === 'delivered' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-20">
      <Link href="/account" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#5a4a30] mb-12 hover:text-[#c8922a] transition-colors">
        <ArrowLeft className="w-3 h-3" /> Back to Orders
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left: Order Info & Tracking */}
        <div className="lg:col-span-8 space-y-12">
          
          <div className="space-y-4">
             <div className="flex items-center gap-4">
                <h1 className="text-4xl font-black uppercase tracking-tight" style={{ color: '#f0ead6', fontFamily: "'Playfair Display', serif" }}>
                  Order Track
                </h1>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1 bg-[#c8922a] text-[#0d0d0d] rounded-sm">
                  {order.status}
                </span>
             </div>
             <p className="text-sm font-bold uppercase tracking-widest text-[#5a4a30]">
               Order ID: <span className="text-[#c8922a] font-mono">{order.id}</span>
             </p>
          </div>

          {/* Tracking Timeline */}
          <div className="relative pt-12 pb-12">
             <div className="absolute top-1/2 left-0 right-0 h-px bg-[#1e1e1e] -translate-y-1/2 hidden md:block" />
             <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                {steps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.label} className="flex flex-col items-center text-center gap-4">
                       <div 
                         className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${
                           step.active ? 'bg-[#c8922a] text-[#0d0d0d] scale-110 shadow-[0_0_20px_rgba(200,146,42,0.3)]' : 'bg-[#0d0d0d] border border-[#1e1e1e] text-[#3a3020]'
                         }`}
                       >
                         <Icon className="w-6 h-6" />
                       </div>
                       <div className="space-y-1">
                          <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${step.active ? 'text-[#f0ead6]' : 'text-[#3a3020]'}`}>
                            {step.label}
                          </p>
                          {step.date && step.active && (
                            <p className="text-[9px] font-bold text-[#5a4a30]">{new Date(step.date).toLocaleDateString()}</p>
                          )}
                       </div>
                    </div>
                  );
                })}
             </div>
          </div>

          {/* Items */}
          <div className="space-y-6">
             <h3 className="text-lg font-black uppercase tracking-widest border-b border-[#1e1e1e] pb-4" style={{ color: '#f0ead6' }}>Shipment Details</h3>
             <div className="space-y-4">
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex gap-6 p-4 rounded-lg bg-[#0a0a0a] border border-[#1e1e1e]">
                    <div className="w-20 h-28 bg-[#111] rounded overflow-hidden shrink-0">
                       <img src={item.product?.image_url || ''} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center gap-1">
                       <h4 className="text-sm font-black uppercase tracking-wide text-[#f0ead6]">{item.product?.name}</h4>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-[#5a4a30]">Size: {item.size} × {item.quantity}</p>
                       <p className="text-xs font-mono font-bold text-[#c8922a] mt-2">₹{Number(item.price_at_purchase).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right: Summary Card */}
        <div className="lg:col-span-4 space-y-6">
           <div className="p-8 rounded-xl border border-[#1e1e1e] bg-[#0d0d0d] space-y-8">
              <section className="space-y-4">
                 <div className="flex items-center gap-3 text-[#c8922a]">
                    <MapPin className="w-4 h-4" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Delivery Address</h4>
                 </div>
                 <div className="text-xs font-bold leading-relaxed text-[#a09070]">
                    {order.shipping_address?.full_name}<br />
                    {order.shipping_address?.address}<br />
                    {order.shipping_address?.city}, {order.pincode}
                 </div>
              </section>

              <hr className="border-[#1e1e1e]" />

              <section className="space-y-4">
                 <div className="flex items-center gap-3 text-[#c8922a]">
                    <CreditCard className="w-4 h-4" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Payment Method</h4>
                 </div>
                 <p className="text-xs font-bold text-[#a09070] uppercase tracking-widest">
                   {order.razorpay_payment_id ? 'Prepaid (Razorpay)' : 'Cash on Delivery'}
                 </p>
              </section>

              <hr className="border-[#1e1e1e]" />

              <div className="space-y-2">
                 <div className="flex justify-between text-xs font-bold text-[#5a4a30] uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-[#f0ead6]">₹{Number(order.total_amount_inr).toLocaleString('en-IN')}</span>
                 </div>
                 <div className="flex justify-between text-xs font-bold text-[#5a4a30] uppercase tracking-widest">
                    <span>Shipping</span>
                    <span className="text-[#4ade80]">FREE</span>
                 </div>
                 <div className="flex justify-between items-baseline pt-4">
                    <span className="text-sm font-black uppercase tracking-widest text-[#f0ead6]">Paid Total</span>
                    <span className="text-2xl font-black text-[#c8922a]">₹{Number(order.total_amount_inr).toLocaleString('en-IN')}</span>
                 </div>
              </div>
           </div>

           <div className="p-6 rounded-xl border border-[#c8922a30] bg-[#c8922a08] text-center space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c8922a]">Need Help?</p>
              <p className="text-[10px] font-bold text-[#6a5a40] leading-relaxed">
                If you have questions about your delivery, please contact our logistics desk.
              </p>
              <button className="text-[10px] font-black uppercase tracking-widest text-[#f0ead6] border-b border-[#f0ead6] pb-0.5">
                Contact Support
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
