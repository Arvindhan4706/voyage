"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

const hotelImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c0d519f2?w=800&q=80",
  "https://images.unsplash.com/photo-1542314831-c6a4d142104d?w=800&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
  "https://images.unsplash.com/photo-1571003123771-bd6a099d56e8?w=800&q=80",
  "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
];

function HotelSkeleton() {
  return (
    <div className="bg-[#faf9f6] dark:bg-[#18181b] border border-[#eaeaea] dark:border-[#333333] p-4 flex gap-6 animate-pulse">
      <div className="w-48 h-40 bg-[#eaeaea] dark:bg-[#333333] shrink-0" />
      <div className="flex-1 space-y-4 py-2">
        <div className="h-6 bg-[#eaeaea] dark:bg-[#333333] w-3/4" />
        <div className="h-4 bg-[#f0f0f0] dark:bg-[#222222] w-1/2" />
        <div className="h-4 bg-[#f0f0f0] dark:bg-[#222222] w-2/3 mt-4" />
      </div>
    </div>
  );
}

export default function HotelsModule() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("Bali");
  const [inputValue, setInputValue] = useState("Bali");

  const fetchHotels = async (place: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/hotels?location=${encodeURIComponent(place)}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setHotels(
          data.slice(0, 4).map((h: any, idx: number) => ({
            ...h,
            image: hotelImages[idx % hotelImages.length],
            displayPrice: `₹${Math.round(h.price || 3500).toLocaleString()}`,
          }))
        );
      } else {
        setHotels([]);
      }
    } catch {
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHotels("Bali"); }, []);

  return (
    <section className="py-24 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#888888] dark:text-[#a3a3a3] font-medium mb-3">
            Signature Properties
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-[#222222] dark:text-[#faf9f6]">
            Stays in {location}
          </h2>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 border-b border-[#eaeaea] dark:border-[#333333] py-2 w-full md:w-64">
            <MapPin size={14} className="text-[#888888] dark:text-[#a3a3a3]" />
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { setLocation(inputValue); fetchHotels(inputValue); } }}
              placeholder="Search destination..."
              className="bg-transparent outline-none text-[#222222] dark:text-[#faf9f6] font-serif text-lg w-full placeholder:text-[#888888] dark:text-[#a3a3a3]"
            />
          </div>
          <button
            onClick={() => { setLocation(inputValue); fetchHotels(inputValue); }}
            className="text-[11px] tracking-[0.1em] uppercase text-[#222222] dark:text-[#faf9f6] font-semibold hover:text-[#D4AF37] dark:hover:text-[#D4AF37] transition-colors whitespace-nowrap"
          >
            Search
          </button>
        </div>
      </div>

      <div className="space-y-12">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              {Array.from({ length: 4 }).map((_, i) => <HotelSkeleton key={i} />)}
            </motion.div>
          ) : hotels.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#faf9f6] dark:bg-[#18181b] border border-[#eaeaea] dark:border-[#333333] p-16 text-center"
            >
              <MapPin size={32} className="text-[#888888] dark:text-[#a3a3a3] mx-auto mb-6" strokeWidth={1} />
              <p className="text-[#222222] dark:text-[#faf9f6] font-serif text-2xl mb-2">No stays found for "{location}".</p>
              <p className="text-[#888888] dark:text-[#a3a3a3] text-sm font-light">Please try a different destination or check back later.</p>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
              {hotels.map((hotel, idx) => (
                <motion.div
                  key={hotel.id || idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="group cursor-pointer flex flex-col md:flex-row gap-8 items-center"
                >
                  <div className="relative w-full md:w-[45%] aspect-[4/3] overflow-hidden bg-[#faf9f6] dark:bg-[#18181b]">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                  </div>
                  
                  <div className="w-full md:w-[55%] flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1">
                        {Array.from({length: 5}).map((_, i) => (
                          <Star key={i} size={10} className={i < Math.floor(hotel.ratings || 5) ? "fill-[#D4AF37] text-[#D4AF37]" : "text-[#eaeaea]"} />
                        ))}
                      </div>
                      <span className="text-[10px] tracking-[0.2em] text-[#888888] dark:text-[#a3a3a3] uppercase">
                        {hotel.ratings?.toFixed(1) || "5.0"}
                      </span>
                    </div>

                    <h3 className="font-serif text-3xl text-[#222222] dark:text-[#faf9f6] mb-2 group-hover:text-[#D4AF37] transition-colors">{hotel.name}</h3>
                    
                    {hotel.location && (
                      <p className="text-[#888888] dark:text-[#a3a3a3] text-[11px] tracking-widest uppercase mb-6 flex items-center gap-2">
                        <MapPin size={12} /> {hotel.location}
                      </p>
                    )}

                    <div className="mt-4 pt-6 border-t border-[#eaeaea] dark:border-[#333333] flex justify-between items-end">
                      <button className="text-[10px] tracking-[0.2em] uppercase text-[#222222] dark:text-[#faf9f6] border-b border-[#222222] dark:border-[#faf9f6] pb-1 hover:text-[#D4AF37] dark:hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors">
                        View Details
                      </button>
                      <div className="text-right">
                        <span className="text-[10px] tracking-widest text-[#888888] dark:text-[#a3a3a3] uppercase block mb-1">From</span>
                        <span className="font-medium text-[#222222] dark:text-[#faf9f6] text-lg">{hotel.displayPrice} <span className="text-sm text-[#888888] dark:text-[#a3a3a3] font-light">/ night</span></span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
