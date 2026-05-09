'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowRight, ShieldCheck, Mail } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
    } else {
      router.push('/account');
      router.refresh();
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-20 min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md space-y-10">
        
        <div className="text-center space-y-4">
           <h1 className="text-4xl font-black uppercase tracking-tight" style={{ color: '#f0ead6', fontFamily: "'Playfair Display', serif" }}>
             Welcome Back
           </h1>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c8922a]">
             Enter the Vista
           </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
           <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#5a4a30] ml-1">Email Address</label>
              <input 
                type="email" required
                className="w-full px-5 py-4 bg-[#0d0d0d] border border-[#1e1e1e] text-[#f0ead6] outline-none focus:border-[#c8922a] rounded-sm transition-all"
                value={email} onChange={e => setEmail(e.target.value)}
              />
           </div>
           <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-[#5a4a30]">Password</label>
                 <Link href="/auth/forgot" className="text-[9px] font-black uppercase tracking-widest text-[#c8922a]">Forgot?</Link>
              </div>
              <input 
                type="password" required
                className="w-full px-5 py-4 bg-[#0d0d0d] border border-[#1e1e1e] text-[#f0ead6] outline-none focus:border-[#c8922a] rounded-sm transition-all"
                value={password} onChange={e => setPassword(e.target.value)}
              />
           </div>

           {message && (
             <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">
                {message}
             </div>
           )}

           <button 
             type="submit" 
             disabled={loading}
             className="w-full py-5 font-black uppercase tracking-[0.2em] text-sm transition-opacity hover:opacity-90 flex items-center justify-center gap-3 mt-4"
             style={{ background: 'linear-gradient(135deg, #f5d97a 0%, #c8922a 50%, #8B6010 100%)', color: '#0d0d0d' }}
           >
             {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
           </button>
        </form>

        <div className="pt-10 border-t border-[#1e1e1e] text-center space-y-6">
           <p className="text-[10px] font-bold uppercase tracking-widest text-[#4a4030]">
             New to Variety Vista?
           </p>
           <Link 
             href="/signup" 
             className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#f0ead6] border-b border-[#c8922a] pb-1 hover:text-[#c8922a] transition-colors"
           >
             Create Account <ArrowRight className="w-3 h-3" />
           </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-10">
           <div className="flex items-center gap-3 p-4 border border-[#1e1e1e] rounded-sm">
              <ShieldCheck className="w-4 h-4 text-[#c8922a]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[#3a3020]">Secure Encryption</span>
           </div>
           <div className="flex items-center gap-3 p-4 border border-[#1e1e1e] rounded-sm">
              <Mail className="w-4 h-4 text-[#c8922a]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[#3a3020]">Private Access</span>
           </div>
        </div>

      </div>
    </div>
  );
}
