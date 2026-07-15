"use client";

import { Plane, CalendarDays, Clock, ArrowRight, IndianRupee } from "lucide-react";

export default function FlightInsights({ source, destination, budget }: { source: string, destination: string, budget?: string }) {
  // Simulate live flight pricing based on generic budget
  const budgetStr = budget !== undefined && budget !== null ? String(budget) : "";
  const estimatedBase = budgetStr.replace(/\D/g, "") ? parseInt(budgetStr.replace(/\D/g, "")) * 0.3 : 15000;
  
  return (
    <div className="glass-panel p-6 border-cyan-500/30 mt-8 mb-8">
      <h4 className="text-xl font-bold mb-6 flex items-center gap-2"><Plane className="text-cyan-400" /> Flight & Transport Insights</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Outbound Flight */}
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:border-cyan-500/50 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Outbound</span>
            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full">Fastest Route</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-center">
              <div className="text-2xl font-black">{source || "Origin"}</div>
              <div className="text-xs text-gray-500 mt-1">10:00 AM</div>
            </div>
            <div className="flex-1 flex flex-col items-center px-4">
              <span className="text-xs text-gray-500 mb-1">Direct • 4h 30m</span>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent relative">
                <Plane size={16} className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-cyan-400 rotate-90" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-cyan-400">{destination || "Destination"}</div>
              <div className="text-xs text-gray-500 mt-1">2:30 PM</div>
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <div className="flex items-center gap-1 text-gray-400"><Clock size={14} /> Daily</div>
            <div className="font-black text-lg flex items-center">
              <IndianRupee size={16} /> {Math.round(estimatedBase).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Return Flight */}
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:border-purple-500/50 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Return</span>
            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">Cheapest</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-center">
              <div className="text-2xl font-black text-purple-400">{destination || "Destination"}</div>
              <div className="text-xs text-gray-500 mt-1">6:00 PM</div>
            </div>
            <div className="flex-1 flex flex-col items-center px-4">
              <span className="text-xs text-gray-500 mb-1">1 Stop • 6h 15m</span>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent relative">
                <Plane size={16} className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-purple-400 -rotate-90" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black">{source || "Origin"}</div>
              <div className="text-xs text-gray-500 mt-1">11:15 PM</div>
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <div className="flex items-center gap-1 text-gray-400"><CalendarDays size={14} /> +4 Days</div>
            <div className="font-black text-lg flex items-center">
              <IndianRupee size={16} /> {Math.round(estimatedBase * 0.85).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
      
      <a 
        href={`https://www.google.com/travel/flights?q=Flights%20to%20${encodeURIComponent(destination)}%20from%20${encodeURIComponent(source)}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full mt-6 bg-white/5 hover:bg-cyan-500/20 text-cyan-400 border border-white/10 hover:border-cyan-500/50 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
      >
        View Live Flights on Google Flights <ArrowRight size={16} />
      </a>
    </div>
  );
}
