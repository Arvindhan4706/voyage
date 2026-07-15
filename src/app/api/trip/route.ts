import { NextResponse } from "next/server";

async function getAttractions(destination: string): Promise<string[]> {
  try {
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json&limit=1`,
      { headers: { "User-Agent": "VoyageAI/1.0" } }
    );
    if (!geoRes.ok) return [];
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
    let coordinates = { lat: 0, lon: 0 };
    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(targetDest)}&format=json&limit=1`,
        { headers: { "User-Agent": "VoyageAI/1.0" } }
      );
      if (geoRes.ok) {
        const geo = await geoRes.json();
        if (geo.length > 0) {
          coordinates = { lat: parseFloat(geo[0].lat), lon: parseFloat(geo[0].lon) };
          const wRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${geo[0].lat}&longitude=${geo[0].lon}&current_weather=true`
          );
          if (wRes.ok) {
            const wData = await wRes.json();
            if (wData.current_weather) {
              currentWeather = `${Math.round(wData.current_weather.temperature)}°C`;
            }
          }
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
Do not include any placeholders.

OUTPUT STRICTLY IN THE FOLLOWING JSON FORMAT ONLY:
{
  "destination": "string",
  "source": "string",
  "estimated_budget": "string",
  "travel_style": "string",
  "current_weather": "string",
  "about": "string",
  "real_attractions_found": number,
  "predicted_rating": number,
  "tips": ["string"],
  "days": [
    {
      "day": number,
      "title": "string",
      "morning": "string",
      "afternoon": "string",
      "evening": "string",
      "full_day": "string (optional)"
    }
  ]
}
`;

    const mockFallback = {
      destination: targetDest,
      source: source,
      estimated_budget: `₹${budget}`,
      travel_style: style,
      current_weather: currentWeather,
      about: wikiInfo || `Experience the beauty of ${targetDest} on this luxury getaway.`,
      real_attractions_found: attractions.length,
      predicted_rating: 4.8,
      coordinates,
      tips: ["Book luxury transport in advance", "Try local premium dining", "Pack accordingly for the weather"],
      days: [
        {
          day: 1,
          title: "Arrival & Orientation",
          morning: "Arrive via luxury transfer and check into a 5-star suite.",
          afternoon: "Enjoy a premium spa session to unwind from the flight.",
          evening: "Exclusive fine dining experience with panoramic views."
        },
        {
          day: 2,
          title: "Exploration & Culture",
          morning: `Private guided tour of top attractions including ${attractions[0] || 'local landmarks'}.`,
          afternoon: "Helicopter or premium yacht tour of the surrounding landscapes.",
          evening: "Sunset cocktails followed by a traditional premium dinner."
        },
        {
          day: 3,
          title: "Leisure & Departure",
          morning: "Breakfast in bed followed by private shopping or leisure.",
          afternoon: "Luxury transport back to the airport.",
          evening: "Safe travels."
        }
      ]
    };

    try {
      // Add timeout signal (AbortController not available natively in all Edge environments, but standard fetch supports signal)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.7,
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!groqRes.ok) {
        throw new Error("Groq API failed");
      }

      const groqData = await groqRes.json();
      const content = groqData.choices[0].message.content;
      const itineraryData = JSON.parse(content || "{}");
      itineraryData.coordinates = coordinates;
      
      // Merge with fallback to ensure no missing keys
      return NextResponse.json({ ...mockFallback, ...itineraryData });
    } catch (e) {
      console.warn("Groq API failed or timed out. Using mock fallback.", e);
      return NextResponse.json(mockFallback);
    }
  } catch (error: any) {
    console.error("Trip Error - Catch All:", error);
    // Ultimate fallback if even parsing the request fails
    return NextResponse.json({ error: "Failed to generate itinerary, completely broken." }, { status: 500 });
  }
}
