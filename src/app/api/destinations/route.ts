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

async function getDestinationData(query: string) {
  try {
    const titleSlug = query.split(" ").slice(0, 3).join("_");
    const sumRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titleSlug)}`,
      { headers: { "User-Agent": "VoyageAI/1.0" } }
    );
    const sum = await sumRes.json();
    if (!sum.title || sum.type === "disambiguation") return null;

    let lat = sum.coordinates?.lat;
    let lon = sum.coordinates?.lon;

    if (!lat || !lon) {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(sum.title)}&format=json&limit=1`,
        { headers: { "User-Agent": "VoyageAI/1.0" } }
      );
      const geo = await geoRes.json();
      if (geo.length > 0) {
        lat = parseFloat(geo[0].lat);
        lon = parseFloat(geo[0].lon);
      }
    }

    let weather = "N/A";
    let weatherCode = 0;
    if (lat && lon) {
      const wRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      const wData = await wRes.json();
      if (wData.current_weather) {
        weather = `${Math.round(wData.current_weather.temperature)}°C`;
        weatherCode = wData.current_weather.weathercode;
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

  try {
    // 100% Dynamic: Pick a random seed keyword, search Wikipedia dynamically, and grab top results
    const searchQuery = q ? (q + " tourist destination") : SEED_KEYWORDS[Math.floor(Math.random() * SEED_KEYWORDS.length)];
    const randomOffset = q ? 0 : Math.floor(Math.random() * 20); // Get different results every time if no query
    
    const searchRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchQuery)}&format=json&srlimit=8&sroffset=${randomOffset}&origin=*`,
      { cache: "no-store" } // Ensure it's never cached on Vercel
    );
    const searchData = await searchRes.json();
    const pages = searchData.query?.search || [];

    const destinations = (
      await Promise.all(pages.map((p: any) => getDestinationData(p.title)))
    ).filter(Boolean);

    return NextResponse.json(destinations.slice(0, 6)); // Return up to 6 real dynamic destinations
  } catch (error) {
    console.error("Destinations error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
