"use client";

import { motion } from "framer-motion";
import { BrainCircuit, TrendingDown, Map, CloudSun } from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Recommendations",
    desc: "Personalized itineraries built using deep learning and user behavior analysis.",
    color: "text-cyan-400"
  },
  {
    icon: TrendingDown,
    title: "Price Prediction",
    desc: "ML models predict flight and hotel prices to tell you exactly when to book.",
    color: "text-purple-400"
  },
  {
    icon: Map,
    title: "Smart Itinerary",
    desc: "Dynamic day-by-day generation of places, hotels, and local food spots.",
    color: "text-blue-400"
  },
  {
    icon: CloudSun,
    title: "Real-time Weather",
    desc: "Routes optimized based on live weather data and historical climate patterns.",
    color: "text-emerald-400"
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black mb-4">Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">TravelGPT</span></h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">Our proprietary machine learning engine completely rethinks how you plan, book, and experience travel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feat, index) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel p-8 group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors ${feat.color}`}>
                <Icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{feat.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
