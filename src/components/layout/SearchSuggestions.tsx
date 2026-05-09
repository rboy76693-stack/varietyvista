'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function SearchSuggestions() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${query}`);
        const data = await res.json();
        setResults(data);
        setIsOpen(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3a3020]" />
        <input 
          type="text" 
          placeholder="SEARCH VISTA..."
          className="bg-transparent border-b border-[#1e1e1e] pl-10 pr-4 py-2 text-[10px] font-black tracking-widest text-[#f0ead6] outline-none focus:border-[#c8922a] w-32 md:w-48 transition-all focus:w-64"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-0 top-1/2 -translate-y-1/2 p-1">
             <X className="w-3 h-3 text-[#3a3020]" />
          </button>
        )}
      </div>

      {isOpen && (results.length > 0 || loading) && (
        <div 
          className="absolute top-full right-0 mt-4 w-80 bg-[#0d0d0d] border border-[#1e1e1e] shadow-2xl rounded-sm overflow-hidden z-[100]"
        >
          <div className="p-4 border-b border-[#1e1e1e] flex justify-between items-center bg-[#0f0f0f]">
             <span className="text-[9px] font-black uppercase tracking-widest text-[#c8922a]">Product Suggestions</span>
             {loading && <Loader2 className="w-3 h-3 animate-spin text-[#c8922a]" />}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
             {results.map((product) => (
               <Link 
                 key={product.id} 
                 href={`/product/${product.id}`}
                 onClick={() => { setIsOpen(false); setQuery(''); }}
                 className="flex gap-4 p-4 hover:bg-[#111] transition-colors border-b border-[#141414] last:border-0"
               >
                  <div className="w-12 h-16 bg-[#1a1a1a] rounded shrink-0 overflow-hidden relative">
                     {product.image_url ? (
                        <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                     ) : (
                        <ShoppingBag className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />
                     )}
                  </div>
                  <div className="flex flex-col justify-center">
                     <h4 className="text-[10px] font-black uppercase tracking-wide text-[#f0ead6] leading-tight mb-1">{product.name}</h4>
                     <p className="text-[9px] font-bold text-[#c8922a]">₹{Number(product.price_inr).toLocaleString('en-IN')}</p>
                     <p className="text-[8px] text-[#3a3020] uppercase mt-1">SKU: {product.sku}</p>
                  </div>
               </Link>
             ))}

             {!loading && query.length >= 2 && results.length === 0 && (
               <div className="p-8 text-center space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#3a3020]">No results found for "{query}"</p>
                  <Link href="/shop" onClick={() => setIsOpen(false)} className="inline-block text-[9px] font-bold text-[#c8922a] border-b border-[#c8922a] pb-0.5">Explore All Jeans</Link>
               </div>
             )}
          </div>
          
          <Link 
            href="/shop"
            onClick={() => setIsOpen(false)}
            className="block p-3 text-center text-[9px] font-black uppercase tracking-[0.2em] text-[#5a4a30] bg-[#0a0a0a] hover:text-[#c8922a] transition-colors"
          >
             View All Products
          </Link>
        </div>
      )}
    </div>
  );
}
