import { NextRequest, NextResponse } from "next/server";

// Static hotel data — works 100% serverlessly on Vercel
const staticHotels = [
  {
    id: "1",
    name: "Azure Wellness Resort",
    location: "Bali, Indonesia",
    price: 8500,
    amenities: JSON.stringify(["Infinity Pool", "Spa", "Private Beach", "Yoga Studio"]),
    ratings: 4.8,
  },
  {
    id: "2",
    name: "The Metropolitan Hub",
    location: "Kyoto, Japan",
    price: 4200,
    amenities: JSON.stringify(["WiFi", "City View", "Gym", "Business Center"]),
    ratings: 4.5,
  },
  {
    id: "3",
    name: "Alpine Grand Hotel",
    location: "Swiss Alps, Switzerland",
    price: 22000,
    amenities: JSON.stringify(["Ski-in/Ski-out", "Fireplace", "Heated Pool", "Fine Dining"]),
    ratings: 4.9,
  },
  {
    id: "4",
    name: "Sunset Caldera Suites",
    location: "Santorini, Greece",
    price: 15000,
    amenities: JSON.stringify(["Caldera View", "Private Plunge Pool", "Butler Service"]),
    ratings: 4.9,
  },
  {
    id: "5",
    name: "Goa Beach Shack Resort",
    location: "Goa, India",
    price: 3500,
    amenities: JSON.stringify(["Beachfront", "Water Sports", "Restaurant", "Bar"]),
    ratings: 4.4,
  },
  {
    id: "6",
    name: "Snow Peak Manali Retreat",
    location: "Manali, India",
    price: 2800,
    amenities: JSON.stringify(["Mountain View", "Bonfire", "Trekking Guide", "Heated Rooms"]),
    ratings: 4.6,
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get('location');

    const hotels = location
      ? staticHotels.filter(h => h.location.toLowerCase().includes(location.toLowerCase()))
      : staticHotels;

    return NextResponse.json(hotels);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: "Hotel creation is not supported in serverless mode" }, { status: 501 });
}
