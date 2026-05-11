import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";

export async function PUT(request: Request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { ids, status } = body as { ids: string[]; status: string };

  const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "No reservations selected" }, { status: 400 });
  }

  await prisma.reservation.updateMany({
    where: { id: { in: ids } },
    data: { status },
  });

  return NextResponse.json({ updated: ids.length });
}
