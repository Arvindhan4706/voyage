"use client";

import { motion } from "framer-motion";
import { TrendingUp, Award, Map, Sun } from "lucide-react";

export default function InsightsDashboard() {
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Real-Time <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-aurora-green">Insights Dashboard</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Monitor global travel trends and AI confidence scores dynamically.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Trend Graph Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="col-span-1 md:col-span-2 glass-panel p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2"><TrendingUp className="text-cyan-400" /> Travel Trends</h3>
            <span className="text-green-400 text-sm font-bold">+14% this month</span>
          </div>
          <div className="h-48 flex items-end gap-2">
            {[40, 60, 45, 80, 55, 90, 70, 100].map((height, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${height}%` }}
                transition={{ duration: 1, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex-1 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
              />
            ))}
          </div>
        </motion.div>

        {/* Top Destinations */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Award className="text-purple-400" /> Top Destinations</h3>
          <ul className="space-y-4">
            <li className="flex justify-between text-gray-300 border-b border-white/10 pb-2"><span>1. Bali</span><span className="text-cyan-400">98% Match</span></li>
            <li className="flex justify-between text-gray-300 border-b border-white/10 pb-2"><span>2. Tokyo</span><span className="text-cyan-400">94% Match</span></li>
            <li className="flex justify-between text-gray-300 border-b border-white/10 pb-2"><span>3. Paris</span><span className="text-cyan-400">91% Match</span></li>
            <li className="flex justify-between text-gray-300"><span>4. Dubai</span><span className="text-cyan-400">89% Match</span></li>
          </ul>
        </motion.div>

        {/* System Health */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="glass-panel p-6 flex flex-col justify-center items-center text-center"
        >
          <h3 className="text-xl font-bold text-white mb-4">AI Confidence Score</h3>
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="60" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
              <motion.circle 
                cx="64" cy="64" r="60" 
                stroke="url(#gradient)" strokeWidth="8" fill="none" 
                strokeDasharray="377" 
                initial={{ strokeDashoffset: 377 }}
                whileInView={{ strokeDashoffset: 377 * 0.02 }} 
                transition={{ duration: 1.5, ease: "easeOut" }}
                viewport={{ once: true }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-3xl font-black text-white">98%</span>
          </div>
          <p className="text-sm text-green-400 mt-4">System Health: Optimal</p>
        </motion.div>
      </div>
    </section>
  );
}
