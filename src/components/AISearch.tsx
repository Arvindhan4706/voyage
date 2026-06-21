"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function AISearch() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!query) return;
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto -mt-24 relative z-30 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="glass-panel p-2 flex items-center gap-2"
      >
        <div className="bg-white/5 p-4 rounded-xl hidden md:flex">
          <Sparkles className="text-cyan-400" size={24} />
        </div>
        
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Plan a 4-day beach trip from Chennai under ₹15,000"
          className="flex-1 bg-transparent border-none outline-none text-white text-lg md:text-xl placeholder:text-gray-500 px-4"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />

        <button 
          onClick={handleSearch}
          disabled={isSearching}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 rounded-xl font-bold text-white flex items-center gap-2 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all min-w-[140px] justify-center"
        >
          {isSearching ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <Sparkles size={20} />
            </motion.div>
          ) : (
            <>
              Generate <ArrowRight size={20} />
            </>
          )}
        </button>
      </motion.div>

      {/* Suggested Chips */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex flex-wrap justify-center gap-3 mt-6"
      >
        {["Suggest a hill station near Chennai", "Luxury honeymoon in Maldives", "Backpacking across Europe"].map((chip) => (
          <span 
            key={chip} 
            onClick={() => setQuery(chip)}
            className="text-xs md:text-sm px-4 py-2 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 cursor-pointer transition-colors"
          >
            {chip}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
