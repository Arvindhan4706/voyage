"use client";

import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { Search } from "lucide-react";
import { useState } from "react";

export default function AISearch() {
  const t = useTranslations('Search');
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    const el = document.getElementById("destinations");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full max-w-4xl mx-auto -mt-10 relative z-30 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="bg-[#faf9f6]/90 dark:bg-[#18181b]/90 backdrop-blur-md rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-[#eaeaea] dark:border-[#333333] p-2"
      >
        <form onSubmit={handleSearch} className="flex items-center w-full">
          <div className="pl-6 pr-4 text-[#D4AF37]">
            <Search size={20} strokeWidth={1.5} />
          </div>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("placeholder")} 
            className="flex-1 bg-transparent border-none outline-none text-[#2a2a2a] dark:text-[#faf9f6] text-lg font-serif placeholder:text-[#888888] dark:text-[#a3a3a3] placeholder:font-sans placeholder:text-sm py-3"
          />
          <button 
            type="submit"
            className="bg-[#222222] dark:bg-[#faf9f6] dark:bg-[#18181b] hover:bg-[#D4AF37] dark:hover:bg-[#D4AF37] text-white dark:text-[#222222] dark:text-[#faf9f6] text-[10px] tracking-[0.2em] uppercase font-semibold px-10 py-4 rounded-full transition-all duration-500"
          >{t("button")}</button>
        </form>
      </motion.div>
    </div>
  );
}
