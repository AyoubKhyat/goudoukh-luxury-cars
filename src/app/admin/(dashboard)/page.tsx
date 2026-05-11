import prisma from "@/lib/prisma";
import { Car, Calendar, Clock, DollarSign, Plus, ArrowRight, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

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

function timeAgo(date: Date) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-700",
};

export default async function AdminDashboardPage() {
  const [
    totalCars,
    totalReservations,
    pendingReservations,
    confirmedReservations,
    completedReservations,
    cancelledReservations,
    revenueResult,
    recentReservations,
    topCars,
    totalContacts,
  ] = await Promise.all([
    prisma.car.count(),
    prisma.reservation.count(),
    prisma.reservation.count({ where: { status: "pending" } }),
    prisma.reservation.count({ where: { status: "confirmed" } }),
    prisma.reservation.count({ where: { status: "completed" } }),
    prisma.reservation.count({ where: { status: "cancelled" } }),
    prisma.reservation.aggregate({
      _sum: { totalPrice: true },
      where: { status: { in: ["confirmed", "completed"] } },
    }),
    prisma.reservation.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { car: true },
    }),
    prisma.reservation.groupBy({
      by: ["carId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }),
    prisma.contactMessage.count(),
  ]);

  const topCarIds = topCars.map((t) => t.carId);
  const topCarDetails = topCarIds.length > 0
    ? await prisma.car.findMany({ where: { id: { in: topCarIds } }, select: { id: true, name: true } })
    : [];
  const carNameMap = Object.fromEntries(topCarDetails.map((c) => [c.id, c.name]));

  const revenue = revenueResult._sum.totalPrice || 0;

  const stats = [
    {
      label: "Total Cars",
      value: totalCars,
      icon: Car,
      color: "bg-blue-50 text-blue-600",
      href: "/admin/cars",
    },
    {
      label: "Reservations",
      value: totalReservations,
      icon: Calendar,
      color: "bg-green-50 text-green-600",
      href: "/admin/reservations",
    },
    {
      label: "Pending",
      value: pendingReservations,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
      href: "/admin/reservations?status=pending",
    },
    {
      label: "Revenue",
      value: formatCurrency(revenue),
      icon: DollarSign,
      color: "bg-orange-50 text-[#ff5c00]",
      href: null,
    },
  ];

  const statusBreakdown = [
    { label: "Pending", count: pendingReservations, color: "bg-amber-400" },
    { label: "Confirmed", count: confirmedReservations, color: "bg-green-400" },
    { label: "Completed", count: completedReservations, color: "bg-gray-400" },
    { label: "Cancelled", count: cancelledReservations, color: "bg-red-400" },
  ];
  const maxStatus = Math.max(...statusBreakdown.map((s) => s.count), 1);

  return (
    <div>
      {/* Header with quick actions */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0a0a0a]">Dashboard</h1>
          <p className="mt-1 text-sm text-[#0a0a0a]/50">
            Welcome back. Here is an overview of your business.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/cars/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#ff5c00] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e05200]"
          >
            <Plus className="h-4 w-4" />
            Add Car
          </Link>
          <Link
            href="/admin/reservations"
            className="inline-flex items-center gap-2 rounded-lg border border-[#f2f2f0] bg-white px-4 py-2.5 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-[#f2f2f0]"
          >
            <Calendar className="h-4 w-4" />
            Reservations
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const content = (
            <div className="rounded-xl border border-[#f2f2f0] bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-[#ff5c00]/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-[#0a0a0a]">
                    {stat.value}
                  </p>
                </div>
                <div className={`rounded-lg p-3 ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
          return stat.href ? (
            <Link key={stat.label} href={stat.href}>
              {content}
            </Link>
          ) : (
            <div key={stat.label}>{content}</div>
          );
        })}
      </div>

      {/* Middle row: Status breakdown + Top cars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        {/* Reservation status breakdown */}
        <div className="rounded-xl border border-[#f2f2f0] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-[#ff5c00]" />
            <h2 className="text-lg font-semibold text-[#0a0a0a]">
              Booking Status
            </h2>
          </div>
          <div className="space-y-4">
            {statusBreakdown.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-[#0a0a0a]/60">{s.label}</span>
                  <span className="text-sm font-semibold text-[#0a0a0a]">{s.count}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#f2f2f0] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.color} transition-all duration-700`}
                    style={{ width: `${(s.count / maxStatus) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most popular cars */}
        <div className="rounded-xl border border-[#f2f2f0] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-5 w-5 text-[#ff5c00]" />
            <h2 className="text-lg font-semibold text-[#0a0a0a]">
              Most Booked Cars
            </h2>
          </div>
          {topCars.length === 0 ? (
            <p className="text-sm text-[#0a0a0a]/30 py-8 text-center">No bookings yet</p>
          ) : (
            <div className="space-y-3">
              {topCars.map((tc, i) => (
                <div
                  key={tc.carId}
                  className="flex items-center justify-between rounded-lg bg-[#f2f2f0]/50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff5c00]/10 text-xs font-bold text-[#ff5c00]">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-[#0a0a0a]">
                      {carNameMap[tc.carId] || tc.carId}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-[#0a0a0a]/60">
                    {tc._count.id} {tc._count.id === 1 ? "booking" : "bookings"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="rounded-xl border border-[#f2f2f0] bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider">Avg. Booking Value</p>
          <p className="mt-2 text-xl font-bold text-[#0a0a0a]">
            {totalReservations > 0 ? formatCurrency(Math.round(revenue / Math.max(confirmedReservations + completedReservations, 1))) : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-[#f2f2f0] bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider">Conversion Rate</p>
          <p className="mt-2 text-xl font-bold text-[#0a0a0a]">
            {totalReservations > 0
              ? `${Math.round(((confirmedReservations + completedReservations) / totalReservations) * 100)}%`
              : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-[#f2f2f0] bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider">Contact Messages</p>
          <p className="mt-2 text-xl font-bold text-[#0a0a0a]">{totalContacts}</p>
        </div>
      </div>

      {/* Recent Reservations */}
      <div className="rounded-xl border border-[#f2f2f0] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#f2f2f0] px-6 py-4">
          <h2 className="text-lg font-semibold text-[#0a0a0a]">
            Recent Reservations
          </h2>
          <Link
            href="/admin/reservations"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#ff5c00] hover:text-[#e05200] transition-colors"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f2f2f0] text-left">
                <th className="px-6 py-3 text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider">
                  Car
                </th>
                <th className="px-6 py-3 text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider">
                  Received
                </th>
                <th className="px-6 py-3 text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider text-right">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2f2f0]">
              {recentReservations.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-[#0a0a0a]/30"
                  >
                    No reservations yet
                  </td>
                </tr>
              ) : (
                recentReservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="hover:bg-[#f2f2f0]/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-[#0a0a0a]">
                      <Link
                        href={`/admin/reservations/${reservation.id}`}
                        className="hover:text-[#ff5c00] transition-colors"
                      >
                        {reservation.car.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-[#0a0a0a]">{reservation.customerName}</p>
                        <p className="text-xs text-[#0a0a0a]/40">{reservation.customerPhone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#0a0a0a]/60">
                      {formatDate(reservation.pickupDate)} –{" "}
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
                    <td className="px-6 py-4 text-xs text-[#0a0a0a]/40">
                      {timeAgo(reservation.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-[#0a0a0a]">
                      {formatCurrency(reservation.totalPrice)}
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
