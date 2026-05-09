import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { User, Package, MapPin, Heart, LogOut, ChevronRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default async function AccountPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
           <div className="flex items-center gap-6 p-6 rounded-xl border border-[#1e1e1e] bg-[#0d0d0d]">
              <div className="w-16 h-16 rounded-full bg-[#1e1e1e] flex items-center justify-center text-2xl font-black text-[#c8922a]">
                 {profile?.full_name?.charAt(0) || 'U'}
              </div>
              <div>
                 <h2 className="text-xl font-black uppercase tracking-tight text-[#f0ead6]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {profile?.full_name || 'Vista Member'}
                 </h2>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-[#5a4a30]">{user.email}</p>
              </div>
           </div>

           <nav className="space-y-2">
              {[
                { label: 'My Orders', icon: Package, href: '/account#orders' },
                { label: 'Wishlist', icon: Heart, href: '/wishlist' },
                { label: 'Shipping Address', icon: MapPin, href: '/account/address' },
                { label: 'Log Out', icon: LogOut, href: '/auth/logout', color: '#f87171' },
              ].map((item) => (
                <Link 
                  key={item.label} 
                  href={item.href}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-[#111] transition-colors group border border-transparent hover:border-[#1e1e1e]"
                >
                   <div className="flex items-center gap-4">
                      <item.icon className="w-5 h-5" style={{ color: item.color || '#c8922a' }} />
                      <span className="text-xs font-black uppercase tracking-widest text-[#f0ead6]">{item.label}</span>
                   </div>
                   <ChevronRight className="w-4 h-4 text-[#3a3020] group-hover:text-[#c8922a] transition-colors" />
                </Link>
              ))}
           </nav>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-8 space-y-12">
           
           <section id="orders" className="space-y-8">
              <div className="flex items-center justify-between border-b border-[#1e1e1e] pb-6">
                 <h3 className="text-2xl font-black uppercase tracking-tight text-[#f0ead6]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Recent Orders
                 </h3>
                 <Link href="/shop" className="text-[10px] font-black uppercase tracking-widest text-[#c8922a]">
                    Continue Shopping
                 </Link>
              </div>

              {orders && orders.length > 0 ? (
                <div className="space-y-4">
                   {orders.map((order) => (
                     <Link 
                       key={order.id} 
                       href={`/account/orders/${order.id}`}
                       className="block p-6 rounded-xl border border-[#1e1e1e] bg-[#0a0a0a] hover:border-[#c8922a30] transition-all"
                     >
                        <div className="flex justify-between items-center mb-4">
                           <div className="flex items-center gap-3">
                              <ShoppingBag className="w-5 h-5 text-[#c8922a]" />
                              <span className="text-xs font-black uppercase tracking-widest text-[#f0ead6]">Order #{order.id.slice(0, 8)}</span>
                           </div>
                           <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-[#c8922a20] text-[#c8922a]">
                              {order.status}
                           </span>
                        </div>
                        <div className="flex justify-between items-end">
                           <div className="space-y-1">
                              <p className="text-[10px] font-bold text-[#5a4a30] uppercase">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                              <p className="text-sm font-black text-[#f0ead6]">₹{Number(order.total_amount_inr).toLocaleString('en-IN')}</p>
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-widest text-[#c8922a] flex items-center gap-2">
                              View Tracking →
                           </span>
                        </div>
                     </Link>
                   ))}
                </div>
              ) : (
                <div className="py-20 text-center space-y-6 rounded-xl border border-dashed border-[#1e1e1e]">
                   <Package className="w-12 h-12 mx-auto opacity-10 text-[#f0ead6]" />
                   <div className="space-y-2">
                      <p className="text-sm font-black uppercase tracking-tight text-[#f0ead6]">No orders yet</p>
                      <p className="text-[10px] font-bold text-[#5a4a30] uppercase tracking-widest">Your premium denim collection starts here.</p>
                   </div>
                   <Link href="/shop" className="inline-block px-10 py-3 bg-[#c8922a] text-[#0d0d0d] text-[10px] font-black uppercase tracking-widest">
                      Start Shopping
                   </Link>
                </div>
              )}
           </section>

        </div>

      </div>
    </div>
  );
}
