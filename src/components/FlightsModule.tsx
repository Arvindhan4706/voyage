"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, BellRing, Plane, LineChart, Cpu, MapPin, Loader2 } from "lucide-react";
import { useState } from "react";

export default function FlightsModule() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);

  const handlePredict = async () => {
    if (!source || !destination) {
      alert("Please enter both source and destination.");
      return;
    }

    setIsPredicting(true);
    setPrediction(null);

    try {
      const res = await fetch("/api/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, destination, dates: new Date().toISOString() })
      });
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);
      setPrediction(data);
    } catch (e) {
      console.error(e);
      alert("Failed to predict price. Please check destinations.");
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 flex items-center gap-3">
            Price <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">Prediction</span> <Plane className="text-cyan-400" size={40} />
          </h2>
          <p className="text-gray-400 text-lg">Predicting live prices using real Haversine distance calculations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Input Panel */}
        <div className="glass-panel p-6 h-fit border-t-4 border-cyan-500">
          <h3 className="text-xl font-bold mb-6 text-white">Route Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">SOURCE</label>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2">
                <MapPin size={16} className="text-gray-400" />
                <input type="text" value={source} onChange={e => setSource(e.target.value)} placeholder="e.g. Delhi" className="bg-transparent border-none outline-none text-white w-full text-sm" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">DESTINATION</label>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2">
                <MapPin size={16} className="text-cyan-400" />
                <input type="text" value={destination} onChange={e => setDestination(e.target.value)} placeholder="e.g. Bali" className="bg-transparent border-none outline-none text-white w-full text-sm" />
              </div>
            </div>

            <button 
              onClick={handlePredict}
              disabled={isPredicting}
              className="w-full py-3 mt-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 font-bold rounded-lg hover:bg-cyan-500/40 transition-colors flex justify-center items-center gap-2"
            >
              {isPredicting ? <><Loader2 className="animate-spin" size={16}/> Analyzing...</> : "Run ML Model"}
            </button>
          </div>
        </div>

        {/* Dynamic Prediction Graph & Output */}
        <div className="lg:col-span-3 space-y-6">
          {!prediction && !isPredicting && (
             <div className="glass-panel p-12 h-full flex flex-col items-center justify-center text-center border-dashed border-2 border-white/10">
               <LineChart size={48} className="text-gray-600 mb-4" />
               <h3 className="text-xl font-bold text-gray-400">Run the Model</h3>
               <p className="text-gray-500 text-sm mt-2 max-w-sm">Enter your route to calculate real physical distance and generate dynamic pricing predictions.</p>
             </div>
          )}

          {isPredicting && (
            <div className="glass-panel p-12 h-full flex items-center justify-center">
              <Loader2 size={40} className="text-cyan-400 animate-spin" />
            </div>
          )}

          <AnimatePresence>
            {prediction && !isPredicting && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Price Prediction Graph */}
                <div className="glass-panel p-6 relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-lg font-black text-white flex items-center gap-2 truncate max-w-[200px]" title={`${source} → ${destination}`}>
                        <LineChart className="text-cyan-400 shrink-0" /> {source} → {destination}
                      </h3>
                      <p className="text-gray-400 text-[10px] flex flex-wrap gap-1 mt-2">
                        <span className="bg-white/10 px-1 py-0.5 rounded font-bold">OSM Dist: {prediction.distance_km}km</span>
                        <span className="bg-white/10 px-1 py-0.5 rounded font-bold">Dynamic Haversine</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="block text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Buy Recommendation</span>
                      <span className="text-sm font-black text-white px-2 py-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded mt-1 inline-block">
                        {prediction.trend === "rising" ? "Book Now" : "Wait 2 Days"}
                      </span>
                    </div>
                  </div>

                  {/* Graph Visualization */}
                  <div className="relative h-48 w-full flex items-end justify-between px-2 pb-6 border-b border-l border-white/20">
                    <div className="w-[12%] bg-blue-500/20 h-[40%] rounded-t-sm"></div>
                    <div className="w-[12%] bg-blue-500/30 h-[50%] rounded-t-sm"></div>
                    <div className="w-[12%] bg-blue-500/40 h-[60%] rounded-t-sm relative"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">₹{prediction.historical_low.toLocaleString()}</span></div>
                    
                    {/* Today */}
                    <div className="w-[12%] bg-cyan-500/60 h-[75%] rounded-t-sm relative">
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-cyan-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(6,182,212,0.6)] whitespace-nowrap z-10 flex flex-col items-center">
                        <span>Current</span>
                        <span>₹{prediction.price.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {/* Simulated Data Points (Predicted) */}
                    <div className={`w-[12%] border border-dashed ${prediction.trend === 'rising' ? 'border-red-500/50 bg-red-500/20' : 'border-green-500/50 bg-green-500/20'} h-[${prediction.trend === 'rising' ? '85' : '65'}%] rounded-t-sm`}></div>
                    <div className={`w-[12%] border border-dashed ${prediction.trend === 'rising' ? 'border-red-500/50 bg-red-500/40' : 'border-green-500/50 bg-green-500/40'} h-[${prediction.trend === 'rising' ? '95' : '55'}%] rounded-t-sm relative`}>
                      <div className={`absolute -top-10 left-1/2 -translate-x-1/2 ${prediction.trend === 'rising' ? 'bg-red-500' : 'bg-green-500'} text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap z-10 flex flex-col items-center`}>
                        <span>In 5 Days</span>
                        <span>₹{prediction.historical_high.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className={`w-[12%] border border-dashed ${prediction.trend === 'rising' ? 'border-red-500/50 bg-red-500/20' : 'border-green-500/50 bg-green-500/20'} h-[${prediction.trend === 'rising' ? '100' : '45'}%] rounded-t-sm`}></div>

                    {/* X Axis Labels */}
                    <div className="absolute bottom-1 left-0 w-full flex justify-between text-[10px] text-gray-500 px-2">
                      <span>Past</span>
                      <span className="text-cyan-400 font-bold">Today</span>
                      <span className={prediction.trend === 'rising' ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>+5 Days</span>
                    </div>
                  </div>
                </div>

                {/* Fare Alerts & Info */}
                <div className="flex flex-col gap-4">
                  <div className={`glass-panel p-6 ${prediction.trend === 'rising' ? 'border-red-500/30' : 'border-green-500/30'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${prediction.trend === 'rising' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                      {prediction.trend === 'rising' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">{prediction.trend === 'rising' ? 'Price Surge Warning' : 'Price Drop Expected'}</h4>
                    <p className="text-gray-400 text-sm mb-4">
                      Based on real distance calculations ({prediction.distance_km}km), prices are predicted to {prediction.trend} from <strong>₹{prediction.price.toLocaleString()}</strong> to <strong>₹{prediction.historical_high.toLocaleString()}</strong>.
                    </p>
                    <div className="bg-black/30 p-3 rounded-lg border border-white/10 text-xs font-bold text-gray-300 flex items-center justify-between">
                      Confidence Score <span className={`flex items-center gap-1 ${prediction.trend === 'rising' ? 'text-red-400' : 'text-green-400'}`}><Cpu size={14}/> {prediction.confidence}%</span>
                    </div>
                  </div>

                  <div className="glass-panel p-5 bg-gradient-to-br from-blue-600/20 to-transparent border-blue-500/30 mt-auto">
                    <h4 className="text-md font-bold text-white mb-2 flex items-center gap-2"><BellRing size={16} className="text-blue-400" /> Smart Fare Alerts</h4>
                    <div className="flex gap-2">
                      <input type="email" placeholder="Enter email..." className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none" />
                      <button className="bg-blue-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors">Alert Me</button>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
