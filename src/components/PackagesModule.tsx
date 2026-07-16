"use client";

import { motion } from "framer-motion";
import { Plane, Home, MapPin, Search, Calendar, Star, Tag, ChevronRight } from "lucide-react";
import { useState } from "react";

const packages = [
  {
    id: 1,
    title: "Romantic Bali Getaway",
    location: "Bali, Indonesia",
    image: "/images/bali_resort.png",
    days: "5 Days / 4 Nights",
    originalPrice: 45000,
    price: 32999,
    rating: 4.8,
    reviews: 124,
    tags: ["Couples", "Beach", "Luxury"],
    includes: ["Round-trip Flights", "4-Star Hotel", "Airport Transfers", "Breakfast"]
  },
  {
    id: 2,
    title: "Swiss Alps Adventure",
    location: "Zurich, Switzerland",
    image: "/images/swiss_alps.png",
    days: "7 Days / 6 Nights",
    originalPrice: 120000,
    price: 95499,
    rating: 4.9,
    reviews: 86,
    tags: ["Adventure", "Nature", "Snow"],
    includes: ["Flights", "Chalet Stay", "Ski Pass", "Insurance"]
  },
  {
    id: 3,
    title: "Dubai City Tour & Desert Safari",
    location: "Dubai, UAE",
    image: "/images/dubai_city.png",
    days: "4 Days / 3 Nights",
    originalPrice: 35000,
    price: 26999,
    rating: 4.6,
    reviews: 210,
    tags: ["Shopping", "Family", "Desert"],
    includes: ["Flights", "5-Star Hotel", "Safari Tour", "Visa Assist"]
  },
  {
    id: 4,
    title: "Maldives Water Villa Special",
    location: "Male, Maldives",
    image: "/images/maldives_villa.png",
    days: "6 Days / 5 Nights",
    originalPrice: 150000,
    price: 115999,
    rating: 5.0,
    reviews: 342,
    tags: ["Honeymoon", "Ultra Luxury"],
    includes: ["Flights", "Water Villa", "All Meals", "Speedboat"]
  }
];

export default function PackagesModule() {
  const [destination, setDestination] = useState("");
  const [month, setMonth] = useState("Anytime");

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 relative z-10">
      
      {/* Header & Search */}
      <div className="glass-panel p-8 mb-12 bg-gradient-to-r from-orange-900/30 to-red-900/20 border-b-4 border-orange-500">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Curated <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Holiday Packages</span>
          </h2>
          <p className="text-gray-300 text-lg">Bundle Flights + Hotels and save up to 30% on your next trip.</p>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-2">
          <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-2 hover:border-orange-500/50 transition-colors">
            <MapPin size={18} className="text-orange-400" />
            <input 
              type="text" 
              placeholder="Where do you want to go?" 
              className="bg-transparent border-none outline-none text-white w-full font-bold"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-2 hover:border-orange-500/50 transition-colors">
            <Calendar size={18} className="text-orange-400" />
            <select 
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="bg-transparent border-none outline-none text-white w-full font-bold appearance-none"
            >
              <option className="bg-gray-900">Anytime</option>
              <option className="bg-gray-900">Next Month</option>
              <option className="bg-gray-900">Summer 2026</option>
              <option className="bg-gray-900">Winter 2026</option>
            </select>
          </div>
          <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-lg font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25">
            <Search size={18} /> Search Deals
          </button>
        </div>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg, i) => (
          <motion.div 
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel overflow-hidden group hover:border-orange-500/50 transition-colors cursor-pointer flex flex-col"
          >
            <div className="h-48 relative overflow-hidden">
              <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase">
                Save {Math.round((1 - pkg.price/pkg.originalPrice) * 100)}%
              </div>
            </div>
            
            <div className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-black text-lg text-white group-hover:text-orange-400 transition-colors leading-tight">{pkg.title}</h3>
              </div>
              <p className="text-gray-400 text-xs flex items-center gap-1 mb-3"><MapPin size={12}/> {pkg.location}</p>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-orange-500/20 text-orange-400 text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                  {pkg.rating} <Star size={10} className="fill-orange-400" />
                </div>
                <span className="text-[10px] text-gray-500">({pkg.reviews} reviews)</span>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {pkg.tags.map(tag => (
                  <span key={tag} className="text-[9px] uppercase tracking-wider bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto space-y-2 mb-4">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Includes:</p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                  {pkg.includes.map(inc => (
                    <span key={inc} className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded">
                      {inc.includes('Flight') ? <Plane size={10} className="text-orange-400"/> : 
                       inc.includes('Hotel') || inc.includes('Villa') || inc.includes('Chalet') ? <Home size={10} className="text-orange-400"/> : 
                       <Tag size={10} className="text-orange-400"/>}
                      {inc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-between items-end mt-auto">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider block">{pkg.days}</span>
                  <span className="text-xs text-gray-500 line-through">₹{pkg.originalPrice.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block mb-[-2px]">per person</span>
                  <span className="text-2xl font-black text-white">₹{pkg.price.toLocaleString()}</span>
                </div>
              </div>
              
              <button className="w-full mt-4 py-2 bg-white/5 group-hover:bg-orange-500 group-hover:text-white border border-white/10 group-hover:border-orange-500 rounded-lg text-sm font-bold text-orange-400 transition-colors flex items-center justify-center gap-1">
                View Itinerary <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
