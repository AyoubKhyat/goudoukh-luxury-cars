import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        reservations: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    return NextResponse.json({ car });
  } catch (error) {
    console.error("Get car error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingCar = await prisma.car.findUnique({ where: { id } });
    if (!existingCar) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
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
      available,
      featured,
    } = body;

    // Build update data with only provided fields
    const updateData: Record<string, unknown> = {};

    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (pricePerDay !== undefined) updateData.pricePerDay = Number(pricePerDay);
    if (zeroToHundred !== undefined) updateData.zeroToHundred = zeroToHundred;
    if (topSpeed !== undefined) updateData.topSpeed = Number(topSpeed);
    if (seats !== undefined) updateData.seats = Number(seats);
    if (engine !== undefined) updateData.engine = engine;
    if (transmission !== undefined) updateData.transmission = transmission;
    if (colors !== undefined) {
      updateData.colors =
        typeof colors === "string" ? colors : JSON.stringify(colors);
    }
    if (image !== undefined) updateData.image = image;
    if (available !== undefined) updateData.available = Boolean(available);
    if (featured !== undefined) updateData.featured = Boolean(featured);

    const car = await prisma.car.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ car });
  } catch (error) {
    console.error("Update car error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        reservations: {
          where: {
            status: { in: ["pending", "confirmed", "active"] },
          },
        },
      },
    });

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    if (car.reservations.length > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete car with active reservations. Cancel or complete all reservations first.",
        },
        { status: 409 }
      );
    }

    // Delete all completed/cancelled reservations first, then the car
    await prisma.reservation.deleteMany({ where: { carId: id } });
    await prisma.car.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete car error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
