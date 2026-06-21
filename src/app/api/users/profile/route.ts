import { NextRequest, NextResponse } from "next/server";

// Simple profile storage (serverless-compatible)
const profiles = new Map<string, any>();

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id') || 'demo';
  const profile = profiles.get(userId) || {
    userId,
    budgetPreference: 25000,
    travelStyle: "adventure",
    favoriteDestinations: ["Goa", "Manali"],
    searchHistory: [],
  };
  return NextResponse.json(profile);
}

export async function PUT(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || 'demo';
    const body = await req.json();

    const profile = {
      ...profiles.get(userId),
      userId,
      budgetPreference: body.budgetPreference,
      travelStyle: body.travelStyle,
      favoriteDestinations: body.favoriteDestinations || [],
      searchHistory: body.searchHistory || [],
    };

    profiles.set(userId, profile);
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
