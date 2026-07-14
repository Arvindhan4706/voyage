import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function getAttractions(destination: string): Promise<string[]> {
  try {
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
    const searchRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(destination + " destination")}&format=json&srlimit=1&origin=*`
    );
    const searchData = await searchRes.json();
    const topPage = searchData.query?.search?.[0]?.title || destination;

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

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    destination: { type: Type.STRING },
    source: { type: Type.STRING },
    estimated_budget: { type: Type.STRING },
    travel_style: { type: Type.STRING },
    current_weather: { type: Type.STRING },
    about: { type: Type.STRING },
    real_attractions_found: { type: Type.INTEGER },
    predicted_rating: { type: Type.NUMBER },
    tips: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    days: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER },
          title: { type: Type.STRING },
          morning: { type: Type.STRING },
          afternoon: { type: Type.STRING },
          evening: { type: Type.STRING }
        },
        required: ["day", "title", "morning", "afternoon", "evening"]
      }
    }
  },
  required: [
    "destination", "source", "estimated_budget", "travel_style",
    "about", "real_attractions_found", "predicted_rating", "tips", "days"
  ]
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { source = "Chennai", destination, budget = "25000", duration = "4", style = "adventure" } = body;

    const days = parseInt(String(duration).replace(/\D/g, "")) || 4;

    const styleDestinations: Record<string, string> = {
      adventure: "Manali",
      relaxation: "Goa",
      "culture & heritage": "Jaipur",
      beach: "Goa",
      mountain: "Manali",
      spiritual: "Varanasi",
    };
    const targetDest = destination || styleDestinations[style.toLowerCase()] || "Goa";

    const [attractions, wikiInfo] = await Promise.all([
      getAttractions(targetDest),
      getWikipediaInfo(targetDest),
    ]);

    let currentWeather = "Unknown";
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

    const prompt = `
You are an elite, luxury travel concierge AI called Voyage AI.
Design a highly personalized, premium travel itinerary based on the following parameters:
- Source: ${source}
- Destination: ${targetDest}
- Budget: ₹${budget}
- Duration: ${days} days
- Travel Style: ${style}

Use the following real-time data gathered for ${targetDest}:
- Current Weather: ${currentWeather}
- Summary: ${wikiInfo}
- Notable Attractions: ${attractions.join(', ')}

Create a day-by-day luxury itinerary. For each day, provide a title, and highly descriptive, premium activities for morning, afternoon, and evening. 
Do not include any placeholders, output exactly in the requested JSON structure.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const itineraryData = JSON.parse(response.text || "{}");

    return NextResponse.json(itineraryData);
  } catch (error: any) {
    console.error("Trip Error:", error);
    return NextResponse.json({ error: "Failed to generate itinerary" }, { status: 500 });
  }
}
