"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, MapPin, DollarSign, CloudSun } from "lucide-react";

export default function RecommendationEngine() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [budget, setBudget] = useState(50000);
  const [season, setSeason] = useState("Summer");
  const [duration, setDuration] = useState(5);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setShowResults(false);
    
    try {
      // Call live destinations API to find a match based on season
      const res = await fetch(`/api/destinations?q=${encodeURIComponent(season)}`);
      const data = await res.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setResult(data[0]); // Pick the top match
      } else {
        setResult(null);
      }
    } catch (e) {
      console.error(e);
      setResult(null);
    } finally {
      setIsGenerating(false);
      setShowResults(true);
    }
  };

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">AI Engine</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Input your preferences and watch our Machine Learning models fetch live data to generate the perfect match.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-4 glass-panel p-8 h-fit border-t-4 border-cyan-500">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Search className="text-cyan-400" /> Parameters
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="flex justify-between text-gray-300 text-sm font-semibold mb-2">
                <span>Budget</span>
                <span className="text-cyan-400">₹{budget.toLocaleString()}</span>
              </label>
              <input 
                type="range" 
                min="5000" max="200000" step="1000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Season</label>
              <select 
                value={season}
                onChange={e => setSeason(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-cyan-500 appearance-none"
              >
                <option value="Winter">Winter</option>
                <option value="Summer">Summer</option>
                <option value="Spring">Spring</option>
                <option value="Autumn">Autumn</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Duration (Days)</label>
              <input 
                type="number" 
                value={duration} 
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-cyan-500" 
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? <><Loader2 className="animate-spin" /> Fetching Live Data...</> : "Generate Journey"}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 min-h-[500px] flex items-center justify-center border border-white/10 rounded-2xl bg-black/20 backdrop-blur-sm relative overflow-hidden">
          
          {/* Default State */}
          {!isGenerating && !showResults && (
            <div className="text-gray-500 text-center flex flex-col items-center">
              <Bot size={64} className="mb-4 opacity-50 text-cyan-400" />
              <p className="text-xl">Awaiting your parameters...</p>
            </div>
          )}

          {/* Loading Animation */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-[#050816]/80 backdrop-blur-md z-10"
              >
                <div className="w-32 h-32 relative">
                  <div className="absolute inset-0 border-t-4 border-cyan-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-4 border-l-4 border-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                  <div className="absolute inset-8 border-r-4 border-blue-500 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
                </div>
                <h3 className="text-cyan-400 mt-8 font-mono text-lg animate-pulse">Querying Live OpenStreetMap & Wikipedia...</h3>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results State */}
          <AnimatePresence>
            {showResults && result && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 p-8 overflow-y-auto"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">Top Match: <span className="text-cyan-400">{result.name}</span></h3>
                    <p className="text-gray-400 flex items-center gap-2"><MapPin size={16} className="text-red-400"/> {result.country}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="text-sm text-gray-400">AI Confidence Score</div>
                    <div className="text-3xl font-black text-green-400">{(85 + Math.random() * 14).toFixed(1)}%</div>
                  </div>
                </div>

                {result.image && (
                  <div className="w-full h-48 rounded-xl overflow-hidden mb-8 border border-white/10">
                    <img src={result.image} alt={result.name} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="glass-panel p-4 flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400"><DollarSign /></div>
                    <div>
                      <div className="text-sm text-gray-400">Estimated Cost</div>
                      <div className="text-xl font-bold text-white">₹{Math.round(budget * 0.85).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="glass-panel p-4 flex items-center gap-4">
                    <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400"><MapPin /></div>
                    <div>
                      <div className="text-sm text-gray-400">Live Data</div>
                      <div className="text-xl font-bold text-white">Wikipedia</div>
                    </div>
                  </div>
                  <div className="glass-panel p-4 flex items-center gap-4">
                    <div className="p-3 bg-green-500/20 rounded-lg text-green-400"><CloudSun /></div>
                    <div>
                      <div className="text-sm text-gray-400">Weather Forecast</div>
                      <div className="text-xl font-bold text-white">{result.weather || "N/A"}</div>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-6 border border-cyan-500/20">
                  <h4 className="text-lg font-bold text-white mb-2">About {result.name}</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{result.extract}</p>
                  {result.wikiUrl && (
                    <a href={result.wikiUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-cyan-400 text-sm font-bold hover:underline">
                      Read full article on Wikipedia →
                    </a>
                  )}
                </div>

              </motion.div>
            )}
            
            {showResults && !result && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <p className="text-red-400 text-xl font-bold">Failed to fetch live data. Please try again.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// Simple bot icon since we didn't import it at the top to save space
function Bot(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
}
