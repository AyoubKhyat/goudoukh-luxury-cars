import prisma from "@/lib/prisma";
import Link from "next/link";
import ReservationStatusFilter from "@/components/admin/ReservationStatusFilter";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-700",
};

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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0a0a0a]">Reservations</h1>
        <p className="mt-1 text-sm text-[#0a0a0a]/50">
          Manage all customer reservations.
        </p>
      </div>

      {/* Status Filter Tabs */}
      <ReservationStatusFilter currentStatus={statusFilter || "all"} />

      {/* Table */}
      <div className="rounded-xl border border-[#f2f2f0] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f2f2f0] text-left bg-[#f2f2f0]/30">
                <th className="px-6 py-3.5 text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3.5 text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider">
                  Car
                </th>
                <th className="px-6 py-3.5 text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider">
                  Pickup Date
                </th>
                <th className="px-6 py-3.5 text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider">
                  Dropoff Date
                </th>
                <th className="px-6 py-3.5 text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3.5 text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider text-right">
                  Total
                </th>
                <th className="px-6 py-3.5 text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2f2f0]">
              {reservations.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-[#0a0a0a]/30"
                  >
                    No reservations found.
                  </td>
                </tr>
              ) : (
                reservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="hover:bg-[#f2f2f0]/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#0a0a0a]">
                        {reservation.customerName}
                      </div>
                      <div className="text-xs text-[#0a0a0a]/40">
                        {reservation.customerEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#0a0a0a]/60">
                      {reservation.car.name}
                    </td>
                    <td className="px-6 py-4 text-[#0a0a0a]/60">
                      {formatDate(reservation.pickupDate)}
                    </td>
                    <td className="px-6 py-4 text-[#0a0a0a]/60">
                      {formatDate(reservation.dropoffDate)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                          statusColors[reservation.status] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-[#0a0a0a]">
                      {formatCurrency(reservation.totalPrice)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/reservations/${reservation.id}`}
                        className="text-sm font-medium text-[#ff5c00] hover:text-[#e05200] transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
