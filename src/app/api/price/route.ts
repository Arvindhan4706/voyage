import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { source, destination, dates, passengers = 1 } = body;

    if (!source || !destination) {
      return NextResponse.json({ error: "Source and destination required" }, { status: 400 });
    }

    if (source.trim().toLowerCase() === destination.trim().toLowerCase()) {
      return NextResponse.json({ error: "Source and destination cannot be the same place." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

    const prompt = `Act as an expert Flight Pricing AI Analyst.
I need a highly realistic flight pricing prediction and mocked flight schedules from ${source} to ${destination} for the date ${dates || "upcoming"}.
Assume currency is INR.
Provide exactly the JSON format described below.

JSON Schema Requirements:
{
  "price": (number) The estimated current best price in INR for 1 passenger,
  "distance_km": (number) Approximate distance in km,
  "historical_low": (number) Lowest recorded price in INR,
  "historical_high": (number) Highest recorded price in INR,
  "confidence": (number) Prediction confidence percentage between 70 and 99,
  "trend": (string) Must be one of: "rising", "falling", "stable",
  "calculation_method": (string) "AI Predicted via Gemini",
  "real_flights": [
    (array of exactly 3 realistic flight options)
    {
      "airline": (string) Name of realistic airline for this route (e.g. "Emirates"),
      "logo": (string) URL formatted as "https://logo.clearbit.com/emirates.com" (use the airline's actual domain),
      "departure": (string) e.g. "10:00 AM",
      "arrival": (string) e.g. "02:30 PM",
      "duration": (number) Flight duration in minutes,
      "price": (number) Price in INR for 1 passenger
    }
  ]
}`;

    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
          responseSchema: {
            type: "OBJECT",
            properties: {
              price: { type: "NUMBER" },
              distance_km: { type: "NUMBER" },
              historical_low: { type: "NUMBER" },
              historical_high: { type: "NUMBER" },
              confidence: { type: "NUMBER" },
              trend: { type: "STRING" },
              calculation_method: { type: "STRING" },
              real_flights: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    airline: { type: "STRING" },
                    logo: { type: "STRING" },
                    departure: { type: "STRING" },
                    arrival: { type: "STRING" },
                    duration: { type: "NUMBER" },
                    price: { type: "NUMBER" }
                  },
                  required: ["airline", "logo", "departure", "arrival", "duration", "price"]
                }
              }
            },
            required: ["price", "distance_km", "historical_low", "historical_high", "confidence", "trend", "calculation_method", "real_flights"]
          }
        }
      })
    });

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      console.error("Flight API Gemini Error:", err);
      throw new Error(`Gemini API failed: ${err}`);
    }

    const data = await geminiRes.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const prediction = JSON.parse(content.replace(/^```json/i, "").replace(/```$/, "").trim());

    // Adjust prices for number of passengers
    prediction.price = Math.round(prediction.price * passengers);
    prediction.historical_low = Math.round(prediction.historical_low * passengers);
    prediction.historical_high = Math.round(prediction.historical_high * passengers);
    prediction.real_flights = prediction.real_flights.map((f: any) => ({
      ...f,
      price: Math.round(f.price * passengers)
    }));

    return NextResponse.json(prediction);
  } catch (error) {
    console.error("Price API Error:", error);
    return NextResponse.json({ error: "Failed to predict price" }, { status: 500 });
  }
}
