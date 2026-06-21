import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: { name: true, email: true, role: true }
        }
      }
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();

    const profile = await prisma.profile.upsert({
      where: { userId },
      update: {
        budgetPreference: body.budgetPreference,
        travelStyle: body.travelStyle,
        favoriteDestinations: body.favoriteDestinations,
      },
      create: {
        userId,
        budgetPreference: body.budgetPreference,
        travelStyle: body.travelStyle,
        favoriteDestinations: body.favoriteDestinations || [],
        searchHistory: []
      }
    });

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
