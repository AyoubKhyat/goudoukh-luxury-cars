import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function escapeCsv(value: string) {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(request: Request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");

  const reservations = await prisma.reservation.findMany({
    where: statusFilter && statusFilter !== "all" ? { status: statusFilter } : undefined,
    orderBy: { createdAt: "desc" },
    include: { car: true },
  });

  const headers = [
    "ID",
    "Customer Name",
    "Email",
    "Phone",
    "Car",
    "Category",
    "Pickup Date",
    "Dropoff Date",
    "Pickup Location",
    "Dropoff Location",
    "Insurance",
    "Chauffeur",
    "Child Seat",
    "GPS",
    "Total (MAD)",
    "Status",
    "Created",
  ];

  const rows = reservations.map((r) => [
    r.id,
    escapeCsv(r.customerName),
    escapeCsv(r.customerEmail),
    escapeCsv(r.customerPhone),
    escapeCsv(r.car.name),
    r.car.category,
    formatDate(r.pickupDate),
    formatDate(r.dropoffDate),
    escapeCsv(r.pickupLocation),
    escapeCsv(r.dropoffLocation),
    r.insurance ? "Yes" : "No",
    r.chauffeur ? "Yes" : "No",
    r.childSeat ? "Yes" : "No",
    r.gps ? "Yes" : "No",
    String(r.totalPrice),
    r.status,
    formatDate(r.createdAt),
  ]);

  const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="reservations-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
