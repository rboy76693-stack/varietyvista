'use client';

import { useEffect } from 'react';
import { PageTransition } from '@/components/common/Animations';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] px-6">
        <div className="text-center space-y-8 max-w-md">
           <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-10 h-10 text-red-500" />
           </div>
           <div className="space-y-4">
              <h2 className="text-3xl font-black uppercase tracking-tight text-[#f0ead6]" style={{ fontFamily: "'Playfair Display', serif" }}>
                 System Disruption
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5a4a30] leading-relaxed">
                 A technical anomaly occurred while exploring the vista. Our engineers have been notified.
              </p>
           </div>
           <button 
             onClick={() => reset()}
             className="inline-flex items-center gap-3 px-10 py-4 border border-[#c8922a] text-[#c8922a] font-black uppercase tracking-[0.2em] text-xs hover:bg-[#c8922a] hover:text-[#0d0d0d] transition-all"
           >
              <RefreshCcw className="w-4 h-4" /> Try Again
           </button>
        </div>
      </div>
    </PageTransition>
  );
}
