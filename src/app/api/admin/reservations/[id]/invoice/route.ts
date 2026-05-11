import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";
import { jsPDF } from "jspdf";

function formatCurrency(amount: number) {
  return `${amount.toLocaleString("en-US")} MAD`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: { car: true },
  });

  if (!reservation) {
    return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
  }

  const pickupDate = new Date(reservation.pickupDate);
  const dropoffDate = new Date(reservation.dropoffDate);
  const days = Math.ceil(
    (dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Brand colors
  const orange = [255, 92, 0] as const;
  const dark = [10, 10, 10] as const;
  const gray = [120, 120, 120] as const;
  const lightGray = [242, 242, 240] as const;

  // Header bar
  doc.setFillColor(...dark);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text("GOUDOUKH", 20, 25);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 200);
  doc.text("LUXURY CARS  |  MARRAKESH", 20, 33);

  // Invoice label
  doc.setFontSize(10);
  doc.setTextColor(...orange);
  doc.text("INVOICE", pageWidth - 20, 18, { align: "right" });

  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  doc.text(`#${reservation.id.slice(0, 12).toUpperCase()}`, pageWidth - 20, 25, { align: "right" });
  doc.text(`Issued: ${new Date().toLocaleDateString("en-US")}`, pageWidth - 20, 32, { align: "right" });

  let y = 55;

  // Status badge
  const statusColors: Record<string, [number, number, number]> = {
    pending: [245, 158, 11],
    confirmed: [34, 197, 94],
    completed: [107, 114, 128],
    cancelled: [239, 68, 68],
  };
  const badgeColor = statusColors[reservation.status] || gray;
  doc.setFillColor(...badgeColor);
  doc.roundedRect(20, y - 5, 30, 8, 2, 2, "F");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text(reservation.status.toUpperCase(), 35, y, { align: "center" });

  y += 15;

  // Two-column layout: Customer info | Rental info
  // Left column - Customer
  doc.setFontSize(8);
  doc.setTextColor(...orange);
  doc.setFont("helvetica", "bold");
  doc.text("CUSTOMER", 20, y);

  doc.setFontSize(10);
  doc.setTextColor(...dark);
  doc.text(reservation.customerName, 20, y + 7);
  doc.setFontSize(8);
  doc.setTextColor(...gray);
  doc.setFont("helvetica", "normal");
  doc.text(reservation.customerEmail, 20, y + 13);
  doc.text(reservation.customerPhone, 20, y + 19);

  // Right column - Rental
  const rightCol = 120;
  doc.setFontSize(8);
  doc.setTextColor(...orange);
  doc.setFont("helvetica", "bold");
  doc.text("RENTAL DETAILS", rightCol, y);

  doc.setFontSize(10);
  doc.setTextColor(...dark);
  doc.text(reservation.car.name, rightCol, y + 7);
  doc.setFontSize(8);
  doc.setTextColor(...gray);
  doc.setFont("helvetica", "normal");
  doc.text(`${reservation.car.category}  |  ${days} ${days === 1 ? "day" : "days"}`, rightCol, y + 13);
  doc.text(`${formatCurrency(reservation.car.pricePerDay)} / day`, rightCol, y + 19);

  y += 35;

  // Dates section
  doc.setFillColor(...lightGray);
  doc.roundedRect(20, y - 3, pageWidth - 40, 20, 3, 3, "F");

  doc.setFontSize(7);
  doc.setTextColor(...orange);
  doc.setFont("helvetica", "bold");
  doc.text("PICKUP", 28, y + 3);
  doc.setFontSize(8);
  doc.setTextColor(...dark);
  doc.setFont("helvetica", "normal");
  doc.text(formatDate(reservation.pickupDate), 28, y + 10);

  doc.setFontSize(7);
  doc.setTextColor(...orange);
  doc.setFont("helvetica", "bold");
  doc.text("DROPOFF", rightCol, y + 3);
  doc.setFontSize(8);
  doc.setTextColor(...dark);
  doc.setFont("helvetica", "normal");
  doc.text(formatDate(reservation.dropoffDate), rightCol, y + 10);

  y += 28;

  // Locations
  doc.setFontSize(7);
  doc.setTextColor(...gray);
  doc.text(`Pickup: ${reservation.pickupLocation}`, 20, y);
  doc.text(`Dropoff: ${reservation.dropoffLocation}`, rightCol, y);

  y += 15;

  // Divider
  doc.setDrawColor(...lightGray);
  doc.setLineWidth(0.5);
  doc.line(20, y, pageWidth - 20, y);

  y += 10;

  // Price breakdown header
  doc.setFontSize(8);
  doc.setTextColor(...orange);
  doc.setFont("helvetica", "bold");
  doc.text("PRICE BREAKDOWN", 20, y);

  y += 10;

  // Table header
  doc.setFillColor(...dark);
  doc.rect(20, y - 4, pageWidth - 40, 9, "F");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text("ITEM", 25, y + 1);
  doc.text("QTY", 110, y + 1);
  doc.text("RATE", 135, y + 1);
  doc.text("AMOUNT", pageWidth - 25, y + 1, { align: "right" });

  y += 12;

  // Line items
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...dark);
  doc.setFontSize(8);

  const baseCost = reservation.car.pricePerDay * days;
  doc.text(`${reservation.car.name} Rental`, 25, y);
  doc.text(`${days}`, 113, y);
  doc.text(formatCurrency(reservation.car.pricePerDay), 135, y);
  doc.text(formatCurrency(baseCost), pageWidth - 25, y, { align: "right" });

  y += 8;

  const extras = [
    { name: "Full Insurance", active: reservation.insurance, rate: 500 },
    { name: "Personal Chauffeur", active: reservation.chauffeur, rate: 1200 },
    { name: "Child Seat", active: reservation.childSeat, rate: 150 },
    { name: "GPS Navigation", active: reservation.gps, rate: 100 },
  ];

  for (const extra of extras) {
    if (!extra.active) continue;
    doc.setTextColor(...dark);
    doc.text(extra.name, 25, y);
    doc.text(`${days}`, 113, y);
    doc.text(formatCurrency(extra.rate), 135, y);
    doc.text(formatCurrency(extra.rate * days), pageWidth - 25, y, { align: "right" });
    y += 8;
  }

  // Divider before total
  y += 2;
  doc.setDrawColor(...lightGray);
  doc.line(100, y, pageWidth - 20, y);
  y += 8;

  // Total
  doc.setFillColor(...orange);
  doc.roundedRect(100, y - 5, pageWidth - 120, 14, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("TOTAL", 108, y + 4);
  doc.text(formatCurrency(reservation.totalPrice), pageWidth - 25, y + 4, { align: "right" });

  y += 25;

  // Payment method note
  doc.setFillColor(255, 252, 248);
  doc.roundedRect(20, y - 3, pageWidth - 40, 16, 3, 3, "F");
  doc.setDrawColor(...orange);
  doc.setLineWidth(0.3);
  doc.roundedRect(20, y - 3, pageWidth - 40, 16, 3, 3, "S");

  doc.setFontSize(7);
  doc.setTextColor(...orange);
  doc.setFont("helvetica", "bold");
  doc.text("PAYMENT METHOD", 28, y + 3);
  doc.setTextColor(...dark);
  doc.setFont("helvetica", "normal");
  doc.text("Cash on pickup. No card or online payment required.", 28, y + 9);

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setDrawColor(...lightGray);
  doc.line(20, footerY - 5, pageWidth - 20, footerY - 5);

  doc.setFontSize(7);
  doc.setTextColor(...gray);
  doc.setFont("helvetica", "normal");
  doc.text("Goudoukh Luxury Cars  |  Marrakesh, Morocco", 20, footerY);
  doc.text("+212 600 000 000  |  contact@goudoukh.com", 20, footerY + 5);
  doc.text("Thank you for choosing Goudoukh.", pageWidth - 20, footerY + 2, { align: "right" });

  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="invoice-${reservation.id.slice(0, 8)}.pdf"`,
    },
  });
}
