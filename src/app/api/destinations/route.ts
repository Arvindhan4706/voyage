import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get('country');
    
    const query = country ? { where: { country } } : undefined;
    const destinations = await prisma.destination.findMany(query);
    
    // Enrich with Real-Time Processed Data (Live Weather)
    const enrichedDestinations = await Promise.all(destinations.map(async (dest: any) => {
      try {
        // Geocoding to get coordinates
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${dest.name}&count=1&language=en&format=json`);
        const geoData = await geoRes.json();
        if (geoData.results && geoData.results.length > 0) {
          const { latitude, longitude } = geoData.results[0];
          // Real-time weather fetch
          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
          const weatherData = await weatherRes.json();
          return { ...dest, weather: `${Math.round(weatherData.current_weather.temperature)}°C` };
        }
      } catch (e) {
        console.error("Failed to fetch live weather for", dest.name);
      }
      return dest;
    }));
    
    return NextResponse.json(enrichedDestinations);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const destination = await prisma.destination.create({
      data: {
        name: body.name,
        country: body.country,
        weather: body.weather,
        cost: body.cost,
        season: body.season,
        activities: body.activities || [],
        ratings: body.ratings || 0.0,
      }
    });
    
    return NextResponse.json(destination, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
