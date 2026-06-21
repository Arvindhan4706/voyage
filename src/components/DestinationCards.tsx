"use client";

import { motion } from "framer-motion";
import { Sparkles, MapPin, IndianRupee, History, Network, ArrowRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function DestinationCards() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tagsInput, setTagsInput] = useState("Beach, Nature, Budget");

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setHasFetched(true);
    const tagsArray = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history_tags: tagsArray }),
      });
      const data = await res.json();
      setRecommendations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black mb-4 flex items-center justify-center gap-3">
          Recommendation <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Engine</span> <Sparkles className="text-cyan-400" />
        </h2>
        <p className="text-gray-400 text-lg">Hybrid ML Pipeline: Content-Based + Collaborative Filtering</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* ML Input Panel */}
        <div className="lg:col-span-1 glass-panel p-6 border-l-4 border-purple-500 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white flex items-center gap-2 mb-4"><History className="text-purple-400"/> User History</h3>
            <p className="text-xs text-gray-400 mb-3">Enter your preferences to feed the ML model (comma separated):</p>
            <textarea 
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-gray-300 outline-none focus:border-purple-500/50 resize-none"
              rows={3}
              placeholder="e.g. Beach, Europe, Luxury, Wildlife"
            />
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="font-bold text-white flex items-center gap-2 mb-4"><Network className="text-cyan-400"/> Models Used</h3>
            <div className="space-y-2 text-xs text-gray-400 mb-6">
              <p><strong className="text-cyan-400">Content Based:</strong> Matches Budget, Interests, Season.</p>
              <p><strong className="text-purple-400">Collaborative:</strong> Matches Similar Users, Historical Trips.</p>
              <p><strong className="text-emerald-400">Hybrid Recommender:</strong> Final fusion score.</p>
            </div>

            <button 
              onClick={fetchRecommendations}
              disabled={isLoading}
              className="w-full py-3 bg-purple-500/20 border border-purple-500/50 rounded-lg text-purple-400 font-bold hover:bg-purple-500/40 transition-colors flex justify-center items-center gap-2"
            >
              {isLoading ? <><Loader2 size={16} className="animate-spin"/> Fusing Models...</> : "Run Inference"}
            </button>
          </div>
        </div>

        {/* Output Grid */}
        <div className="lg:col-span-3">
          {!hasFetched && (
            <div className="h-full flex items-center justify-center glass-panel border-dashed border-2 border-white/10">
              <p className="text-gray-500 font-bold">Run Inference to see generated recommendations</p>
            </div>
          )}

          {isLoading && (
            <div className="h-full flex items-center justify-center glass-panel border-purple-500/30">
              <Loader2 size={48} className="text-purple-400 animate-spin" />
            </div>
          )}

          {recommendations.length > 0 && !isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-panel overflow-hidden group cursor-pointer flex"
                >
                  <div className="w-2/5 relative">
                    <img src={rec.image} alt={rec.destination} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050816] z-10"></div>
                  </div>
                  
                  <div className="w-3/5 p-4 flex flex-col justify-center relative z-20">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-black text-white flex items-center gap-1">
                        {rec.destination}
                      </h3>
                      <div className="bg-black/60 border border-cyan-500/50 text-cyan-400 px-2 py-1 rounded text-xs font-black">
                        {rec.matchScore}% Match
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <IndianRupee size={14} className="text-green-400" />
                      <span className="font-bold text-gray-300 text-sm">{rec.cost}</span>
                    </div>

                    <div className="flex gap-2 mb-4">
                      {rec.tags.map((t: string) => (
                        <span key={t} className="text-[10px] uppercase font-bold text-gray-400 bg-white/5 px-2 py-1 rounded">{t}</span>
                      ))}
                    </div>

                    <button className="flex items-center gap-2 text-cyan-400 text-sm font-bold hover:text-cyan-300 transition-colors">
                      View Smart Itinerary <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
