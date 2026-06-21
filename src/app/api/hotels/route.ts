import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get('location');
    
    const query = location ? { where: { location } } : undefined;
    const hotels = await prisma.hotel.findMany(query);
    
    return NextResponse.json(hotels);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const hotel = await prisma.hotel.create({
      data: {
        name: body.name,
        location: body.location,
        price: body.price,
        amenities: body.amenities || [],
        ratings: body.ratings || 0.0,
      }
    });
    
    return NextResponse.json(hotel, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
