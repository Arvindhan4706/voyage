"use client";

import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { Mountain, Waves, Flame, Utensils, Camera, Car, PawPrint, User, Users, Briefcase, Heart, TreePine } from "lucide-react";

const categories = [
  { name: "Adventure", icon: Flame },
  { name: "Luxury", icon: Heart },
  { name: "Beach", icon: Waves },
  { name: "Nature", icon: TreePine },
  { name: "Spiritual", icon: Mountain },
  { name: "Culinary", icon: Utensils },
  { name: "Photography", icon: Camera },
  { name: "Road Trips", icon: Car },
  { name: "Wildlife", icon: PawPrint },
  { name: "Solo Travel", icon: User },
  { name: "Family", icon: Users },
  { name: "Business", icon: Briefcase },
];

export default function TravelCategories() {
  const t = useTranslations('Categories');
  return (
    <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 border-t border-[#eaeaea] dark:border-[#333333]">
      <div className="text-center mb-16">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#888888] dark:text-[#a3a3a3] font-medium mb-3">{t("subtitle")}</p>
        <h2 className="text-4xl md:text-5xl font-serif text-[#222222] dark:text-[#faf9f6] mb-4">{t("title")}</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12">
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center gap-4 group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-[#faf9f6] dark:bg-[#18181b] border border-[#eaeaea] dark:border-[#333333] flex items-center justify-center group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37]/5 transition-all duration-500">
                <Icon size={22} className="text-[#222222] dark:text-[#faf9f6] group-hover:text-[#D4AF37] transition-colors duration-500" strokeWidth={1} />
              </div>
              <span className="text-[11px] tracking-widest uppercase font-medium text-[#888888] dark:text-[#a3a3a3] group-hover:text-[#222222] dark:group-hover:text-[#faf9f6] text-center transition-colors duration-500">{cat.name}</span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
