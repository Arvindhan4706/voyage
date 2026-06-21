import { Globe, Share2, MessageCircle, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full relative z-10 mt-32 border-t border-white/10 overflow-hidden bg-[#050816]">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="text-3xl font-black text-white mb-6 tracking-tighter">
              Travel<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">AI</span>
            </div>
            <p className="text-gray-400 max-w-sm leading-relaxed mb-8">
              The world's most advanced machine learning engine for personalized travel itineraries, dynamic pricing prediction, and immersive exploration.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"><Globe size={20} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"><Share2 size={20} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"><MessageCircle size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Destinations</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">AI Itineraries</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Price Prediction</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Live Weather</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2026 TravelGPT Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            Powered by <Sparkles size={14} className="text-cyan-400" /> Advanced MLOps
          </div>
        </div>
      </div>
    </footer>
  );
}
