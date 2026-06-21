"use client";

import { motion } from "framer-motion";
import { Play, Thermometer, Users, IndianRupee, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

const videoAssets = [
  { video: "https://cdn.pixabay.com/video/2020/05/10/38747-418759535_tiny.mp4", poster: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80" },
  { video: "https://cdn.pixabay.com/video/2019/04/10/22616-329437151_tiny.mp4", poster: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80" },
  { video: "https://cdn.pixabay.com/video/2020/02/16/32386-391851017_tiny.mp4", poster: "https://images.unsplash.com/photo-1531366936337-77df329004eb?w=800&q=80" },
  { video: "https://cdn.pixabay.com/video/2020/06/13/41908-430378051_tiny.mp4", poster: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80" }
];

export default function TrendingDestinations() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [trending, setTrending] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/destinations")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Merge with local media assets
          const mapped = data.map((d, idx) => ({
            ...d,
            temp: d.weather || "24°C",
            crowd: idx % 2 === 0 ? "High" : "Medium",
            cost: "₹" + (d.cost || 20000).toLocaleString(),
            video: videoAssets[idx % videoAssets.length].video,
            poster: videoAssets[idx % videoAssets.length].poster
          }));
          setTrending(mapped);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section className="py-24 w-full relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <h2 className="text-4xl md:text-5xl font-black mb-2">Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Live</span></h2>
        <p className="text-gray-400">Netflix-style exploration based on real-time global data.</p>
      </div>

      <div className="flex overflow-x-auto gap-4 px-4 pb-12 no-scrollbar pl-4 md:pl-16 snap-x">
        {trending.map((place) => (
          <motion.div
            key={place.id}
            onHoverStart={() => setHoveredId(place.id)}
            onHoverEnd={() => setHoveredId(null)}
            className="relative flex-shrink-0 w-[280px] h-[400px] md:w-[320px] md:h-[450px] rounded-2xl overflow-hidden cursor-pointer snap-center group transition-all duration-500 origin-center"
            style={{ 
              transform: hoveredId === place.id ? 'scale(1.1) z-[50]' : hoveredId ? 'scale(0.95)' : 'scale(1)',
              zIndex: hoveredId === place.id ? 50 : 10
            }}
          >
            {hoveredId === place.id ? (
              <video 
                src={place.video} 
                autoPlay 
                loop 
                muted 
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <img 
                src={place.poster} 
                alt={place.name} 
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

            <div className="absolute bottom-0 left-0 w-full p-6">
              <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-2"><MapPin size={20} className="text-red-500" /> {place.name}</h3>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-lg p-2">
                  <Thermometer size={16} className="text-orange-400 mb-1" />
                  <span className="text-xs font-bold">{place.temp}</span>
                </div>
                <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-lg p-2">
                  <Users size={16} className="text-blue-400 mb-1" />
                  <span className="text-xs font-bold">{place.crowd}</span>
                </div>
                <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-lg p-2">
                  <IndianRupee size={16} className="text-green-400 mb-1" />
                  <span className="text-xs font-bold">{place.cost}</span>
                </div>
              </div>

              {/* Hover Expansion Data */}
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: hoveredId === place.id ? 'auto' : 0, 
                  opacity: hoveredId === place.id ? 1 : 0 
                }}
                className="overflow-hidden mt-4"
              >
                <div className="pt-4 border-t border-white/20">
                  <p className="text-xs text-gray-300 font-bold mb-2 flex items-center gap-2"><Play size={12} className="text-cyan-400 fill-cyan-400" /> Itinerary Preview</p>
                  <ul className="text-xs text-gray-400 space-y-1 mb-3">
                    <li>• Day 1: City Tour & Local Food</li>
                    <li>• Day 2: Adventure Sports</li>
                    <li>• Day 3: Relaxation & Spa</li>
                  </ul>
                  <button className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded text-xs font-bold text-white hover:scale-105 transition-transform">
                    View Full Plan
                  </button>
                </div>
              </motion.div>

            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
