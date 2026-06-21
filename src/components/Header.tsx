"use client";

import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import { Mic, Moon, Globe, DollarSign, Bell } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-600 z-[101] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${scrolled ? 'py-3 bg-[#050816]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl' : 'py-5 bg-transparent'}`}
      >
        <div className="max-w-[1400px] mx-auto px-4 xl:px-8 flex items-center relative min-h-[40px]">
          
          {/* Logo */}
          <div className="text-2xl font-extrabold text-white tracking-tighter shrink-0 cursor-pointer">
            Travel<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">AI</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-8 absolute left-1/2 -translate-x-1/2">
            {[
              { name: 'Home', id: '#home' },
              { name: 'Destinations', id: '#destinations' },
              { name: 'Packages', id: '#packages' },
              { name: 'Hotels', id: '#hotels' },
              { name: 'Flights', id: '#flights' },
              { name: 'Experiences', id: '#experiences' },
              { name: 'AI Planner', id: '#ai-planner' },
              { name: 'Community', id: '#community' }
            ].map((link) => (
              <a key={link.name} href={link.id} className="text-[13px] xl:text-sm font-bold text-gray-300 hover:text-cyan-400 transition-colors whitespace-nowrap">
                {link.name}
              </a>
            ))}
          </nav>

          {/* Features / Actions */}
          <div className="flex items-center gap-4 shrink-0 ml-auto">
            {/* Feature Icons */}
            <div className="hidden md:flex items-center gap-3 mr-4 border-r border-white/10 pr-4">
              <button className="text-gray-400 hover:text-cyan-400 transition-colors" title="Voice Search"><Mic size={18} /></button>
              <button className="text-gray-400 hover:text-cyan-400 transition-colors" title="Dark Mode"><Moon size={18} /></button>
              <button className="text-gray-400 hover:text-cyan-400 transition-colors" title="Language"><Globe size={18} /></button>
              <button className="text-gray-400 hover:text-cyan-400 transition-colors" title="Currency"><DollarSign size={18} /></button>
              <button className="text-gray-400 hover:text-cyan-400 transition-colors relative" title="Notifications">
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>

            {/* Profile / Dashboard */}
            <a href="#" className="hidden sm:block text-sm font-bold text-gray-300 hover:text-white transition-colors">Dashboard</a>
            <button className="w-9 h-9 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:scale-110 transition-transform">
              P
            </button>
          </div>
          
        </div>
      </motion.header>
    </>
  );
}
