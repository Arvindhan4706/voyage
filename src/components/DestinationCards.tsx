"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { Star } from "lucide-react";

export default function DestinationCards() {
  const t = useTranslations('Destinations');
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/destinations?q=luxury")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setDestinations(data.slice(0, 4));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#888888] dark:text-[#a3a3a3] font-medium mb-3">{t("subtitle")}</p>
          <h2 className="text-4xl md:text-5xl font-serif text-[#222222] dark:text-[#faf9f6]">{t("title")}</h2>
        </div>
        <button className="text-[11px] tracking-[0.1em] uppercase text-[#222222] dark:text-[#faf9f6] font-semibold hover:text-[#D4AF37] dark:hover:text-[#D4AF37] transition-colors border-b border-[#222222] dark:border-[#faf9f6] hover:border-[#D4AF37] dark:hover:border-[#D4AF37] pb-1">{t("explore")}</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse flex flex-col">
              <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-[#eaeaea] dark:bg-[#333]" />
              <div className="h-6 bg-[#eaeaea] dark:bg-[#333] w-3/4 mb-2" />
              <div className="h-4 bg-[#eaeaea] dark:bg-[#333] w-1/2" />
            </div>
          ))
        ) : (
          destinations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-[#faf9f6] dark:bg-[#18181b]">
                <img 
                  src={rec.image || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80"} 
                  alt={rec.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
                />
                <div className="absolute top-4 right-4 bg-[#faf9f6]/90 dark:bg-[#18181b]/90 backdrop-blur-md px-3 py-1.5 text-[10px] font-medium flex items-center gap-1.5 shadow-sm text-[#222222] dark:text-[#faf9f6] tracking-widest">
                  <Star size={10} className="fill-[#D4AF37] text-[#D4AF37]" /> {rec.ratings?.toFixed(1) || "4.8"}
                </div>
              </div>
              
              <div className="flex justify-between items-start">
                <div className="pr-2">
                  <h3 className="font-serif text-2xl text-[#222222] dark:text-[#faf9f6] mb-1 group-hover:text-[#D4AF37] transition-colors truncate max-w-[150px]">{rec.name}</h3>
                  <p className="text-[#888888] dark:text-[#a3a3a3] text-[11px] tracking-widest uppercase truncate max-w-[150px]">
                    {rec.country}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] tracking-widest text-[#888888] dark:text-[#a3a3a3] uppercase mb-1">{t("from")}</p>
                  <p className="font-medium text-[#222222] dark:text-[#faf9f6]">₹{(Math.floor(Math.random() * 40) + 20)},000</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
