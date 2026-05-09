'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AIChatModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Welcome to the Vista. I am your personal denim concierge. How can I assist your style journey today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    // Simulated Professional AI Response (Real-world would use an LLM API)
    setTimeout(() => {
      let aiResponse = "I'm looking into that for you. Our premium denim is crafted with heavyweight cotton and precision fits. Is there a specific fit like 'Baggy' or 'Straight' you'd like to explore?";
      
      if (userMsg.toLowerCase().includes('size')) {
        aiResponse = "For the perfect fit, I recommend checking our Master Size Guide. Most of our streetwear fits are intentionally oversized. Would you like me to open the guide for you?";
      } else if (userMsg.toLowerCase().includes('track') || userMsg.toLowerCase().includes('order')) {
        aiResponse = "You can track your latest Vista drop in the 'My Account' section under 'Orders'. Every shipment includes a real-time tracking timeline.";
      } else if (userMsg.toLowerCase().includes('shipping')) {
        aiResponse = "We offer Free Express Delivery on all orders above ₹999 across India. Standard delivery typically takes 3-5 business days.";
      }

      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={onClose} 
          />
          
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="relative w-full max-w-lg bg-[#0d0d0d] border-t md:border border-[#1e1e1e] flex flex-col shadow-2xl overflow-hidden h-[80vh] md:h-[600px] rounded-t-2xl md:rounded-xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#1e1e1e] flex items-center justify-between bg-[#0f0f0f]">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f5d97a] to-[#c8922a] flex items-center justify-center text-[#0d0d0d]">
                     <Bot className="w-5 h-5" />
                  </div>
                  <div>
                     <h3 className="text-sm font-black uppercase tracking-widest text-[#f0ead6]">Vista Concierge</h3>
                     <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[9px] font-bold text-[#4a4030] uppercase">Online & Ready</span>
                     </div>
                  </div>
               </div>
               <button onClick={onClose} className="p-2 hover:bg-[#1e1e1e] rounded-full transition-colors text-[#5a4a30]">
                  <X className="w-5 h-5" />
               </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6 scroll-smooth">
               {messages.map((msg, i) => (
                 <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-xl text-xs leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-[#c8922a] text-[#0d0d0d] font-bold' 
                        : 'bg-[#111] border border-[#1e1e1e] text-[#a09070]'
                    }`}>
                       {msg.content}
                    </div>
                 </div>
               ))}
               {loading && (
                 <div className="flex justify-start">
                    <div className="bg-[#111] border border-[#1e1e1e] p-4 rounded-xl">
                       <Loader2 className="w-4 h-4 animate-spin text-[#c8922a]" />
                    </div>
                 </div>
               )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-6 bg-[#0a0a0a] border-t border-[#1e1e1e]">
               <div className="relative">
                  <input 
                    type="text"
                    placeholder="Ask about fits, orders, or styling..."
                    className="w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded-full py-4 pl-6 pr-14 text-xs text-[#f0ead6] outline-none focus:border-[#c8922a] transition-all"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#c8922a] flex items-center justify-center text-[#0d0d0d] hover:scale-105 transition-transform"
                  >
                    <Send className="w-4 h-4" />
                  </button>
               </div>
               <p className="text-[8px] text-center mt-4 text-[#3a3020] uppercase font-bold tracking-widest flex items-center justify-center gap-2">
                  <Sparkles className="w-3 h-3" /> Powered by Variety Vista AI
               </p>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
