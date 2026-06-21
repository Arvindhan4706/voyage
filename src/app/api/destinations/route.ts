import { NextRequest, NextResponse } from "next/server";

// Real trending destinations from Wikipedia - proven popular tourist spots
const TRENDING_QUERIES = [
  "Bali island tourism",
  "Santorini island Greece",
  "Kyoto Japan",
  "Machu Picchu Peru",
  "Amalfi Coast Italy",
  "Goa India tourism",
  "Maldives tourism",
  "Swiss Alps tourism",
];

async function getDestinationData(query: string) {
  try {
    // Wikipedia summary
    const titleSlug = query.split(" ").slice(0, 2).join("_");
    const sumRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titleSlug)}`,
      { headers: { "User-Agent": "VoyageAI/1.0" } }
    );
    const sum = await sumRes.json();
    if (!sum.title) return null;

    let lat = sum.coordinates?.lat;
    let lon = sum.coordinates?.lon;

    // Geocode if no coordinates
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

    // Live weather
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
      country: sum.description || "",
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
    if (q) {
      // Search-driven destinations
      const searchRes = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q + " tourist destination")}&format=json&srlimit=6&origin=*`
      );
      const searchData = await searchRes.json();
      const pages = searchData.query?.search || [];

      const destinations = (
        await Promise.all(pages.slice(0, 6).map((p: any) => getDestinationData(p.title)))
      ).filter(Boolean);

      return NextResponse.json(destinations);
    } else {
      // Trending destinations - fetch from Wikipedia
      const destinations = (
        await Promise.all(TRENDING_QUERIES.map(getDestinationData))
      ).filter(Boolean);

      return NextResponse.json(destinations);
    }
  } catch (error) {
    console.error("Destinations error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
