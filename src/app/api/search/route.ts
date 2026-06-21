import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "Bali travel tourism";

  try {
    // 1. Wikipedia Search for destination info
    const wikiSearchRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q + " travel tourism destination")}&format=json&srlimit=5&origin=*`
    );
    const wikiSearch = await wikiSearchRes.json();
    const topPages = wikiSearch.query?.search || [];

    // 2. Get summaries for top results
    const summaries = await Promise.all(
      topPages.slice(0, 4).map(async (page: any) => {
        try {
          const sumRes = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(page.title)}`,
            { headers: { "User-Agent": "VoyageAI/1.0" } }
          );
          const sum = await sumRes.json();

          // 3. Geocode the destination for coordinates
          let weather = null;
          let lat = sum.coordinates?.lat;
          let lon = sum.coordinates?.lon;

          if (!lat || !lon) {
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(page.title)}&format=json&limit=1`,
              { headers: { "User-Agent": "VoyageAI/1.0 contact@voyageai.com" } }
            );
            const geo = await geoRes.json();
            if (geo.length > 0) {
              lat = parseFloat(geo[0].lat);
              lon = parseFloat(geo[0].lon);
            }
          }

          // 4. Get live weather from Open-Meteo
          if (lat && lon) {
            const weatherRes = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m&forecast_days=1`
            );
            const weatherData = await weatherRes.json();
            if (weatherData.current_weather) {
              weather = {
                temp: `${Math.round(weatherData.current_weather.temperature)}°C`,
                windspeed: `${weatherData.current_weather.windspeed} km/h`,
                is_day: weatherData.current_weather.is_day,
              };
            }
          }

          return {
            id: page.pageid,
            name: sum.title,
            extract: sum.extract?.slice(0, 200) + "...",
            fullExtract: sum.extract,
            image: sum.thumbnail?.source || null,
            url: sum.content_urls?.desktop?.page,
            weather,
            lat,
            lon,
            country: sum.description || "",
          };
        } catch {
          return null;
        }
      })
    );

    const results = summaries.filter(Boolean);
    return NextResponse.json({ results, query: q });
  } catch (error) {
    console.error("Search Error:", error);
    return NextResponse.json({ results: [], query: q, error: "Search failed" }, { status: 500 });
  }
}
