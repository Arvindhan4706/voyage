"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Search, MapPin, Thermometer, X } from "lucide-react";
import { useState, useCallback } from "react";

let debounceTimer: ReturnType<typeof setTimeout>;

export default function AISearch() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const chips = [
    "Hill stations near Chennai",
    "Honeymoon in Maldives",
    "Budget trip to Goa",
    "Adventure in Manali",
  ];

  const searchDestinations = useCallback(async (q: string) => {
    if (!q.trim() || q.length < 3) {
      setResults([]);
      setShowResults(false);
      return;
    }
    setIsSearching(true);
    setShowResults(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => searchDestinations(val), 500);
  };

  const handleChip = (chip: string) => {
    setQuery(chip);
    searchDestinations(chip);
  };

  return (
    <div className="w-full max-w-4xl mx-auto -mt-24 relative z-30 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="glass-panel p-2 flex items-center gap-2 relative"
      >
        <div className="bg-white/5 p-4 rounded-xl hidden md:flex">
          <Sparkles className="text-cyan-400" size={24} />
        </div>

        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={(e) => e.key === "Enter" && searchDestinations(query)}
          placeholder="Search any destination — Bali, Santorini, Manali..."
          className="flex-1 bg-transparent border-none outline-none text-white text-lg md:text-xl placeholder:text-gray-500 px-4"
        />

        {query && (
          <button onClick={() => { setQuery(""); setResults([]); setShowResults(false); }} className="text-gray-400 hover:text-white p-2">
            <X size={18} />
          </button>
        )}

        <button
          onClick={() => searchDestinations(query)}
          disabled={isSearching}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 rounded-xl font-bold text-white flex items-center gap-2 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all min-w-[140px] justify-center"
        >
          {isSearching ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <Sparkles size={20} />
            </motion.div>
          ) : (
            <><Search size={20} /> Search</>
          )}
        </button>

        {/* Live Results Dropdown */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-3 glass-panel border border-cyan-500/30 shadow-2xl z-50 max-h-[420px] overflow-y-auto"
            >
              {isSearching ? (
                <div className="p-6 flex flex-col items-center gap-3">
                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-3 h-3 bg-cyan-400 rounded-full"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm">Searching Wikipedia, Weather APIs...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {results.map((r, i) => (
                    <motion.div
                      key={r.id || i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-4 p-4 hover:bg-white/5 cursor-pointer transition-colors group"
                      onClick={() => { setQuery(r.name); setShowResults(false); }}
                    >
                      {r.image && (
                        <img src={r.image} alt={r.name} className="w-16 h-14 object-cover rounded-lg shrink-0 group-hover:scale-105 transition-transform" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin size={12} className="text-cyan-400 shrink-0" />
                          <h4 className="text-white font-bold text-sm truncate">{r.name}</h4>
                          {r.weather && (
                            <span className="ml-auto text-xs text-orange-400 flex items-center gap-1 shrink-0">
                              <Thermometer size={10} /> {r.weather.temp}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs line-clamp-2">{r.extract}</p>
                        {r.country && <p className="text-cyan-500 text-[10px] mt-1">{r.country}</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500 text-sm">No results. Try a different destination name.</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Suggested Chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex flex-wrap justify-center gap-3 mt-6"
      >
        {chips.map((chip) => (
          <motion.span
            key={chip}
            onClick={() => handleChip(chip)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="text-xs md:text-sm px-4 py-2 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 cursor-pointer transition-colors"
          >
            {chip}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
