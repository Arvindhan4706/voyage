import { NextResponse } from "next/server";

// Rule-based itinerary engine (works 100% serverless, no Python needed)
const destinations: Record<string, any> = {
  adventure: [
    { name: "Manali, Himachal Pradesh", budget: "₹18,000 – ₹25,000" },
    { name: "Rishikesh, Uttarakhand", budget: "₹12,000 – ₹18,000" },
    { name: "Coorg, Karnataka", budget: "₹15,000 – ₹22,000" },
    { name: "Spiti Valley", budget: "₹20,000 – ₹30,000" },
  ],
  relaxation: [
    { name: "Goa", budget: "₹15,000 – ₹30,000" },
    { name: "Alleppey, Kerala", budget: "₹12,000 – ₹20,000" },
    { name: "Andaman & Nicobar", budget: "₹25,000 – ₹40,000" },
    { name: "Ooty, Tamil Nadu", budget: "₹10,000 – ₹18,000" },
  ],
  "culture & heritage": [
    { name: "Varanasi, Uttar Pradesh", budget: "₹10,000 – ₹18,000" },
    { name: "Jaipur, Rajasthan", budget: "₹12,000 – ₹20,000" },
    { name: "Hampi, Karnataka", budget: "₹8,000 – ₹15,000" },
    { name: "Mysuru, Karnataka", budget: "₹10,000 – ₹16,000" },
  ],
};

const itineraries: Record<string, any[]> = {
  adventure: [
    { day: 1, title: "Arrival & Acclimatization", morning: "Check-in to hotel & rest", afternoon: "Explore local market", evening: "Bonfire & orientation" },
    { day: 2, title: "Trekking Day", morning: "Early morning trek start", afternoon: "Summit & scenic lunch", evening: "Recovery & campfire stories" },
    { day: 3, title: "River Rafting & Zip-line", morning: "Grade 4 river rafting", afternoon: "Zip-line & rock climbing", evening: "Local cuisine dinner" },
    { day: 4, title: "Departure", morning: "Sunrise hike", afternoon: "Souvenir shopping", evening: "Return journey begins" },
  ],
  relaxation: [
    { day: 1, title: "Arrival & Beach Walk", morning: "Check-in to resort", afternoon: "Beach walk & coconut water", evening: "Sunset at the shore" },
    { day: 2, title: "Spa & Wellness", morning: "Ayurvedic massage session", afternoon: "Pool & leisure", evening: "Candlelight seafood dinner" },
    { day: 3, title: "Boat Cruise", morning: "Houseboat / cruise trip", afternoon: "Water sports (optional)", evening: "Live music at beach shack" },
    { day: 4, title: "Departure", morning: "Yoga session at sunrise", afternoon: "Final beach visit", evening: "Fly home refreshed" },
  ],
  "culture & heritage": [
    { day: 1, title: "Arrival & Heritage Walk", morning: "Check-in & freshen up", afternoon: "Heritage walking tour", evening: "Classical dance/music show" },
    { day: 2, title: "Temple & Museum Tour", morning: "Major temple visit at sunrise", afternoon: "State museum & art gallery", evening: "Local street food trail" },
    { day: 3, title: "Craft Villages & Markets", morning: "Village handicraft workshop", afternoon: "Bazaar shopping", evening: "Cultural storytelling session" },
    { day: 4, title: "Departure", morning: "Sunrise at heritage site", afternoon: "Light breakfast & packing", evening: "Head home with memories" },
  ],
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const style = (body.style || "adventure").toLowerCase();

    const styleKey = Object.keys(destinations).find(k => style.includes(k)) || "adventure";
    const destList = destinations[styleKey];
    const selectedDest = destList[Math.floor(Math.random() * destList.length)];
    const days = itineraries[styleKey];

    const result = {
      destination: selectedDest.name,
      estimated_budget: selectedDest.budget,
      travel_style: styleKey,
      days: days,
      tips: [
        "Book accommodation at least 2 weeks in advance.",
        "Carry cash — ATMs may not be available everywhere.",
        "Download offline maps before you travel.",
      ],
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Trip Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate itinerary" }, { status: 500 });
  }
}
