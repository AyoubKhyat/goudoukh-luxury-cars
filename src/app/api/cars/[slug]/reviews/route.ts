import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

async function resolveCarId(slug: string): Promise<string | null> {
  let car = await prisma.car.findUnique({ where: { slug }, select: { id: true } });
  if (!car) {
    car = await prisma.car.findUnique({ where: { id: slug }, select: { id: true } });
  }
  return car?.id ?? null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const carId = await resolveCarId(slug);

  if (!carId) {
    return NextResponse.json({ reviews: [], averageRating: 0, totalReviews: 0 });
  }

  const reviews = await prisma.review.findMany({
    where: { carId, approved: true },
    orderBy: { createdAt: "desc" },
  });

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10
    : 0;

  return NextResponse.json({ reviews, averageRating, totalReviews });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const carId = await resolveCarId(slug);

  if (!carId) {
    return NextResponse.json({ error: "Car not found" }, { status: 404 });
  }

  const body = await request.json();
  const { name, email, rating, title, comment } = body;

  if (!name || !email || !rating || !title || !comment) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      carId,
      name,
      email,
      rating: Math.round(rating),
      title,
      comment,
      approved: false,
    },
  });

  return NextResponse.json({ review, message: "Review submitted and pending approval" });
}
