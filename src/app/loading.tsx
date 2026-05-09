export default function Loading() {
  return (
    <div className="fixed inset-0 z-[300] bg-[#0d0d0d] flex flex-col items-center justify-center gap-8">
      <div className="relative">
         {/* Luxury Animated Logo Loader */}
         <div className="w-24 h-24 border border-[#1e1e1e] rounded-full animate-pulse" />
         <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-t-[#c8922a] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
         </div>
         <div className="absolute inset-0 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
               <circle cx="18" cy="18" r="5" fill="#c8922a" />
            </svg>
         </div>
      </div>
      <div className="space-y-2 text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.8em] text-[#c8922a] animate-pulse">Variety Vista</p>
         <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#3a3020]">Entering the Vista...</p>
      </div>
    </div>
  );
}
