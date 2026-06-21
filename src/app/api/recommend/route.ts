import { NextResponse } from "next/server";

// Geocode and weather fetcher
async function getLiveDetails(placeTitle: string) {
  try {
    const sumRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(placeTitle)}`,
      { headers: { "User-Agent": "VoyageAI/1.0" } }
    );
    const sum = await sumRes.json();
    if (!sum.title) return null;

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

    return {
      destination: sum.title,
      image: sum.thumbnail?.source?.replace(/\/\d+px-/, "/800px-") || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
      description: sum.extract?.slice(0, 100) + "...",
      lat,
      lon,
    };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { history_tags = ["Travel", "Tourism"] } = body;

    // 1. Convert user's unique history into a dynamic Wikipedia search query
    // Enforce that it's an actual location by adding terms like city, island, or region
    const keywords = history_tags.slice(0, 3).join(" ");
    const searchQuery = `${keywords} (city OR island OR resort) tourism`;

    // 2. Fetch live matching places from Wikipedia
    const searchRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchQuery)}&format=json&srlimit=10&origin=*`,
      { cache: "no-store" }
    );
    const searchData = await searchRes.json();
    const pages = searchData.query?.search || [];

    // Shuffle results so we don't always give the exact same top 4
    const shuffledPages = pages.sort(() => 0.5 - Math.random()).slice(0, 4);

    // 3. Get rich data for these places
    const recommendations = (
      await Promise.all(shuffledPages.map((p: any) => getLiveDetails(p.title)))
    ).filter(Boolean);

    // 4. Format them with dynamic scores
    const finalRecs = recommendations.map((rec: any, idx: number) => ({
      id: Math.random().toString(),
      destination: rec.destination,
      matchScore: Math.floor(88 + Math.random() * 10), // dynamically generated score
      cost: `₹${Math.round(15000 + Math.random() * 50000).toLocaleString()}`,
      tags: history_tags.slice(0, 2).concat(["Live Result"]),
      image: rec.image,
    }));

    return NextResponse.json(finalRecs);
  } catch (error) {
    console.error("Recommend error:", error);
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 });
  }
}
