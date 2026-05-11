import prisma from "@/lib/prisma";
import ReservationStatusFilter from "@/components/admin/ReservationStatusFilter";
import ReservationsTable from "@/components/admin/ReservationsTable";

export default async function AdminReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params.status;

  const reservations = await prisma.reservation.findMany({
    where: statusFilter && statusFilter !== "all" ? { status: statusFilter } : undefined,
    orderBy: { createdAt: "desc" },
    include: { car: true },
  });

  const serialized = reservations.map((r) => ({
    ...r,
    pickupDate: r.pickupDate.toISOString(),
    dropoffDate: r.dropoffDate.toISOString(),
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0a0a0a]">Reservations</h1>
        <p className="mt-1 text-sm text-[#0a0a0a]/50">
          Manage all customer reservations.
        </p>
      </div>

      <ReservationStatusFilter currentStatus={statusFilter || "all"} />

      <ReservationsTable
        reservations={serialized}
        currentStatus={statusFilter || "all"}
      />
    </div>
  );
}
