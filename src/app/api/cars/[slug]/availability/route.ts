import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let car = await prisma.car.findUnique({ where: { slug }, select: { id: true } });
  if (!car) {
    car = await prisma.car.findUnique({ where: { id: slug }, select: { id: true } });
  }

  if (!car) {
    return NextResponse.json({ bookedRanges: [] });
  }

  const reservations = await prisma.reservation.findMany({
    where: {
      carId: car.id,
      status: { in: ["pending", "confirmed"] },
      dropoffDate: { gte: new Date() },
    },
    select: {
      pickupDate: true,
      dropoffDate: true,
    },
    orderBy: { pickupDate: "asc" },
  });

  const bookedRanges = reservations.map((r) => ({
    start: r.pickupDate.toISOString().split("T")[0],
    end: r.dropoffDate.toISOString().split("T")[0],
  }));

  return NextResponse.json({ bookedRanges });
}
