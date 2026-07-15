import { NextRequest, NextResponse } from "next/server";

// Dynamic keywords to seed the live Wikipedia search
const SEED_KEYWORDS = [
  "popular tourist destination island",
  "historic city tourism",
  "mountain resort town",
  "famous beach destination",
  "cultural capital tourism",
  "national park travel",
];

async function fetchWithTimeout(resource: string, options: RequestInit = {}) {
  const { timeout = 4000 } = options as any;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

async function getDestinationData(query: string) {
  try {
    const titleSlug = query.split(" ").slice(0, 3).join("_");
    const sumRes = await fetchWithTimeout(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titleSlug)}`,
      { headers: { "User-Agent": "VoyageAI/1.0" } }
    );
    const sum = await sumRes.json();
    if (!sum.title || sum.type === "disambiguation") return null;

    let lat = sum.coordinates?.lat;
    let lon = sum.coordinates?.lon;

    let weather = "N/A";
    let weatherCode = 0;
    if (lat && lon) {
      try {
        const wRes = await fetchWithTimeout(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const wData = await wRes.json();
        if (wData.current_weather) {
          weather = `${Math.round(wData.current_weather.temperature)}°C`;
          weatherCode = wData.current_weather.weathercode;
        }
      } catch (e) {
        // Silently ignore weather failures
      }
    }

    return {
      id: sum.pageid?.toString() || Math.random().toString(),
      name: sum.title,
      country: sum.description || "Global Destination",
      extract: sum.extract?.slice(0, 160) + "...",
      image: sum.thumbnail?.source?.replace(/\/\d+px-/, "/800px-") || null,
      wikiUrl: sum.content_urls?.desktop?.page,
      weather,
      weatherCode,
      lat,
      lon,
      ratings: +(4 + Math.random()).toFixed(1),
    };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  // Fallback mock data in case of Wikipedia API failure
  const mockDestinations = [
    {
      id: "mock1",
      name: "Paris",
      country: "France",
      extract: "Paris is the capital and most populous city of France, known for its cafe culture and landmarks like the Eiffel Tower.",
      image: "https://images.unsplash.com/photo-1502602898657-3e90760b2131?w=800&q=80",
      weather: "15°C",
      weatherCode: 0,
      ratings: 4.8,
    },
    {
      id: "mock2",
      name: "Kyoto",
      country: "Japan",
      extract: "Kyoto is famous for its numerous classical Buddhist temples, as well as gardens, imperial palaces, Shinto shrines and traditional wooden houses.",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
      weather: "22°C",
      weatherCode: 2,
      ratings: 4.9,
    },
    {
      id: "mock3",
      name: "Santorini",
      country: "Greece",
      extract: "Santorini is one of the Cyclades islands in the Aegean Sea, devastated by a volcanic eruption in the 16th century BC.",
      image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80",
      weather: "28°C",
      weatherCode: 1,
      ratings: 4.7,
    },
    {
      id: "mock4",
      name: "Bali",
      country: "Indonesia",
      extract: "Bali is an Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
      weather: "30°C",
      weatherCode: 3,
      ratings: 4.6,
    }
  ];

  try {
    const searchQuery = q ? (q + " tourist destination") : SEED_KEYWORDS[Math.floor(Math.random() * SEED_KEYWORDS.length)];
    const randomOffset = q ? 0 : Math.floor(Math.random() * 20);
    
    const searchRes = await fetchWithTimeout(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchQuery)}&format=json&srlimit=8&sroffset=${randomOffset}&origin=*`,
      { cache: "no-store" }
    );

    if (!searchRes.ok) throw new Error("Wikipedia API failed");
    
    const text = await searchRes.text();
    let searchData;
    try {
      searchData = JSON.parse(text);
    } catch (e) {
      throw new Error("Invalid JSON from Wikipedia");
    }

    const pages = searchData.query?.search || [];

    const destinations = (
      await Promise.all(pages.map((p: any) => getDestinationData(p.title)))
    ).filter(Boolean);

    if (destinations.length === 0) {
      return NextResponse.json(mockDestinations);
    }

    return NextResponse.json(destinations.slice(0, 6));
  } catch (error) {
    // Silently fallback without polluting console
    return NextResponse.json(mockDestinations);
  }
}
