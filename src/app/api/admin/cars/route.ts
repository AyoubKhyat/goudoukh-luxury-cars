import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cars = await prisma.car.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { reservations: true },
        },
      },
    });

    return NextResponse.json({ cars });
  } catch (error) {
    console.error("Get cars error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[ñ]/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      category,
      description,
      pricePerDay,
      zeroToHundred,
      topSpeed,
      seats,
      engine,
      transmission,
      colors,
      image,
      featured,
    } = body;

    if (!name || !category || !description || !pricePerDay) {
      return NextResponse.json(
        { error: "Name, category, description, and pricePerDay are required" },
        { status: 400 }
      );
    }

    // Generate slug and ensure uniqueness
    let slug = generateSlug(name);
    const existingCar = await prisma.car.findUnique({ where: { slug } });
    if (existingCar) {
      slug = `${slug}-${Date.now()}`;
    }

    const car = await prisma.car.create({
      data: {
        name,
        slug,
        category,
        description,
        pricePerDay: Number(pricePerDay),
        zeroToHundred: zeroToHundred || "N/A",
        topSpeed: Number(topSpeed) || 0,
        seats: Number(seats) || 4,
        engine: engine || "Twin-Turbo V8",
        transmission: transmission || "Automatic",
        colors: typeof colors === "string" ? colors : JSON.stringify(colors || []),
        image: image || "/images/placeholder.jpg",
        featured: Boolean(featured),
      },
    });

    return NextResponse.json({ car }, { status: 201 });
  } catch (error) {
    console.error("Create car error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
