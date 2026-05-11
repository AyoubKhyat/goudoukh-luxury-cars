import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const EXTRAS_PER_DAY = {
  insurance: 500,
  chauffeur: 1200,
  childSeat: 150,
  gps: 100,
} as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      carId,
      customerName,
      customerEmail,
      customerPhone,
      pickupDate,
      dropoffDate,
      pickupLocation,
      dropoffLocation,
      insurance,
      chauffeur,
      childSeat,
      gps,
    } = body;

    // Validate required fields
    if (
      !carId ||
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !pickupDate ||
      !dropoffDate
    ) {
      return NextResponse.json(
        {
          error:
            "carId, customerName, customerEmail, customerPhone, pickupDate, and dropoffDate are required",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Parse and validate dates
    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);
    const now = new Date();

    if (isNaN(pickup.getTime()) || isNaN(dropoff.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // Pickup must be in the future (allow same day by comparing date only)
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    if (pickup < todayStart) {
      return NextResponse.json(
        { error: "Pickup date must be today or in the future" },
        { status: 400 }
      );
    }

    if (dropoff <= pickup) {
      return NextResponse.json(
        { error: "Dropoff date must be after pickup date" },
        { status: 400 }
      );
    }

    // Get the car to calculate price (support both cuid and slug)
    let car = await prisma.car.findUnique({ where: { id: carId } });
    if (!car) {
      car = await prisma.car.findUnique({ where: { slug: carId } });
    }
    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    // Calculate number of days
    const msPerDay = 1000 * 60 * 60 * 24;
    const days = Math.max(1, Math.ceil((dropoff.getTime() - pickup.getTime()) / msPerDay));

    // Calculate total price
    let dailyTotal = car.pricePerDay;
    if (insurance) dailyTotal += EXTRAS_PER_DAY.insurance;
    if (chauffeur) dailyTotal += EXTRAS_PER_DAY.chauffeur;
    if (childSeat) dailyTotal += EXTRAS_PER_DAY.childSeat;
    if (gps) dailyTotal += EXTRAS_PER_DAY.gps;

    let totalPrice = dailyTotal * days;

    // 10% discount for 7+ days
    if (days >= 7) {
      totalPrice = Math.round(totalPrice * 0.9);
    }

    const reservation = await prisma.reservation.create({
      data: {
        carId: car.id,
        customerName,
        customerEmail,
        customerPhone,
        pickupDate: pickup,
        dropoffDate: dropoff,
        pickupLocation: pickupLocation || "Marrakesh Airport",
        dropoffLocation: dropoffLocation || "Marrakesh Airport",
        insurance: Boolean(insurance),
        chauffeur: Boolean(chauffeur),
        childSeat: Boolean(childSeat),
        gps: Boolean(gps),
        totalPrice,
      },
      include: {
        car: {
          select: {
            name: true,
            slug: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ reservation }, { status: 201 });
  } catch (error) {
    console.error("Create reservation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
