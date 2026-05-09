import Link from 'next/link';
import { PageTransition } from '@/components/common/Animations';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] px-6">
        <div className="text-center space-y-8">
           <div className="relative inline-block">
              <Compass className="w-32 h-32 text-[#c8922a] opacity-20 animate-spin-slow" />
              <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-black text-[#f0ead6] opacity-10">404</h1>
           </div>
           <div className="space-y-4">
              <h2 className="text-4xl font-black uppercase tracking-tight text-[#f0ead6]" style={{ fontFamily: "'Playfair Display', serif" }}>
                 Lost in the Vista
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c8922a]">
                 This coordinate does not exist in our archive.
              </p>
           </div>
           <Link href="/" className="inline-block px-12 py-5 bg-[#c8922a] text-[#0d0d0d] font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-transform">
              Return to Origin
           </Link>
        </div>
      </div>
    </PageTransition>
  );
}
