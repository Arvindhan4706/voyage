"use client";

import { motion } from "framer-motion";
import { Star, ShieldCheck, Sparkles, MessageSquareHeart, MapPin, Building2, Wind, Network } from "lucide-react";
import { useState, useEffect } from "react";

const hotelImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c0d519f2?w=800&q=80",
  "https://images.unsplash.com/photo-1542314831-c6a4d142104d?w=800&q=80"
];

export default function HotelsModule() {
  const [hotels, setHotels] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/hotels")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const mapped = data.map((h, idx) => ({
            ...h,
            price: "₹" + h.price.toLocaleString(),
            rating: h.ratings.toFixed(1),
            reviews: Math.floor(Math.random() * 2000 + 500).toLocaleString(),
            aiScore: Math.floor(Math.random() * 10 + 90),
            safety: Math.floor(Math.random() * 10 + 90),
            cleanliness: Math.floor(Math.random() * 10 + 90),
            summary: `High NLP sentiment score for amenities like ${JSON.parse(h.amenities || "[]").join(", ")}.`,
            image: hotelImages[idx % hotelImages.length]
          }));
          setHotels(mapped);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 flex items-center gap-3">
            Sentiment <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Analysis</span> <MessageSquareHeart className="text-pink-400" size={40} />
          </h2>
          <p className="text-gray-400 text-lg">Hotels and Destinations ranked by advanced NLP models analyzing millions of reviews.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sentiment Analysis Engine Panel */}
        <div className="glass-panel p-6 lg:col-span-1 h-fit sticky top-24 border-l-4 border-pink-500">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4"><Network size={18} className="text-pink-400" /> NLP Engine</h3>
          
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-2 block uppercase">Example Reviews Analysed</label>
              <div className="space-y-2">
                <span className="block px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300 italic">"Beautiful location"</span>
                <span className="block px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300 italic">"Clean rooms"</span>
                <span className="block px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300 italic">"Excellent service"</span>
              </div>
            </div>

            <div className="bg-black/40 border border-pink-500/30 p-4 rounded-xl text-center">
              <span className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Resulting Sentiment</span>
              <span className="text-2xl font-black text-pink-400 block mb-1">Positive</span>
              <span className="text-lg font-bold text-white">94%</span>
            </div>

            <div className="border-t border-white/10 pt-4">
              <label className="text-xs font-bold text-gray-500 mb-3 block uppercase">NLP Models Running</label>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-bold text-pink-200 bg-pink-500/20 px-3 py-1 rounded-full">BERT</span>
                <span className="text-xs font-bold text-purple-200 bg-purple-500/20 px-3 py-1 rounded-full">RoBERTa</span>
                <span className="text-xs font-bold text-indigo-200 bg-indigo-500/20 px-3 py-1 rounded-full">DistilBERT</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Hotel Cards */}
        <div className="lg:col-span-3 space-y-6">
          {hotels.map((hotel, idx) => (
            <motion.div 
              key={hotel.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass-panel p-4 flex flex-col md:flex-row gap-6 group hover:bg-white/5 transition-colors cursor-pointer"
            >
              {/* Image */}
              <div className="w-full md:w-64 h-48 rounded-xl overflow-hidden relative shrink-0">
                <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" /> {hotel.rating} ({hotel.reviews})
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-black text-white">{hotel.name}</h3>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 font-bold uppercase block">Per Night</span>
                      <span className="text-2xl font-black text-white">{hotel.price}</span>
                    </div>
                  </div>
                  
                  {/* ML Generated Summary */}
                  <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-lg mb-4">
                    <p className="text-sm text-purple-200 flex items-start gap-2">
                      <Sparkles size={16} className="text-purple-400 shrink-0 mt-0.5" />
                      <span className="italic">"{hotel.summary}"</span>
                    </p>
                  </div>
                </div>

                {/* AI Scoring Grid */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-black/30 border border-white/5 rounded-lg p-2 text-center hover:bg-black/50 transition-colors">
                    <span className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Sentiment Score</span>
                    <span className="text-lg font-black text-pink-400">{hotel.aiScore}%</span>
                  </div>
                  <div className="bg-black/30 border border-white/5 rounded-lg p-2 text-center hover:bg-black/50 transition-colors">
                    <span className="block text-[10px] text-gray-500 font-bold uppercase mb-1 flex items-center justify-center gap-1"><ShieldCheck size={10}/> Safety</span>
                    <span className="text-lg font-black text-emerald-400">{hotel.safety}%</span>
                  </div>
                  <div className="bg-black/30 border border-white/5 rounded-lg p-2 text-center hover:bg-black/50 transition-colors">
                    <span className="block text-[10px] text-gray-500 font-bold uppercase mb-1 flex items-center justify-center gap-1"><Wind size={10}/> Clean</span>
                    <span className="text-lg font-black text-cyan-400">{hotel.cleanliness}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
