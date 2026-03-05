import { Outlet } from "react-router";
import { motion } from "motion/react";

export function Layout() {
  return (
    <div className="relative min-h-screen w-full font-sans text-zinc-900 overflow-hidden bg-[#eaf2f8] selection:bg-black/10">
      
      {/* Pure CSS Ethereal Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Soft radial gradients to simulate a bright, airy sky */}
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-white via-sky-100/80 to-transparent blur-[120px] opacity-80" />
        <div className="absolute bottom-[-10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-indigo-100/60 via-blue-50/40 to-transparent blur-[100px]" />
        <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] rounded-full bg-blue-100/30 blur-[80px]" />
        
        {/* Very subtle noise texture for a premium feel (optional, keeps it from looking flat) */}
        <div 
          className="absolute inset-0 opacity-[0.2] mix-blend-overlay"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1770745560263-a8fc696de90b?q=80&w=1080')`,
            backgroundSize: 'cover'
          }}
        />
      </div>
      
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 w-full p-4 z-50 flex justify-between items-center pointer-events-auto">
        <div className="flex items-center gap-4">
          <div className="font-serif font-bold text-xl tracking-tight">Astro Wealth</div>
          <div className="text-sm font-medium opacity-70">A new place for astrology</div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-4 sm:px-6 pointer-events-none">
        <div className="pointer-events-auto w-full">
          <Outlet />
        </div>
      </main>
      
    </div>
  );
}
