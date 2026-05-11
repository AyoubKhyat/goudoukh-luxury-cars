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

    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        car: true,
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ reservation });
  } catch (error) {
    console.error("Get reservation error:", error);
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

    const existingReservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!existingReservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { status, notes } = body;

    const updateData: Record<string, unknown> = {};

    if (status !== undefined) {
      const validStatuses = [
        "pending",
        "confirmed",
        "active",
        "completed",
        "cancelled",
      ];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          {
            error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
          },
          { status: 400 }
        );
      }
      updateData.status = status;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const reservation = await prisma.reservation.update({
      where: { id },
      data: updateData,
      include: {
        car: true,
      },
    });

    return NextResponse.json({ reservation });
  } catch (error) {
    console.error("Update reservation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
