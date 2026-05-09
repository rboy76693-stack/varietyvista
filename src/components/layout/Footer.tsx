'use client';

import Link from 'next/link';
import { ChevronDown, Bot, Mail, Phone, MapPin } from 'lucide-react';
import { Newsletter } from '@/components/common/Newsletter';
import { useState } from 'react';
import { AIChatModal } from '@/components/common/AIChatModal';

export function Footer() {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  
  const sections = [
    { 
      title: 'Resources', 
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Track your order', href: '/account' },
        { label: 'Return / Exchange', href: '/protocol' }
      ] 
    },
    { 
      title: 'Protocol', 
      links: [
        { label: 'Privacy policy', href: '/protocol' },
        { label: 'Shipping Policy', href: '/protocol' },
        { label: 'Terms of Service', href: '/protocol' },
        { label: 'FAQs', href: '/protocol' }
      ] 
    },
    { 
      title: 'Shop', 
      links: [
        { label: 'Baggy Fits', href: '/shop' },
        { label: 'Straight Cut', href: '/shop' },
        { label: 'New Arrivals', href: '/shop' }
      ] 
    },
    { 
      title: 'Be An Affiliate', 
      links: [
        { label: 'Register Here', href: '#' }
      ] 
    },
  ];

  return (
    <footer
      className="relative pt-24 pb-28"
      style={{ background: '#080808', borderTop: '1px solid #1e1e1e' }}
    >
      {/* Gold top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #c8922a, transparent)' }}
      />

      <div className="container mx-auto px-6 md:px-12">

        {/* Logo + tagline */}
        <div className="mb-20">
          <h3
            className="text-4xl font-semibold mb-3"
            style={{
              fontFamily: "'Playfair Display', serif",
              background: 'linear-gradient(135deg, #f5d97a 0%, #c8922a 50%, #8B6010 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Variety vista®
          </h3>
          <p className="text-[10px] tracking-[0.5em] uppercase font-black" style={{ color: '#4a4030' }}>
            The Architecture of Denim.
          </p>
        </div>

        {/* Top Grid: Links + Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h4
                  className="text-[10px] font-black uppercase tracking-[0.3em] mb-6"
                  style={{ color: '#c8922a' }}
                >
                  {section.title}
                </h4>
                <ul className="flex flex-col gap-3">
                  {section.links.map(link => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-[11px] font-bold uppercase tracking-widest text-[#5a4a30] hover:text-[#c8922a] transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="md:col-span-4 border-l border-[#1e1e1e] pl-0 md:pl-12">
             <Newsletter />
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 py-12 border-y border-[#1e1e1e] mb-16">
           <div className="flex gap-5">
              <MapPin className="w-6 h-6 text-[#c8922a] shrink-0" />
              <div className="space-y-1">
                 <h5 className="text-[10px] font-black uppercase tracking-widest text-[#f0ead6]">Headquarters</h5>
                 <p className="text-[11px] font-bold text-[#5a4a30] leading-relaxed uppercase tracking-wide">
                    Variety Vista®<br />
                    Shanti Nagar Salt Pen Road,<br />
                    Near Rehaan Medicle, Antop Hill,<br />
                    Mumbai 400 037, India
                 </p>
              </div>
           </div>
           
           <div className="flex gap-5">
              <Phone className="w-6 h-6 text-[#c8922a] shrink-0" />
              <div className="space-y-1">
                 <h5 className="text-[10px] font-black uppercase tracking-widest text-[#f0ead6]">Direct Line</h5>
                 <p className="text-[11px] font-bold text-[#5a4a30] tracking-widest">+91 7977479210</p>
              </div>
           </div>

           <div className="flex gap-5">
              <Mail className="w-6 h-6 text-[#c8922a] shrink-0" />
              <div className="space-y-1">
                 <h5 className="text-[10px] font-black uppercase tracking-widest text-[#f0ead6]">Inquiries</h5>
                 <p className="text-[11px] font-bold text-[#5a4a30] tracking-widest lowercase">contact@varietyvista.co.in</p>
              </div>
           </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-[#2a2a2a]">
            <span>© 2025 Variety Vista®. All Rights Reserved.</span>
            <span className="hidden md:inline">|</span>
            <span>Made with precision in India</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="w-10 h-10 rounded-full border border-[#1e1e1e] flex items-center justify-center text-[#5a4a30] hover:text-[#c8922a] hover:border-[#c8922a] transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-[#1e1e1e] flex items-center justify-center text-[#5a4a30] hover:text-[#c8922a] hover:border-[#c8922a] transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l16 16M4 20L20 4"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Floating Ask AI Button */}
      <button
        onClick={() => setIsAIModalOpen(true)}
        suppressHydrationWarning
        className="fixed bottom-6 left-1/2 -translate-x-1/2 px-8 py-4 rounded-full flex items-center gap-3 font-black uppercase tracking-widest text-[10px] shadow-2xl z-50 transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #f5d97a 0%, #c8922a 100%)',
          color: '#0d0d0d',
          boxShadow: '0 10px 40px rgba(200,146,42,0.4)',
        }}
      >
        <Bot className="w-4 h-4" />
        Ask Variety Vista AI
      </button>

      <AIChatModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />
    </footer>
  );
}
