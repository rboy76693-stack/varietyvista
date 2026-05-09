'use client';

import { MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function WhatsAppButton() {
  const pathname = usePathname();
  
  // Don't show on admin pages
  if (pathname?.startsWith('/admin')) return null;

  const phoneNumber = "917977479210"; // Updated real number
  const message = encodeURIComponent("Hello Variety Vista! I'm interested in your premium collection. Can you help me?");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a 
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[90] w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-all hover:scale-110 hover:rotate-6 active:scale-95 group"
    >
      <MessageCircle className="w-7 h-7 fill-current" />
      
      {/* Tooltip */}
      <div className="absolute right-full mr-4 px-4 py-2 bg-[#0d0d0d] border border-[#1e1e1e] text-[10px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-sm">
         Chat with Vista Concierge
      </div>
    </a>
  );
}
