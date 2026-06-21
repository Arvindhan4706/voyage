"use client";

import { motion } from "framer-motion";
import { PieChart, Zap, TrendingDown, Info, ShieldAlert } from "lucide-react";

export default function SmartBudgetOptimizer() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black mb-4 flex items-center justify-center gap-3">
          Smart Budget <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">Optimizer</span> <PieChart className="text-emerald-400" size={40} />
        </h2>
        <p className="text-gray-400 text-lg">AI-driven cost analysis and money-saving predictions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Cost Breakdown */}
        <div className="glass-panel p-8">
          <h3 className="text-2xl font-black mb-8 border-b border-white/10 pb-4">Estimated Total: <span className="text-emerald-400">₹42,500</span></h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-bold text-gray-300 mb-2">
                <span>Transportation</span>
                <span>₹12,000</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold text-gray-300 mb-2">
                <span>Hotels & Accommodation</span>
                <span>₹18,000</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3">
                <div className="bg-purple-500 h-3 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold text-gray-300 mb-2">
                <span>Food & Dining</span>
                <span>₹7,500</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3">
                <div className="bg-orange-500 h-3 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold text-gray-300 mb-2">
                <span>Activities</span>
                <span>₹3,000</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3">
                <div className="bg-cyan-500 h-3 rounded-full" style={{ width: '7%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold text-gray-300 mb-2 items-center">
                <span className="flex items-center gap-1">Emergency Buffer <Info size={14} className="text-gray-500" /></span>
                <span>₹2,000</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3 p-[1px] border border-dashed border-red-500/50">
                <div className="bg-red-500/50 h-[10px] rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Suggestions Panel */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6 bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/30">
            <h4 className="text-lg font-black text-emerald-400 mb-4 flex items-center gap-2"><Zap /> AI Cost-Saving Alerts</h4>
            
            <div className="space-y-4">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-black/40 border border-emerald-500/20 p-4 rounded-xl flex items-start gap-4 cursor-pointer"
              >
                <div className="bg-emerald-500/20 p-2 rounded-lg mt-1"><TrendingDown className="text-emerald-400" size={18} /></div>
                <div>
                  <h5 className="font-bold text-white text-sm mb-1">Switching hotel saves ₹2,300</h5>
                  <p className="text-xs text-gray-400">The "Seabreeze Resort" has dropped rates for your dates. It's 5 mins away from your current choice.</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-black/40 border border-emerald-500/20 p-4 rounded-xl flex items-start gap-4 cursor-pointer"
              >
                <div className="bg-emerald-500/20 p-2 rounded-lg mt-1"><Calendar size={18} className="text-emerald-400" /></div>
                <div>
                  <h5 className="font-bold text-white text-sm mb-1">Traveling next week saves ₹4,100</h5>
                  <p className="text-xs text-gray-400">Flight prices drop significantly if you delay your departure by exactly 6 days.</p>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="glass-panel p-6 bg-gradient-to-br from-red-500/5 to-transparent border-red-500/20 mt-auto">
            <div className="flex items-center gap-3">
              <ShieldAlert className="text-red-400" size={24} />
              <div>
                <h5 className="font-bold text-white text-sm">Surge Pricing Warning</h5>
                <p className="text-xs text-gray-400">Cab fares at your destination are expected to be 20% higher due to a local festival.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// Temporary import for the Calendar icon since it wasn't at the top
import { Calendar } from "lucide-react";
