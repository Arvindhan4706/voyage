"use client";

import { motion } from "framer-motion";
import { Mountain, Waves, Trees, Flame, Utensils, Camera, Car, PawPrint, User, Users, Briefcase, Heart } from "lucide-react";

const categories = [
  { name: "Adventure", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
  { name: "Luxury", icon: Heart, color: "text-pink-500", bg: "bg-pink-500/10" },
  { name: "Beach", icon: Waves, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { name: "Hill Station", icon: Mountain, color: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "Spiritual", icon: Flame, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { name: "Food Tourism", icon: Utensils, color: "text-red-500", bg: "bg-red-500/10" },
  { name: "Photography", icon: Camera, color: "text-purple-500", bg: "bg-purple-500/10" },
  { name: "Road Trips", icon: Car, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { name: "Wildlife", icon: PawPrint, color: "text-green-500", bg: "bg-green-500/10" },
  { name: "Solo Travel", icon: User, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { name: "Family", icon: Users, color: "text-sky-500", bg: "bg-sky-500/10" },
  { name: "Business", icon: Briefcase, color: "text-slate-500", bg: "bg-slate-500/10" },
];

export default function TravelCategories() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black mb-4">Travel <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">Categories</span></h2>
        <p className="text-gray-400 text-lg">Explore curated experiences built for every type of traveler.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="glass-panel p-6 flex flex-col items-center justify-center gap-4 group hover:bg-white/10 cursor-pointer transition-all hover:scale-105"
            >
              <div className={`w-14 h-14 rounded-full ${cat.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={24} className={cat.color} />
              </div>
              <span className="text-sm font-bold text-gray-300 group-hover:text-white text-center">{cat.name}</span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
