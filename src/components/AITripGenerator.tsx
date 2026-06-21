"use client";

import { motion } from "framer-motion";
import { Calendar, Users, IndianRupee, MapPin, Settings, Loader2 } from "lucide-react";
import { useState } from "react";

export default function AITripGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null);

  const [source, setSource] = useState("Chennai");
  const [budget, setBudget] = useState("₹25,000");
  const [duration, setDuration] = useState("4 Days (December)");
  const [style, setStyle] = useState("Adventure");

  const handleGenerate = async () => {
    setIsGenerating(true);
    setItinerary(null);
    
    try {
      const res = await fetch("/api/trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, budget, duration, style }),
      });
      
      const data = await res.json();
      setItinerary(data);
    } catch (error) {
      console.error("Failed to generate trip", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black mb-4 flex items-center justify-center gap-3">
          AI Trip <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Planner</span>
        </h2>
        <p className="text-gray-400 text-lg">Powered by NLP, Intent Classification, and LLM Integration.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Input Panel */}
        <div className="glass-panel p-8 lg:col-span-1 border border-cyan-500/30 h-fit">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Settings className="text-cyan-400"/> Your Preferences</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">SOURCE</label>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2">
                <MapPin size={16} className="text-gray-400" />
                <input type="text" value={source} onChange={e => setSource(e.target.value)} className="bg-transparent border-none outline-none text-white w-full text-sm" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">BUDGET</label>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2">
                <IndianRupee size={16} className="text-gray-400" />
                <input type="text" value={budget} onChange={e => setBudget(e.target.value)} className="bg-transparent border-none outline-none text-white w-full text-sm" />
              </div>
            </div>
            
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">DURATION</label>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2">
                <Calendar size={16} className="text-gray-400" />
                <input type="text" value={duration} onChange={e => setDuration(e.target.value)} className="bg-transparent border-none outline-none text-white w-full text-sm" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">STYLE</label>
              <select value={style} onChange={e => setStyle(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg p-2 text-white w-full outline-none text-sm appearance-none cursor-pointer">
                <option>Relaxation</option>
                <option>Adventure</option>
                <option>Culture & Heritage</option>
              </select>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-black text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex justify-center items-center gap-2"
            >
              {isGenerating ? <><Loader2 className="animate-spin" size={18} /> Running Rule Engine...</> : "Generate Itinerary"}
            </button>
          </div>
        </div>

        {/* Output Panel / Loading State */}
        <div className="lg:col-span-2 space-y-6">
          {!itinerary && !isGenerating && (
            <div className="glass-panel p-12 h-full flex flex-col items-center justify-center text-center border-dashed border-2 border-white/10">
              <MapPin size={48} className="text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-400">Ready to Explore?</h3>
              <p className="text-gray-500 text-sm mt-2 max-w-md">Enter your travel details on the left and our NLP engine will generate a complete day-by-day itinerary instantly.</p>
            </div>
          )}

          {isGenerating && (
            <div className="glass-panel p-12 h-full flex flex-col items-center justify-center text-center border-cyan-500/30">
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 border-t-4 border-cyan-400 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-r-4 border-purple-400 rounded-full animate-spin direction-reverse"></div>
                <div className="absolute inset-4 border-b-4 border-emerald-400 rounded-full animate-spin"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Analyzing Millions of Routes...</h3>
              <p className="text-cyan-400 text-sm animate-pulse">Running Collaborative Filtering Models</p>
            </div>
          )}

          {itinerary && !isGenerating && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className="glass-panel p-4 bg-gradient-to-r from-emerald-500/10 to-transparent border-emerald-500/20 flex justify-between items-center">
                <div>
                  <span className="text-xs text-gray-400 font-bold uppercase block">Recommended Destination</span>
                  <span className="text-2xl font-black text-emerald-400">{itinerary.destination}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 font-bold uppercase block">Estimated Budget</span>
                  <span className="text-2xl font-black text-white">{itinerary.estimated_budget}</span>
                </div>
              </div>

              {itinerary.days.map((day: any, idx: number) => {
                const colors = ['border-cyan-400', 'border-purple-400', 'border-orange-400', 'border-emerald-400'];
                const textColors = ['text-cyan-400', 'text-purple-400', 'text-orange-400', 'text-emerald-400'];
                const c = colors[idx % 4];
                const tc = textColors[idx % 4];

                return (
                  <motion.div key={idx} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className={`glass-panel p-6 border-l-4 ${c}`}>
                    <h4 className="text-2xl font-black mb-4">Day {day.day}: <span className={`${tc} text-lg`}>{day.title}</span></h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {day.morning && (
                        <div className="bg-white/5 p-4 rounded-lg flex items-center justify-between">
                          <div><span className="text-xs text-gray-400 block">Morning</span> <strong className="text-sm">{day.morning}</strong></div>
                        </div>
                      )}
                      {day.afternoon && (
                        <div className="bg-white/5 p-4 rounded-lg flex items-center justify-between">
                          <div><span className="text-xs text-gray-400 block">Afternoon</span> <strong className="text-sm">{day.afternoon}</strong></div>
                        </div>
                      )}
                      {day.evening && (
                        <div className="bg-white/5 p-4 rounded-lg flex items-center justify-between">
                          <div><span className="text-xs text-gray-400 block">Evening</span> <strong className="text-sm">{day.evening}</strong></div>
                        </div>
                      )}
                      {day.full_day && (
                        <div className="bg-white/5 p-4 rounded-lg flex items-center justify-between col-span-1 md:col-span-2">
                          <div><span className="text-xs text-gray-400 block">Full Day</span> <strong className="text-sm">{day.full_day}</strong></div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* Auto Export Tools */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex justify-end gap-3 mt-6">
                <button className="flex items-center gap-2 bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 border border-white/10 hover:border-red-500/50 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                  PDF Export
                </button>
                <button className="flex items-center gap-2 bg-white/5 hover:bg-green-500/20 text-gray-300 hover:text-green-400 border border-white/10 hover:border-green-500/50 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                  Excel Export
                </button>
                <button className="flex items-center gap-2 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 border border-cyan-500/30 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                  <Calendar size={16} /> Sync Calendar
                </button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
