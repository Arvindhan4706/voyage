"use client";

import { motion } from "framer-motion";
import { User, MapPin, Compass, Star, Camera, Shield } from "lucide-react";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 sm:px-8 lg:px-12 bg-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4 text-foreground">My Profile</h1>
          <p className="text-muted-foreground text-lg">Manage your luxury travel preferences and personal details.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* User Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-1"
          >
            <div className="glass-panel p-8 rounded-3xl text-center border border-border shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50"></div>
              <div className="relative">
                <div className="w-32 h-32 mx-auto bg-muted/50 rounded-full flex items-center justify-center mb-6 border-2 border-primary/20 shadow-inner">
                  <User size={48} className="text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight mb-1">{session?.user?.name || "Distinguished Guest"}</h2>
                <p className="text-sm text-muted-foreground mb-6">{session?.user?.email || "guest@voyage.ai"}</p>
                
                <div className="flex justify-center gap-4 text-sm font-medium mb-8">
                  <div className="text-center">
                    <p className="text-2xl font-serif text-primary">12</p>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider">Trips</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-serif text-primary">8</p>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider">Countries</p>
                  </div>
                </div>

                <button className="w-full py-3 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-xl text-sm font-semibold transition-all duration-300">
                  Edit Profile
                </button>
              </div>
            </div>
          </motion.div>

          {/* Travel DNA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="col-span-1 md:col-span-2 space-y-6"
          >
            <div className="glass-panel p-8 rounded-3xl border border-border shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Compass className="text-primary" size={24} /> 
                Travel DNA
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: <MapPin size={20}/>, title: "Preferred Destinations", value: "Tropical, European Cities" },
                  { icon: <Star size={20}/>, title: "Travel Style", value: "Ultra-Luxury, Wellness" },
                  { icon: <Shield size={20}/>, title: "Dietary Requirements", value: "None" },
                  { icon: <Camera size={20}/>, title: "Interests", value: "Photography, Fine Dining" },
                ].map((item, idx) => (
                  <div key={idx} className="bg-background/50 p-4 rounded-2xl border border-border/50">
                    <div className="flex items-center gap-3 text-muted-foreground mb-2">
                      {item.icon}
                      <span className="text-xs uppercase tracking-wider font-semibold">{item.title}</span>
                    </div>
                    <p className="font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-border shadow-xl">
               <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
               <div className="space-y-4">
                 {[
                   "Generated a 7-day luxury itinerary for Kyoto, Japan.",
                   "Added 'Four Seasons Maldives' to Wishlist.",
                   "Updated travel style preferences to 'Wellness'."
                 ].map((activity, i) => (
                   <div key={i} className="flex items-center gap-4 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                     <div className="w-2 h-2 rounded-full bg-primary/50" />
                     <p className="text-sm text-muted-foreground">{activity}</p>
                   </div>
                 ))}
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
