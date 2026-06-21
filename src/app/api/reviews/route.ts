import { NextRequest, NextResponse } from "next/server";

// In-memory review storage (resets per serverless invocation — acceptable for demo)
const reviews: any[] = [];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const destinationId = searchParams.get('destinationId');
  const hotelId = searchParams.get('hotelId');
  
  let filtered = reviews;
  if (destinationId) filtered = filtered.filter(r => r.destinationId === destinationId);
  if (hotelId) filtered = filtered.filter(r => r.hotelId === hotelId);
  
  return NextResponse.json(filtered);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const review = {
      id: Date.now().toString(),
      userId: body.userId || "anonymous",
      destinationId: body.destinationId || null,
      hotelId: body.hotelId || null,
      reviewText: body.reviewText,
      rating: body.rating,
      createdAt: new Date().toISOString(),
    };

    reviews.push(review);
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
