import Header from "@/components/Header";
import Architecture from "@/components/Architecture";
import Gamification from "@/components/Gamification";
import Sustainability from "@/components/Sustainability";
import EcosystemGrid from "@/components/EcosystemGrid";
import FutureRoadmap from "@/components/FutureRoadmap";
import CommunitySection from "@/components/CommunitySection";
import TravelReels from "@/components/TravelReels";
import FlightsModule from "@/components/FlightsModule";
import HotelsModule from "@/components/HotelsModule";
import TravelCategories from "@/components/TravelCategories";
import AITripGenerator from "@/components/AITripGenerator";
import SmartBudgetOptimizer from "@/components/SmartBudgetOptimizer";
import TrendingDestinations from "@/components/TrendingDestinations";
import InteractiveMap from "@/components/InteractiveMap";
import Hero from "@/components/Hero";
import AISearch from "@/components/AISearch";
import WhyChooseUs from "@/components/WhyChooseUs";
import AIPipeline from "@/components/AIPipeline";
import DestinationCards from "@/components/DestinationCards";
import TrustedMarquee from "@/components/TrustedMarquee";
import Footer from "@/components/Footer";
import ChatAssistant from "@/components/ChatAssistant";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050816] overflow-x-hidden relative font-outfit text-white">
      <Header />
      <Hero />
      <div id="home" className="relative z-10">
        <AISearch />
        
        <div className="py-12" />
        <TrustedMarquee />
        
        <div className="py-12" />
        <WhyChooseUs />
        
        <div id="experiences" className="py-12" />
        <TravelCategories />
        
        <div id="ai-planner" className="py-12" />
        <AITripGenerator />
        
        <div id="packages" className="py-12" />
        <SmartBudgetOptimizer />

        <div id="flights" className="py-12" />
        <FlightsModule />

        <div id="hotels" className="py-12" />
        <HotelsModule />

        <div className="py-12" />
        <AIPipeline />

        <div className="py-12" />
        <Architecture />
        
        <div id="destinations" className="py-12" />
        <DestinationCards />
        
        <div className="py-12" />
        <TrendingDestinations />
        
        <div className="py-12" />
        <InteractiveMap />
        
        <div id="community" className="py-12" />
        <CommunitySection />

        <div className="py-12" />
        <TravelReels />

        <div className="py-12" />
        <Gamification />

        <div className="py-12" />
        <Sustainability />

        <div className="py-12" />
        <EcosystemGrid />

        <div className="py-12" />
        <FutureRoadmap />

      </div>
      
      {/* We are replacing the MMT footer with our own or keeping the old futuristic one, let's just render the Footer we have but we rewrote it to MMT... Let's leave it as is or rewrite it to dark mode. I will rewrite Footer.tsx next. */}
      <Footer />
      
      {/* Floating Chatbot */}
      <ChatAssistant />
    </main>
  );
}
