"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plane, Building2, Palmtree, Train, Car, MapPin, Calendar, Users, Search, Sparkles } from "lucide-react";
import { useState } from "react";

export default function AISearch() {
  const [activeTab, setActiveTab] = useState("flights");
  const [tripType, setTripType] = useState("one-way");
  
  // Search state
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const tabs = [
    { id: "flights", icon: Plane, label: "Flights" },
    { id: "hotels", icon: Building2, label: "Hotels" },
    { id: "packages", icon: Palmtree, label: "Holiday Packages" },
    { id: "trains", icon: Train, label: "Trains" },
    { id: "cabs", icon: Car, label: "Cabs" },
  ];

  const handleSearch = () => {
    // In the future, this can trigger routing or scroll to the AI module
    const targetId = activeTab === "flights" ? "flights" : 
                     activeTab === "hotels" ? "hotels" : 
                     activeTab === "packages" ? "packages" : "home";
                     
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full max-w-6xl mx-auto -mt-32 relative z-30 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative pb-10"
      >
        {/* Top Tabs */}
        <div className="flex justify-center bg-white rounded-t-3xl border-b border-gray-100 overflow-x-auto no-scrollbar">
          <div className="flex w-full max-w-4xl justify-between px-4 py-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-2 px-4 py-4 relative min-w-[80px] transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
                >
                  <Icon size={24} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">{tab.label}</span>
                  {isActive && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-8 pb-12 pt-6">
          <AnimatePresence mode="wait">
            {activeTab === "flights" && (
              <motion.div key="flights" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                
                {/* Trip Type Radio */}
                <div className="flex gap-6 items-center text-sm font-bold text-gray-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={tripType === "one-way"} onChange={() => setTripType("one-way")} className="accent-blue-600 w-4 h-4" /> One Way
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={tripType === "round-trip"} onChange={() => setTripType("round-trip")} className="accent-blue-600 w-4 h-4" /> Round Trip
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={tripType === "multi-city"} onChange={() => setTripType("multi-city")} className="accent-blue-600 w-4 h-4" /> Multi City
                  </label>
                </div>

                {/* Big Search Fields */}
                <div className="grid grid-cols-1 md:grid-cols-5 border border-gray-200 rounded-xl divide-y md:divide-y-0 md:divide-x divide-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                  
                  {/* From */}
                  <div className="col-span-1 md:col-span-1 p-4 cursor-text hover:bg-blue-50/30 transition-colors rounded-l-xl">
                    <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1 mb-1 uppercase tracking-wider"><MapPin size={12}/> From</span>
                    <input type="text" value={from} onChange={e => setFrom(e.target.value)} placeholder="Delhi" className="w-full text-2xl font-black text-gray-900 outline-none bg-transparent placeholder:text-gray-300" />
                    <span className="text-xs text-gray-400 truncate block mt-1">DEL, Delhi Airport India</span>
                  </div>

                  {/* To */}
                  <div className="col-span-1 md:col-span-1 p-4 cursor-text hover:bg-blue-50/30 transition-colors">
                    <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1 mb-1 uppercase tracking-wider"><MapPin size={12}/> To</span>
                    <input type="text" value={to} onChange={e => setTo(e.target.value)} placeholder="Bengaluru" className="w-full text-2xl font-black text-gray-900 outline-none bg-transparent placeholder:text-gray-300" />
                    <span className="text-xs text-gray-400 truncate block mt-1">BLR, Bengaluru International Airport India</span>
                  </div>

                  {/* Departure */}
                  <div className="col-span-1 md:col-span-1 p-4 cursor-text hover:bg-blue-50/30 transition-colors">
                    <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1 mb-1 uppercase tracking-wider"><Calendar size={12}/> Departure</span>
                    <div className="flex items-baseline gap-1">
                      <input type="text" value={date} onChange={e => setDate(e.target.value)} placeholder="18" className="w-12 text-3xl font-black text-gray-900 outline-none bg-transparent placeholder:text-gray-300" />
                      <span className="text-lg font-bold text-gray-900">Nov'26</span>
                    </div>
                    <span className="text-xs text-gray-400 truncate block mt-1">Wednesday</span>
                  </div>

                  {/* Return */}
                  <div className="col-span-1 md:col-span-1 p-4 cursor-text hover:bg-blue-50/30 transition-colors" onClick={() => setTripType("round-trip")}>
                    <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1 mb-1 uppercase tracking-wider"><Calendar size={12}/> Return</span>
                    {tripType === "round-trip" ? (
                      <>
                        <div className="flex items-baseline gap-1">
                          <input type="text" value={returnDate} onChange={e => setReturnDate(e.target.value)} placeholder="22" className="w-12 text-3xl font-black text-gray-900 outline-none bg-transparent placeholder:text-gray-300" />
                          <span className="text-lg font-bold text-gray-900">Nov'26</span>
                        </div>
                        <span className="text-xs text-gray-400 truncate block mt-1">Sunday</span>
                      </>
                    ) : (
                      <p className="text-xs text-blue-600 font-bold mt-3">Tap to add a return date for bigger discounts</p>
                    )}
                  </div>

                  {/* Travellers & Class */}
                  <div className="col-span-1 md:col-span-1 p-4 cursor-pointer hover:bg-blue-50/30 transition-colors rounded-r-xl">
                    <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1 mb-1 uppercase tracking-wider"><Users size={12}/> Travellers & Class</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-gray-900">1</span>
                      <span className="text-lg font-bold text-gray-900">Traveller</span>
                    </div>
                    <span className="text-xs text-gray-600 font-bold block mt-1">Economy/Premium Economy</span>
                  </div>

                </div>

                {/* AI Helper Banner */}
                <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 p-3 rounded-lg mt-4">
                  <Sparkles size={16} className="text-blue-500 shrink-0" />
                  <p className="text-xs text-blue-800 font-medium">Use the <strong className="text-blue-600">Smart Budget Optimizer</strong> and <strong className="text-cyan-600">AI Price Prediction</strong> below to analyze this route in real-time!</p>
                </div>
              </motion.div>
            )}

            {activeTab === "hotels" && (
              <motion.div key="hotels" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                
                {/* Trip Type Radio */}
                <div className="flex gap-6 items-center text-sm font-bold text-gray-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked className="accent-blue-600 w-4 h-4" readOnly /> Upto 5 Rooms
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" className="accent-blue-600 w-4 h-4" readOnly /> Group Booking (6+ Rooms)
                  </label>
                </div>

                {/* Big Search Fields */}
                <div className="grid grid-cols-1 md:grid-cols-4 border border-gray-200 rounded-xl divide-y md:divide-y-0 md:divide-x divide-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                  
                  {/* City/Location */}
                  <div className="col-span-1 md:col-span-1 p-4 cursor-text hover:bg-blue-50/30 transition-colors rounded-l-xl">
                    <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1 mb-1 uppercase tracking-wider"><MapPin size={12}/> City, Property name or Location</span>
                    <input type="text" value={from} onChange={e => setFrom(e.target.value)} placeholder="Goa" className="w-full text-2xl font-black text-gray-900 outline-none bg-transparent placeholder:text-gray-300" />
                    <span className="text-xs text-gray-400 truncate block mt-1">India</span>
                  </div>

                  {/* Check-In */}
                  <div className="col-span-1 md:col-span-1 p-4 cursor-text hover:bg-blue-50/30 transition-colors">
                    <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1 mb-1 uppercase tracking-wider"><Calendar size={12}/> Check-In</span>
                    <div className="flex items-baseline gap-1">
                      <input type="text" placeholder="18" className="w-12 text-3xl font-black text-gray-900 outline-none bg-transparent placeholder:text-gray-300" />
                      <span className="text-lg font-bold text-gray-900">Nov'26</span>
                    </div>
                    <span className="text-xs text-gray-400 truncate block mt-1">Wednesday</span>
                  </div>

                  {/* Check-Out */}
                  <div className="col-span-1 md:col-span-1 p-4 cursor-text hover:bg-blue-50/30 transition-colors">
                    <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1 mb-1 uppercase tracking-wider"><Calendar size={12}/> Check-Out</span>
                    <div className="flex items-baseline gap-1">
                      <input type="text" placeholder="20" className="w-12 text-3xl font-black text-gray-900 outline-none bg-transparent placeholder:text-gray-300" />
                      <span className="text-lg font-bold text-gray-900">Nov'26</span>
                    </div>
                    <span className="text-xs text-gray-400 truncate block mt-1">Friday</span>
                  </div>

                  {/* Rooms & Guests */}
                  <div className="col-span-1 md:col-span-1 p-4 cursor-pointer hover:bg-blue-50/30 transition-colors rounded-r-xl">
                    <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1 mb-1 uppercase tracking-wider"><Users size={12}/> Rooms & Guests</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-gray-900">1</span>
                      <span className="text-lg font-bold text-gray-900">Room</span>
                      <span className="text-3xl font-black text-gray-900 ml-2">2</span>
                      <span className="text-lg font-bold text-gray-900">Guests</span>
                    </div>
                  </div>

                </div>
                
                {/* AI Helper Banner */}
                <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 p-3 rounded-lg mt-4">
                  <Sparkles size={16} className="text-purple-500 shrink-0" />
                  <p className="text-xs text-purple-800 font-medium">Use the <strong className="text-purple-600">Hotel Finder</strong> module below to search OpenStreetMap for real hotels in your chosen city!</p>
                </div>
              </motion.div>
            )}

            {/* Fallback for other tabs */}
            {(activeTab === "packages" || activeTab === "trains" || activeTab === "cabs") && (
              <motion.div key="other" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl">
                <p className="text-gray-500 font-bold">Select Flights or Hotels to search</p>
                <p className="text-xs text-gray-400 mt-2">More categories coming soon.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* The Huge MMT Style Search Button */}
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2">
          <button 
            onClick={handleSearch}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-black text-xl md:text-2xl px-12 md:px-16 py-3 rounded-full shadow-[0_10px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.4)] transition-all flex items-center gap-3 hover:scale-105"
          >
            SEARCH
          </button>
        </div>
      </motion.div>

    </div>
  );
}
