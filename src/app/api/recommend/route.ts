import { NextResponse } from "next/server";

// Serverless collaborative-filtering style recommendation engine
const allDestinations = [
  { id: "1", name: "Goa", type: "beach", budget: 20000, season: "Winter", tags: ["beach", "party", "relaxation"], rating: 4.7 },
  { id: "2", name: "Manali", type: "mountain", budget: 18000, season: "Summer", tags: ["adventure", "snow", "trekking"], rating: 4.8 },
  { id: "3", name: "Jaipur", type: "heritage", budget: 12000, season: "Winter", tags: ["culture", "heritage", "architecture"], rating: 4.6 },
  { id: "4", name: "Andaman", type: "island", budget: 35000, season: "Summer", tags: ["diving", "beach", "nature"], rating: 4.9 },
  { id: "5", name: "Kerala Backwaters", type: "nature", budget: 22000, season: "Monsoon", tags: ["relaxation", "nature", "houseboat"], rating: 4.8 },
  { id: "6", name: "Rishikesh", type: "adventure", budget: 10000, season: "Year-round", tags: ["yoga", "rafting", "adventure"], rating: 4.7 },
  { id: "7", name: "Varanasi", type: "spiritual", budget: 8000, season: "Winter", tags: ["spiritual", "culture", "heritage"], rating: 4.5 },
  { id: "8", name: "Coorg", type: "nature", budget: 15000, season: "Year-round", tags: ["coffee", "nature", "trekking"], rating: 4.6 },
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { budget = 25000, style = "adventure", season = "any" } = body;

    // Score each destination based on user preferences (simplified CF)
    const scored = allDestinations.map(dest => {
      let score = 0;
      if (dest.budget <= budget) score += 30;
      if (dest.tags.some((t: string) => style.toLowerCase().includes(t))) score += 40;
      if (season === "any" || dest.season.toLowerCase().includes(season.toLowerCase()) || dest.season === "Year-round") score += 20;
      score += dest.rating * 2;
      return { ...dest, score };
    });

    const recommendations = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(d => ({
        name: d.name,
        type: d.type,
        estimated_budget: `₹${d.budget.toLocaleString()}`,
        rating: d.rating,
        tags: d.tags,
        match_score: Math.min(99, Math.round(d.score)),
      }));

    return NextResponse.json({ recommendations, total: recommendations.length });
  } catch (error: any) {
    console.error("Recommendation Error:", error);
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 });
  }
}
