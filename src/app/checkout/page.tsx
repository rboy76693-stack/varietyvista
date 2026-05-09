'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, ChevronRight, MapPin, Truck, CreditCard, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    pincode: '',
    phone: '',
    paymentMethod: 'razorpay'
  });

  const total = getCartTotal();
  const shipping = total > 999 ? 0 : 99;
  const grandTotal = total + shipping;

  const handleNext = () => {
    if (step === 1) {
      if (!formData.email || !formData.address || !formData.pincode) {
        alert('Please fill in required fields');
        return;
      }
    }
    setStep(step + 1);
  };

  const handlePayment = async () => {
    setLoading(true);
    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setStep(4); // Success step
    clearCart();
  };

  if (items.length === 0 && step !== 4) {
    return (
      <div className="max-w-xl mx-auto py-40 px-6 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto mb-6 opacity-10" />
        <h1 className="text-2xl font-black uppercase tracking-tight mb-4" style={{ color: '#f0ead6' }}>Your Bag is Empty</h1>
        <Link href="/" className="inline-block px-8 py-3 text-sm font-bold uppercase tracking-widest" style={{ background: '#c8922a', color: '#0d0d0d' }}>
          Back to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left Column: Form Steps */}
        <div className="lg:col-span-7">
          
          {/* Progress Bar */}
          {step < 4 && (
             <div className="flex items-center gap-4 mb-12 overflow-x-auto pb-4 no-scrollbar">
                {[
                  { s: 1, label: 'Information', icon: MapPin },
                  { s: 2, label: 'Shipping', icon: Truck },
                  { s: 3, label: 'Payment', icon: CreditCard },
                ].map((item) => (
                  <div key={item.s} className="flex items-center gap-3 shrink-0">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                        step >= item.s ? 'bg-[#c8922a] text-[#0d0d0d]' : 'bg-[#1a1a1a] text-[#3a3020]'
                      }`}
                    >
                      {step > item.s ? <CheckCircle2 className="w-4 h-4" /> : item.s}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${step >= item.s ? 'text-[#f0ead6]' : 'text-[#3a3020]'}`}>
                      {item.label}
                    </span>
                    {item.s < 3 && <ChevronRight className="w-3 h-3 text-[#1e1e1e]" />}
                  </div>
                ))}
             </div>
          )}

          {step === 1 && (
            <div className="space-y-10">
              <section>
                <h2 className="text-xl font-black uppercase tracking-tight mb-6" style={{ color: '#f0ead6' }}>Contact Information</h2>
                <input 
                  type="email" placeholder="Email Address *" 
                  className="w-full px-4 py-4 rounded bg-[#0d0d0d] border border-[#1e1e1e] text-[#f0ead6] outline-none focus:border-[#c8922a]"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </section>

              <section>
                <h2 className="text-xl font-black uppercase tracking-tight mb-6" style={{ color: '#f0ead6' }}>Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input type="text" placeholder="First Name *" className="px-4 py-4 rounded bg-[#0d0d0d] border border-[#1e1e1e] text-[#f0ead6] outline-none focus:border-[#c8922a]" />
                  <input type="text" placeholder="Last Name *" className="px-4 py-4 rounded bg-[#0d0d0d] border border-[#1e1e1e] text-[#f0ead6] outline-none focus:border-[#c8922a]" />
                </div>
                <input 
                  type="text" placeholder="Full Address (House No, Building, Area) *" 
                  className="w-full px-4 py-4 rounded bg-[#0d0d0d] border border-[#1e1e1e] text-[#f0ead6] outline-none focus:border-[#c8922a] mb-4" 
                  value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" placeholder="City *" 
                    className="px-4 py-4 rounded bg-[#0d0d0d] border border-[#1e1e1e] text-[#f0ead6] outline-none focus:border-[#c8922a]" 
                  />
                  <input 
                    type="text" placeholder="Pincode *" 
                    className="px-4 py-4 rounded bg-[#0d0d0d] border border-[#1e1e1e] text-[#f0ead6] outline-none focus:border-[#c8922a]" 
                    value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})}
                  />
                </div>
              </section>

              <button 
                onClick={handleNext}
                className="w-full py-5 font-black uppercase tracking-[0.2em] text-sm"
                style={{ background: 'linear-gradient(135deg, #f5d97a 0%, #c8922a 50%, #8B6010 100%)', color: '#0d0d0d' }}
              >
                Continue to Shipping
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="rounded-lg border border-[#1e1e1e] p-6 space-y-4">
                 <div className="flex justify-between items-center text-sm">
                    <span style={{ color: '#5a4a30' }}>Contact</span>
                    <span style={{ color: '#f0ead6' }}>{formData.email}</span>
                 </div>
                 <hr className="border-[#1e1e1e]" />
                 <div className="flex justify-between items-center text-sm">
                    <span style={{ color: '#5a4a30' }}>Ship to</span>
                    <span style={{ color: '#f0ead6' }}>{formData.address}, {formData.pincode}</span>
                 </div>
              </div>

              <section>
                <h2 className="text-xl font-black uppercase tracking-tight mb-6" style={{ color: '#f0ead6' }}>Shipping Method</h2>
                <div className="rounded-lg border border-[#c8922a] p-6 bg-[#c8922a10] flex justify-between items-center">
                   <div>
                      <p className="text-sm font-bold" style={{ color: '#c8922a' }}>Standard Delivery</p>
                      <p className="text-xs" style={{ color: '#5a4a30' }}>3-5 business days</p>
                   </div>
                   <p className="text-sm font-bold" style={{ color: '#f0ead6' }}>
                     {shipping === 0 ? 'FREE' : `₹${shipping}`}
                   </p>
                </div>
              </section>

              <div className="flex items-center justify-between pt-6">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: '#6a5a40' }}>
                   <ArrowLeft className="w-3 h-3" /> Back
                </button>
                <button 
                  onClick={handleNext}
                  className="px-10 py-5 font-black uppercase tracking-[0.2em] text-sm"
                  style={{ background: 'linear-gradient(135deg, #f5d97a 0%, #c8922a 50%, #8B6010 100%)', color: '#0d0d0d' }}
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-black uppercase tracking-tight mb-6" style={{ color: '#f0ead6' }}>Payment Method</h2>
                <div className="space-y-4">
                   <div className="rounded-lg border border-[#c8922a] p-6 bg-[#c8922a10] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-5 h-5 rounded-full border-4 border-[#c8922a] bg-[#0d0d0d]" />
                         <span className="text-sm font-bold" style={{ color: '#f0ead6' }}>Razorpay (UPI, Cards, Netbanking)</span>
                      </div>
                      <CreditCard className="w-5 h-5" style={{ color: '#c8922a' }} />
                   </div>
                   <div className="rounded-lg border border-[#1e1e1e] p-6 flex items-center justify-between opacity-50">
                      <div className="flex items-center gap-3">
                         <div className="w-5 h-5 rounded-full border-2 border-[#1e1e1e]" />
                         <span className="text-sm font-bold" style={{ color: '#5a4a30' }}>Cash on Delivery (₹99 Fee)</span>
                      </div>
                   </div>
                </div>
              </section>

              <button 
                onClick={handlePayment}
                disabled={loading}
                className="w-full py-5 font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3"
                style={{ background: 'linear-gradient(135deg, #f5d97a 0%, #c8922a 50%, #8B6010 100%)', color: '#0d0d0d' }}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Pay Now — ₹${grandTotal.toLocaleString('en-IN')}`}
              </button>
            </div>
          )}

          {step === 4 && (
             <div className="py-20 text-center space-y-6">
                <div className="w-20 h-20 bg-[#4ade8015] rounded-full flex items-center justify-center mx-auto">
                   <CheckCircle2 className="w-10 h-10 text-[#4ade80]" />
                </div>
                <h1 className="text-4xl font-black uppercase tracking-tight" style={{ color: '#f0ead6' }}>Order Placed!</h1>
                <p className="text-[#6a5a40] max-w-sm mx-auto">
                  Thank you for shopping with Variety Vista. Your order confirmation has been sent to your email.
                </p>
                <Link href="/" className="inline-block mt-8 px-10 py-4 font-black uppercase tracking-widest text-sm" style={{ background: 'linear-gradient(135deg, #f5d97a 0%, #c8922a 50%, #8B6010 100%)', color: '#0d0d0d' }}>
                  Continue Shopping
                </Link>
             </div>
          )}

        </div>

        {/* Right Column: Order Summary (Sticky) */}
        {step < 4 && (
          <div className="lg:col-span-5">
            <div className="sticky top-40 rounded-xl border border-[#1e1e1e] bg-[#0d0d0d] overflow-hidden">
               <div className="p-6 border-b border-[#1e1e1e] flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4 text-[#c8922a]" />
                  <h3 className="font-black uppercase tracking-widest text-sm" style={{ color: '#f0ead6' }}>Order Summary</h3>
               </div>
               <div className="p-6 space-y-6 max-h-[400px] overflow-y-auto no-scrollbar">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.selectedSize}`} className="flex gap-4">
                      <div className="w-16 h-20 bg-[#1a1a1a] rounded shrink-0 overflow-hidden">
                         <img src={item.product.image_url || ''} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                         <h4 className="text-xs font-bold uppercase tracking-wide leading-tight text-[#f0ead6]">{item.product.name}</h4>
                         <p className="text-[10px] text-[#4a4030] uppercase mt-1">{item.selectedSize} × {item.quantity}</p>
                      </div>
                      <span className="text-xs font-bold text-[#c8922a]">₹{(Number(item.product.price_inr) * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
               </div>
               <div className="p-6 border-t border-[#1e1e1e] bg-[#0f0f0f] space-y-3">
                  <div className="flex justify-between text-xs uppercase tracking-widest font-bold" style={{ color: '#5a4a30' }}>
                     <span>Subtotal</span>
                     <span className="text-[#f0ead6]">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs uppercase tracking-widest font-bold" style={{ color: '#5a4a30' }}>
                     <span>Shipping</span>
                     <span className={shipping === 0 ? 'text-[#4ade80]' : 'text-[#f0ead6]'}>
                       {shipping === 0 ? 'FREE' : `₹${shipping}`}
                     </span>
                  </div>
                  <hr className="border-[#1e1e1e] my-4" />
                  <div className="flex justify-between items-baseline">
                     <span className="text-sm font-black uppercase tracking-widest text-[#f0ead6]">Total</span>
                     <span className="text-2xl font-black text-[#c8922a]">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
