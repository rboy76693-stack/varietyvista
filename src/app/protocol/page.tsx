'use client';

import { useState } from 'react';
import { PageTransition } from '@/components/common/Animations';
import { Shield, Scale, Truck, RotateCcw, HelpCircle } from 'lucide-react';

const SECTIONS = [
  { id: 'privacy', title: 'Privacy Policy', icon: Shield, content: "We respect your privacy. All your personal data is encrypted and stored securely. We never share your details with third parties without your consent." },
  { id: 'returns', title: 'Returns & Exchange', icon: RotateCcw, content: "We offer a 7-day hassle-free return and exchange policy for all unworn items with original tags. Simply initiate a request from your Account dashboard." },
  { id: 'shipping', title: 'Shipping Policy', icon: Truck, content: "Orders are processed within 24-48 hours. We offer Free Express Delivery across India for orders above ₹999. Standard delivery takes 3-5 business days." },
  { id: 'terms', title: 'Terms of Service', icon: Scale, content: "By using Variety Vista, you agree to our terms. All products are subject to availability. Prices include GST where applicable." },
  { id: 'faq', title: 'FAQs', icon: HelpCircle, content: "Q: How do I wash my denim? A: We recommend cold hand wash and air drying to preserve the structure and color of your Vista jeans." },
];

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState('privacy');

  return (
    <PageTransition>
      <div className="max-w-[1200px] mx-auto px-6 py-20 min-h-screen">
         <div className="text-center mb-20 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c8922a]">Legal & Support</p>
            <h1 className="text-5xl font-black uppercase tracking-tight" style={{ color: '#f0ead6', fontFamily: "'Playfair Display', serif" }}>
               The Vista Protocol
            </h1>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-4">
               {SECTIONS.map((section) => {
                 const Icon = section.icon;
                 return (
                   <button 
                     key={section.id}
                     onClick={() => setActiveTab(section.id)}
                     className={`w-full flex items-center gap-4 p-6 rounded-lg border transition-all ${
                       activeTab === section.id 
                         ? 'bg-[#c8922a10] border-[#c8922a] text-[#c8922a]' 
                         : 'border-[#1e1e1e] text-[#5a4a30] hover:border-[#c8922a30]'
                     }`}
                   >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-black uppercase tracking-widest">{section.title}</span>
                   </button>
                 );
               })}
            </aside>

            {/* Content */}
            <div className="lg:col-span-8 p-10 border border-[#1e1e1e] bg-[#0a0a0a] rounded-xl">
               {SECTIONS.filter(s => s.id === activeTab).map(section => (
                 <div key={section.id} className="space-y-8 animate-fade-in">
                    <h2 className="text-3xl font-black uppercase tracking-tight text-[#f0ead6]" style={{ fontFamily: "'Playfair Display', serif" }}>
                       {section.title}
                    </h2>
                    <div className="h-px w-20 bg-[#c8922a]" />
                    <p className="text-[#a09070] text-lg leading-relaxed">
                       {section.content}
                    </p>
                    <div className="pt-10">
                       <p className="text-[10px] font-black uppercase tracking-widest text-[#3a3020]">
                          Last Updated: May 2025
                       </p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </PageTransition>
  );
}
