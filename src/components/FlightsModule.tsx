"use client";

import { motion } from "framer-motion";
import { TrendingUp, BellRing, Plane, LineChart, Cpu } from "lucide-react";

export default function FlightsModule() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 flex items-center gap-3">
            Price <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">Prediction</span> <Plane className="text-cyan-400" size={40} />
          </h2>
          <p className="text-gray-400 text-lg">Predicting Flight, Hotel, and Package prices using advanced ML models.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Price Prediction Graph (Simulated) */}
        <div className="glass-panel p-8 lg:col-span-2 relative overflow-hidden group">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-black text-white flex items-center gap-2"><LineChart className="text-cyan-400" /> Delhi → Bali (Flight)</h3>
              <p className="text-gray-400 text-sm flex gap-2 mt-2">
                <span className="bg-white/10 px-2 py-1 rounded text-[10px] font-bold">XGBoost</span>
                <span className="bg-white/10 px-2 py-1 rounded text-[10px] font-bold">Random Forest</span>
                <span className="bg-white/10 px-2 py-1 rounded text-[10px] font-bold">LightGBM</span>
                <span className="bg-white/10 px-2 py-1 rounded text-[10px] font-bold">LSTM</span>
              </p>
            </div>
            <div className="text-right">
              <span className="block text-xs text-cyan-400 font-bold uppercase tracking-wider">Buy Recommendation</span>
              <span className="text-xl font-black text-white px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg mt-2 inline-block">Book Now</span>
            </div>
          </div>

          {/* Graph Visualization */}
          <div className="relative h-64 w-full flex items-end justify-between px-4 pb-8 border-b border-l border-white/20">
            {/* Y Axis Labels */}
            <div className="absolute left-0 bottom-8 h-full flex flex-col justify-between text-xs text-gray-500 -ml-12">
              <span>₹12k</span>
              <span>₹10k</span>
              <span>₹8k</span>
              <span>₹6k</span>
            </div>

            {/* Simulated Data Points (Historical) */}
            <div className="w-[10%] bg-blue-500/20 h-[50%] rounded-t-sm relative group-hover:bg-blue-500/40 transition-colors"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">₹7k</span></div>
            <div className="w-[10%] bg-blue-500/20 h-[55%] rounded-t-sm relative group-hover:bg-blue-500/40 transition-colors"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">₹7.2k</span></div>
            <div className="w-[10%] bg-blue-500/40 h-[65%] rounded-t-sm relative group-hover:bg-blue-500/60 transition-colors"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">₹7.8k</span></div>
            
            {/* Today */}
            <div className="w-[10%] bg-cyan-500/60 h-[75%] rounded-t-sm relative group-hover:bg-cyan-500/80 transition-colors">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-cyan-500 text-black text-xs font-bold px-2 py-1 rounded shadow-[0_0_15px_rgba(6,182,212,0.6)] whitespace-nowrap z-10 flex flex-col items-center">
                <span>Current</span>
                <span>₹8,200</span>
              </div>
            </div>
            
            {/* Simulated Data Points (Predicted) */}
            <div className="w-[10%] border border-dashed border-red-500/50 h-[85%] rounded-t-sm relative bg-red-500/10 group-hover:bg-red-500/20 transition-colors"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">₹8.9k</span></div>
            <div className="w-[10%] border border-dashed border-red-500/50 h-[95%] rounded-t-sm relative bg-red-500/30 group-hover:bg-red-500/50 transition-colors">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap z-10 flex flex-col items-center">
                <span>In 5 Days</span>
                <span>₹9,800</span>
              </div>
            </div>
            <div className="w-[10%] border border-dashed border-red-500/50 h-[100%] rounded-t-sm relative bg-red-500/10 group-hover:bg-red-500/20 transition-colors"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">₹10.5k</span></div>

            {/* X Axis Labels */}
            <div className="absolute bottom-2 left-0 w-full flex justify-between text-xs text-gray-500 px-4">
              <span>Past</span>
              <span></span>
              <span></span>
              <span className="text-cyan-400 font-bold">Today</span>
              <span></span>
              <span className="text-red-400 font-bold">+5 Days</span>
              <span>Future</span>
            </div>
          </div>
        </div>

        {/* Fare Alerts & Info */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6 border-red-500/30">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4 text-red-400">
              <TrendingUp size={24} />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Price Surge Warning</h4>
            <p className="text-gray-400 text-sm mb-4">Our ensemble ML model predicts prices will surge from <strong>₹8,200</strong> to <strong>₹9,800</strong> in the next 5 days.</p>
            <div className="bg-black/30 p-3 rounded-lg border border-white/10 text-xs font-bold text-red-400 flex items-center justify-between">
              Confidence Score <span className="flex items-center gap-1"><Cpu size={14}/> 96%</span>
            </div>
          </div>

          <div className="glass-panel p-6 bg-gradient-to-br from-blue-600/20 to-transparent border-blue-500/30 mt-auto">
            <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><BellRing size={18} className="text-blue-400" /> Smart Fare Alerts</h4>
            <p className="text-xs text-gray-400 mb-4">Get instantly notified via WhatsApp or Email before the predicted price surge hits.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Enter email..." className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none" />
              <button className="bg-blue-500 text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">Alert Me</button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
