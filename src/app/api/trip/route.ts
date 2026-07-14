import { NextResponse } from "next/server";

async function getAttractions(destination: string): Promise<string[]> {
  try {
    // Get real tourist attractions from Overpass API
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json&limit=1`,
      { headers: { "User-Agent": "VoyageAI/1.0" } }
    );
    const geo = await geoRes.json();
    if (!geo.length) return [];

    const { lat, lon } = geo[0];

    const overpassQuery = `
      [out:json][timeout:8];
      (
        node["tourism"~"attraction|museum|viewpoint|artwork|zoo|theme_park"](around:10000,${lat},${lon});
        node["historic"~"monument|castle|ruins|archaeological_site"](around:10000,${lat},${lon});
        node["leisure"~"park|nature_reserve|beach"](around:10000,${lat},${lon});
      );
      out body 20;
    `;

    let overpassData = { elements: [] };
    try {
      const overpassRes = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: `data=${encodeURIComponent(overpassQuery)}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      if (overpassRes.ok) {
        overpassData = await overpassRes.json();
      }
    } catch (e) {
      console.warn("OSM rate limited in trip API:", e);
    }
    const attractions = (overpassData.elements || [])
      .filter((el: any) => el.tags?.name)
      .map((el: any) => el.tags.name)
      .filter((name: string) => name.length > 2 && name.length < 50)
      .slice(0, 20);

    return attractions;
  } catch {
    return [];
  }
}

async function getWikipediaInfo(destination: string): Promise<string> {
  try {
    // 1. Search to find the exact page title (avoids disambiguation pages)
    const searchRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(destination + " destination")}&format=json&srlimit=1&origin=*`
    );
    const searchData = await searchRes.json();
    const topPage = searchData.query?.search?.[0]?.title || destination;

    // 2. Fetch the summary for the exact page
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topPage)}`,
      { headers: { "User-Agent": "VoyageAI/1.0" } }
    );
    const data = await res.json();
    return data.extract || "";
  } catch {
    return "";
  }
}

function buildItinerary(attractions: string[], days: number, style: string, destination: string) {
  const fallbackAttractions = [
    `Explore ${destination} city center`,
    `Visit the main ${destination} museum`,
    `Walk along the ${destination} scenic route`,
    `Shop at the famous ${destination} market`,
    `Enjoy sunset at the ${destination} viewpoint`,
    `Tour the historic district of ${destination}`,
    `Relax at the local ${destination} park`,
    `Experience the ${destination} cultural show`,
  ];

  const sourceAttractions = attractions.length > 0 ? attractions : fallbackAttractions;
  
  const itinerary = [];
  let attractionIndex = 0;

  for (let day = 1; day <= days; day++) {
    const pick = () => {
      if (attractionIndex < sourceAttractions.length) return sourceAttractions[attractionIndex++];
      return fallbackAttractions[Math.floor(Math.random() * fallbackAttractions.length)];
    };

    itinerary.push({
      day,
      title: day === 1 ? "Arrival & Exploration" : day === days ? "Departure Day" : `Day ${day} Adventures`,
      morning: pick(),
      afternoon: pick(),
      evening: pick(),
    });
  }
  return itinerary;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { source = "Chennai", destination, budget = "25000", duration = "4", style = "adventure" } = body;

    // Parse duration
    const days = parseInt(String(duration).replace(/\D/g, "")) || 4;

    // Determine destination: if not given, infer from style
    const styleDestinations: Record<string, string> = {
      adventure: "Manali",
      relaxation: "Goa",
      "culture & heritage": "Jaipur",
      beach: "Goa",
      mountain: "Manali",
      spiritual: "Varanasi",
    };
    const targetDest = destination || styleDestinations[style.toLowerCase()] || "Goa";

    // Parallel fetch: attractions from OSM + Wikipedia info
    const [attractions, wikiInfo] = await Promise.all([
      getAttractions(targetDest),
      getWikipediaInfo(targetDest),
    ]);

    // Live weather for destination
    let currentWeather = null;
    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(targetDest)}&format=json&limit=1`,
        { headers: { "User-Agent": "VoyageAI/1.0" } }
      );
      const geo = await geoRes.json();
      if (geo.length > 0) {
        const wRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${geo[0].lat}&longitude=${geo[0].lon}&current_weather=true`
        );
        const wData = await wRes.json();
        if (wData.current_weather) {
          currentWeather = `${Math.round(wData.current_weather.temperature)}°C`;
        }
      }
    } catch {}

    const budgetNum = parseInt(String(budget).replace(/\D/g, "")) || 25000;
    
    // Use ML generated itinerary if available, else build manually
    const itinerary = buildItinerary(attractions, days, style, targetDest);

    return NextResponse.json({
      destination: targetDest,
      source,
      estimated_budget: `₹${Math.round(budgetNum * 0.85).toLocaleString()} – ₹${budgetNum.toLocaleString()}`,
      travel_style: style,
      current_weather: currentWeather,
      about: wikiInfo.slice(0, 300) + (wikiInfo.length > 300 ? "..." : ""),
      real_attractions_found: attractions.length,
      days: itinerary,
      predicted_rating: 4.5,
      tips: [
        `Best time to visit ${targetDest}: check seasonal weather patterns.`,
        "Book accommodations at least 2 weeks in advance.",
        "Carry cash for local vendors and street food.",
        "Use Google Maps offline for navigation.",
      ],
    });
  } catch (error: any) {
    console.error("Trip Error:", error);
    return NextResponse.json({ error: "Failed to generate itinerary" }, { status: 500 });
  }
}
