import { NextRequest, NextResponse } from "next/server";

// Static destination data — works 100% serverlessly on Vercel
const staticDestinations = [
  { id: "1", name: "Bali", country: "Indonesia", weather: "29°C", cost: 35000, season: "Year-round", activities: JSON.stringify(["Surfing", "Temple Visits", "Rice Terraces"]), ratings: 4.9 },
  { id: "2", name: "Kyoto", country: "Japan", weather: "15°C", cost: 55000, season: "Spring/Autumn", activities: JSON.stringify(["Temple Tours", "Geisha Districts", "Bamboo Groves"]), ratings: 4.8 },
  { id: "3", name: "Swiss Alps", country: "Switzerland", weather: "-2°C", cost: 120000, season: "Winter/Summer", activities: JSON.stringify(["Skiing", "Hiking", "Cable Cars"]), ratings: 4.9 },
  { id: "4", name: "Santorini", country: "Greece", weather: "24°C", cost: 80000, season: "Summer", activities: JSON.stringify(["Sunset Views", "Wine Tasting", "Sailing"]), ratings: 4.8 },
  { id: "5", name: "Goa", country: "India", weather: "28°C", cost: 18000, season: "November-February", activities: JSON.stringify(["Beach Parties", "Water Sports", "Portuguese Heritage"]), ratings: 4.6 },
  { id: "6", name: "Manali", country: "India", weather: "8°C", cost: 15000, season: "Summer/Winter", activities: JSON.stringify(["Trekking", "Skiing", "River Rafting"]), ratings: 4.7 },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get('country');

    let destinations = country
      ? staticDestinations.filter(d => d.country.toLowerCase() === country.toLowerCase())
      : staticDestinations;

    // Enrich with real-time weather from Open-Meteo
    const enriched = await Promise.all(destinations.map(async (dest) => {
      try {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(dest.name)}&count=1&language=en&format=json`,
          { next: { revalidate: 3600 } }
        );
        const geoData = await geoRes.json();
        if (geoData.results && geoData.results.length > 0) {
          const { latitude, longitude } = geoData.results[0];
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
            { next: { revalidate: 3600 } }
          );
          const weatherData = await weatherRes.json();
          return { ...dest, weather: `${Math.round(weatherData.current_weather.temperature)}°C` };
        }
      } catch (e) {
        // Weather fetch failed, use static data
      }
      return dest;
    }));

    return NextResponse.json(enriched);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: "Destination creation is not supported in serverless mode" }, { status: 501 });
}
