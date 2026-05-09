'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Loader2, Send } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const supabase = createClient();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const { error } = await supabase
      .from('newsletter_subs')
      .insert([{ email }]);

    if (error) {
      if (error.code === '23505') {
        setStatus({ type: 'success', message: 'You are already in our circle.' });
      } else {
        setStatus({ type: 'error', message: 'The vista is currently closed. Try again later.' });
      }
    } else {
      setStatus({ type: 'success', message: 'Welcome to the inner circle. Check your inbox.' });
      setEmail('');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
         <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#c8922a] mb-2">Inner Circle</h4>
         <p className="text-xs font-bold text-[#6a5a40] uppercase tracking-widest leading-relaxed">
           Join the elite list for 10% off your first order and exclusive access to new drops.
         </p>
      </div>
      
      <form onSubmit={handleSubscribe} className="space-y-3">
         <div className="relative group">
            <input 
              type="email" required
              placeholder="YOUR EMAIL ADDRESS"
              className="w-full bg-transparent border-b border-[#1e1e1e] py-4 text-[10px] font-black tracking-widest text-[#f0ead6] outline-none focus:border-[#c8922a] transition-colors"
              value={email} onChange={e => setEmail(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={loading}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:text-[#c8922a] transition-colors"
              style={{ color: '#3a3020' }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
         </div>

         {status && (
           <p className={`text-[9px] font-black uppercase tracking-widest ${status.type === 'success' ? 'text-[#4ade80]' : 'text-red-500'}`}>
              {status.message}
           </p>
         )}
      </form>
    </div>
  );
}
