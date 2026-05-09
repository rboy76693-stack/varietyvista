'use client';

import { Star, CheckCircle, User, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export function ReviewSystem({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadReviews() {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id (full_name)
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (!error) setReviews(data);
      setLoading(false);
    }
    loadReviews();
  }, [productId]);

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin opacity-20" /></div>;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#1e1e1e] pb-10">
        <div>
           <h2 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#f0ead6', fontFamily: "'Playfair Display', serif" }}>
             Customer Critique
           </h2>
           <div className="flex items-center gap-4 mt-2">
              <div className="flex text-[#c8922a]">
                 {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-[#5a4a30]">
                Based on {reviews.length} Verified Reviews
              </span>
           </div>
        </div>
        <button className="px-8 py-3 text-[10px] font-black uppercase tracking-widest border border-[#c8922a] text-[#c8922a] hover:bg-[#c8922a] hover:text-[#0d0d0d] transition-all">
          Write a Review
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reviews.length === 0 ? (
          <p className="text-xs font-bold uppercase tracking-widest text-[#3a3020] col-span-2 py-10 text-center">
            No critiques yet. Be the first to review.
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="space-y-4 p-6 border border-[#1e1e1e] bg-[#0a0a0a] rounded-sm">
               <div className="flex justify-between items-start">
                  <div className="flex text-[#c8922a]">
                     {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                  </div>
                  <span className="text-[9px] font-bold text-[#3a3020]">{new Date(review.created_at).toLocaleDateString()}</span>
               </div>
               <p className="text-sm italic leading-relaxed" style={{ color: '#f0ead6' }}>"{review.comment}"</p>
               <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-[#1e1e1e] flex items-center justify-center text-[10px] text-[#c8922a] font-black">
                        {review.profiles?.full_name?.charAt(0) || <User className="w-3 h-3" />}
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-[#6a5a40]">
                        {review.profiles?.full_name || 'Anonymous Guest'}
                     </span>
                  </div>
                  {review.is_verified_purchase && (
                    <div className="flex items-center gap-1.5 text-[#4ade80]">
                       <CheckCircle className="w-3 h-3" />
                       <span className="text-[9px] font-black uppercase tracking-widest">Verified Purchase</span>
                    </div>
                  )}
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
