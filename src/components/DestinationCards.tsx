"use client";

import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { Star } from "lucide-react";

export default function DestinationCards() {
  const t = useTranslations('Destinations');
  const destinations = [
    {
      id: 1,
      destination: "Maldives",
      country: "South Asia",
      image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800",
      rating: 4.9,
      price: "₹45,000"
    },
    {
      id: 2,
      destination: "Kyoto",
      country: "Japan",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800",
      rating: 4.8,
      price: "₹65,000"
    },
    {
      id: 3,
      destination: "Santorini",
      country: "Greece",
      image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&q=80&w=800",
      rating: 4.7,
      price: "₹85,000"
    },
    {
      id: 4,
      destination: "Bali",
      country: "Indonesia",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800",
      rating: 4.9,
      price: "₹35,000"
    }
  ];

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
        {destinations.map((rec, index) => (
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
                src={rec.image} 
                alt={rec.destination} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
              />
              <div className="absolute top-4 right-4 bg-[#faf9f6]/90 dark:bg-[#18181b]/90 backdrop-blur-md px-3 py-1.5 text-[10px] font-medium flex items-center gap-1.5 shadow-sm text-[#222222] dark:text-[#faf9f6] tracking-widest">
                <Star size={10} className="fill-[#D4AF37] text-[#D4AF37]" /> {rec.rating}
              </div>
            </div>
            
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-serif text-2xl text-[#222222] dark:text-[#faf9f6] mb-1 group-hover:text-[#D4AF37] transition-colors">{rec.destination}</h3>
                <p className="text-[#888888] dark:text-[#a3a3a3] text-[11px] tracking-widest uppercase">
                  {rec.country}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] tracking-widest text-[#888888] dark:text-[#a3a3a3] uppercase mb-1">{t("from")}</p>
                <p className="font-medium text-[#222222] dark:text-[#faf9f6]">{rec.price}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
