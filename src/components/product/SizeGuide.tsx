'use client';

import { X } from 'lucide-react';

export function SizeGuide({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#0d0d0d] border border-[#1e1e1e] p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-6 right-6 text-[#f0ead6] hover:text-[#c8922a] transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="space-y-10">
          <div className="text-center space-y-4">
             <h2 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#f0ead6', fontFamily: "'Playfair Display', serif" }}>
               The Master Guide
             </h2>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c8922a]">Fit & Measurements</p>
          </div>

          <div className="space-y-8">
             <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-[#f0ead6] mb-4">Baggy / Wide Leg (Inches)</h4>
                <div className="overflow-x-auto">
                   <table className="w-full text-[10px] uppercase font-bold tracking-widest text-[#5a4a30]">
                      <thead>
                         <tr className="border-b border-[#1e1e1e]">
                            <th className="py-4 text-left">Size</th>
                            <th className="py-4 text-left">Waist</th>
                            <th className="py-4 text-left">Length</th>
                            <th className="py-4 text-left">Thigh</th>
                            <th className="py-4 text-left">Opening</th>
                         </tr>
                      </thead>
                      <tbody className="text-[#f0ead6]">
                         <tr className="border-b border-[#141414]">
                            <td className="py-4">S</td>
                            <td className="py-4">28-30</td>
                            <td className="py-4">40</td>
                            <td className="py-4">12.5</td>
                            <td className="py-4">9.5</td>
                         </tr>
                         <tr className="border-b border-[#141414]">
                            <td className="py-4">M</td>
                            <td className="py-4">30-32</td>
                            <td className="py-4">41</td>
                            <td className="py-4">13</td>
                            <td className="py-4">10</td>
                         </tr>
                         <tr className="border-b border-[#141414]">
                            <td className="py-4">L</td>
                            <td className="py-4">32-34</td>
                            <td className="py-4">42</td>
                            <td className="py-4">13.5</td>
                            <td className="py-4">10.5</td>
                         </tr>
                         <tr>
                            <td className="py-4">XL</td>
                            <td className="py-4">34-36</td>
                            <td className="py-4">42</td>
                            <td className="py-4">14</td>
                            <td className="py-4">11</td>
                         </tr>
                      </tbody>
                   </table>
                </div>
             </div>

             <div className="p-6 bg-[#c8922a10] border border-[#c8922a30]">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#c8922a] mb-2">Atelier Note</p>
                <p className="text-[10px] font-bold text-[#6a5a40] leading-relaxed">
                  Our fits are intentionally oversized. If you prefer a more tailored look, we recommend sizing down. For the signature Variety Vista silhouette, stay true to your waist measurement.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
