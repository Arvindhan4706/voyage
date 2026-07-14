"use client";

import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('Hero');
  return (
    <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center mt-0 pt-20">
      {/* Background Image - Darker, Moodier */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-c6a4d142104d?q=80&w=2070&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col items-center text-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold mb-6">
            {t('subtitle')}
          </p>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 tracking-wide drop-shadow-md font-medium">
            {t('title')}
          </h1>
          <p className="text-sm md:text-base text-white/80 mb-10 drop-shadow-md tracking-[0.1em] uppercase">
            {t('description')}
          </p>
        </motion.div>
        
      </div>
    </section>
  );
}
