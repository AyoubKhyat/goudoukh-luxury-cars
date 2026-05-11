import prisma from "@/lib/prisma";
import { BarChart3, TrendingUp, PieChart, ArrowUpRight, ArrowDownRight } from "lucide-react";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 0,
  }).format(amount);
}

function getMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "2-digit" }).format(date);
}

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export default async function AnalyticsPage() {
  const [allReservations, allCars] = await Promise.all([
    prisma.reservation.findMany({
      include: { car: { select: { name: true, category: true, pricePerDay: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.car.findMany({ select: { id: true, category: true } }),
  ]);

  // --- Monthly revenue & bookings (last 6 months) ---
  const now = new Date();
  const months: { key: string; label: string; date: Date }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: getMonthKey(d), label: getMonthLabel(d), date: d });
  }

  const confirmedStatuses = new Set(["confirmed", "completed"]);

  const monthlyRevenue = months.map((m) => {
    const rev = allReservations
      .filter((r) => {
        const k = getMonthKey(new Date(r.createdAt));
        return k === m.key && confirmedStatuses.has(r.status);
      })
      .reduce((sum, r) => sum + r.totalPrice, 0);
    return { ...m, revenue: rev };
  });

  const monthlyBookings = months.map((m) => {
    const count = allReservations.filter(
      (r) => getMonthKey(new Date(r.createdAt)) === m.key
    ).length;
    return { ...m, count };
  });

  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue), 1);
  const maxBookings = Math.max(...monthlyBookings.map((m) => m.count), 1);

  // Revenue change vs previous month
  const currentMonthRev = monthlyRevenue[monthlyRevenue.length - 1]?.revenue ?? 0;
  const prevMonthRev = monthlyRevenue[monthlyRevenue.length - 2]?.revenue ?? 0;
  const revChange = prevMonthRev > 0
    ? Math.round(((currentMonthRev - prevMonthRev) / prevMonthRev) * 100)
    : currentMonthRev > 0 ? 100 : 0;

  // Bookings change vs previous month
  const currentMonthBookings = monthlyBookings[monthlyBookings.length - 1]?.count ?? 0;
  const prevMonthBookings = monthlyBookings[monthlyBookings.length - 2]?.count ?? 0;
  const bookingsChange = prevMonthBookings > 0
    ? Math.round(((currentMonthBookings - prevMonthBookings) / prevMonthBookings) * 100)
    : currentMonthBookings > 0 ? 100 : 0;

  // --- Revenue by category ---
  const categoryRevenue: Record<string, number> = {};
  const categoryBookings: Record<string, number> = {};
  for (const r of allReservations) {
    if (!confirmedStatuses.has(r.status)) continue;
    const cat = r.car.category;
    categoryRevenue[cat] = (categoryRevenue[cat] || 0) + r.totalPrice;
    categoryBookings[cat] = (categoryBookings[cat] || 0) + 1;
  }

  const categoryColors: Record<string, string> = {
    Supercar: "#ff5c00",
    SUV: "#3b82f6",
    Sedan: "#10b981",
    Convertible: "#8b5cf6",
  };

  const categories = Object.entries(categoryRevenue)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, rev]) => ({
      category: cat,
      revenue: rev,
      bookings: categoryBookings[cat] || 0,
      color: categoryColors[cat] || "#6b7280",
    }));

  const totalCategoryRevenue = categories.reduce((s, c) => s + c.revenue, 0);
  const maxCatRevenue = Math.max(...categories.map((c) => c.revenue), 1);

  // --- Status funnel ---
  const statusCounts = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
  for (const r of allReservations) {
    if (r.status in statusCounts) {
      statusCounts[r.status as keyof typeof statusCounts]++;
    }
  }
  const totalBookings = allReservations.length;

  // --- Top performing cars by revenue ---
  const carRevenue: Record<string, { name: string; revenue: number; bookings: number }> = {};
  for (const r of allReservations) {
    if (!confirmedStatuses.has(r.status)) continue;
    if (!carRevenue[r.carId]) {
      carRevenue[r.carId] = { name: r.car.name, revenue: 0, bookings: 0 };
    }
    carRevenue[r.carId].revenue += r.totalPrice;
    carRevenue[r.carId].bookings++;
  }
  const topRevenueCars = Object.values(carRevenue)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
  const maxCarRevenue = Math.max(...topRevenueCars.map((c) => c.revenue), 1);

  // --- Average booking duration ---
  const durations = allReservations
    .filter((r) => confirmedStatuses.has(r.status))
    .map((r) => {
      const diff = new Date(r.dropoffDate).getTime() - new Date(r.pickupDate).getTime();
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    });
  const avgDuration = durations.length > 0
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
    : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0a0a0a]">Analytics</h1>
        <p className="mt-1 text-sm text-[#0a0a0a]/50">
          Revenue trends, booking patterns, and performance insights.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <div className="rounded-xl border border-[#f2f2f0] bg-white p-6 shadow-sm">
          <p className="text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider">
            This Month Revenue
          </p>
          <p className="mt-2 text-2xl font-bold text-[#0a0a0a]">
            {formatCurrency(currentMonthRev)}
          </p>
          <div className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${revChange >= 0 ? "text-green-600" : "text-red-500"}`}>
            {revChange >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(revChange)}% vs last month
          </div>
        </div>

        <div className="rounded-xl border border-[#f2f2f0] bg-white p-6 shadow-sm">
          <p className="text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider">
            This Month Bookings
          </p>
          <p className="mt-2 text-2xl font-bold text-[#0a0a0a]">{currentMonthBookings}</p>
          <div className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${bookingsChange >= 0 ? "text-green-600" : "text-red-500"}`}>
            {bookingsChange >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(bookingsChange)}% vs last month
          </div>
        </div>

        <div className="rounded-xl border border-[#f2f2f0] bg-white p-6 shadow-sm">
          <p className="text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider">
            Avg. Rental Duration
          </p>
          <p className="mt-2 text-2xl font-bold text-[#0a0a0a]">
            {avgDuration} {avgDuration === 1 ? "day" : "days"}
          </p>
        </div>

        <div className="rounded-xl border border-[#f2f2f0] bg-white p-6 shadow-sm">
          <p className="text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider">
            Fleet Size
          </p>
          <p className="mt-2 text-2xl font-bold text-[#0a0a0a]">{allCars.length}</p>
          <p className="mt-2 text-xs text-[#0a0a0a]/40">
            {Object.keys(categoryColors).filter((c) => allCars.some((car) => car.category === c)).length} categories
          </p>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        <div className="rounded-xl border border-[#f2f2f0] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-[#ff5c00]" />
            <h2 className="text-lg font-semibold text-[#0a0a0a]">Monthly Revenue</h2>
          </div>
          {maxRevenue <= 1 ? (
            <p className="text-sm text-[#0a0a0a]/30 py-12 text-center">No revenue data yet</p>
          ) : (
            <div className="flex items-end gap-3 h-48">
              {monthlyRevenue.map((m) => (
                <div key={m.key} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] font-medium text-[#0a0a0a]/50">
                    {m.revenue > 0 ? formatCurrency(m.revenue) : ""}
                  </span>
                  <div className="w-full flex items-end justify-center" style={{ height: "140px" }}>
                    <div
                      className="w-full max-w-[48px] rounded-t-md bg-gradient-to-t from-[#ff5c00] to-[#ff8c40] transition-all duration-700"
                      style={{ height: `${Math.max((m.revenue / maxRevenue) * 100, m.revenue > 0 ? 4 : 0)}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-[#0a0a0a]/40">{m.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Monthly Bookings Chart */}
        <div className="rounded-xl border border-[#f2f2f0] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-[#ff5c00]" />
            <h2 className="text-lg font-semibold text-[#0a0a0a]">Booking Trends</h2>
          </div>
          {maxBookings <= 1 && totalBookings === 0 ? (
            <p className="text-sm text-[#0a0a0a]/30 py-12 text-center">No booking data yet</p>
          ) : (
            <div className="relative h-48">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="border-b border-[#f2f2f0] w-full" />
                ))}
              </div>
              {/* Bars */}
              <div className="relative flex items-end gap-3 h-full pt-4 pb-6">
                {monthlyBookings.map((m) => (
                  <div key={m.key} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-xs font-bold text-[#0a0a0a]">
                      {m.count > 0 ? m.count : ""}
                    </span>
                    <div className="w-full flex items-end justify-center" style={{ height: "110px" }}>
                      <div
                        className="w-full max-w-[48px] rounded-t-md bg-gradient-to-t from-blue-500 to-blue-300 transition-all duration-700"
                        style={{ height: `${Math.max((m.count / maxBookings) * 100, m.count > 0 ? 8 : 0)}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-[#0a0a0a]/40">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown + Booking Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        {/* Revenue by Category */}
        <div className="rounded-xl border border-[#f2f2f0] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="h-5 w-5 text-[#ff5c00]" />
            <h2 className="text-lg font-semibold text-[#0a0a0a]">Revenue by Category</h2>
          </div>
          {categories.length === 0 ? (
            <p className="text-sm text-[#0a0a0a]/30 py-12 text-center">No data yet</p>
          ) : (
            <>
              {/* Stacked bar */}
              <div className="h-6 w-full rounded-full overflow-hidden flex mb-6">
                {categories.map((c) => (
                  <div
                    key={c.category}
                    className="h-full transition-all duration-700"
                    style={{
                      width: `${(c.revenue / totalCategoryRevenue) * 100}%`,
                      backgroundColor: c.color,
                    }}
                  />
                ))}
              </div>
              {/* Legend + bars */}
              <div className="space-y-4">
                {categories.map((c) => (
                  <div key={c.category}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c.color }} />
                        <span className="text-sm font-medium text-[#0a0a0a]">{c.category}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#0a0a0a]/40">
                          {c.bookings} {c.bookings === 1 ? "booking" : "bookings"}
                        </span>
                        <span className="text-sm font-semibold text-[#0a0a0a]">
                          {formatCurrency(c.revenue)}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#f2f2f0] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${(c.revenue / maxCatRevenue) * 100}%`,
                          backgroundColor: c.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Booking Status Funnel */}
        <div className="rounded-xl border border-[#f2f2f0] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#0a0a0a] mb-6">Booking Funnel</h2>
          {totalBookings === 0 ? (
            <p className="text-sm text-[#0a0a0a]/30 py-12 text-center">No bookings yet</p>
          ) : (
            <div className="space-y-3">
              {[
                { label: "Total Bookings", count: totalBookings, color: "#3b82f6", width: 100 },
                { label: "Confirmed", count: statusCounts.confirmed + statusCounts.completed, color: "#10b981", width: totalBookings > 0 ? ((statusCounts.confirmed + statusCounts.completed) / totalBookings) * 100 : 0 },
                { label: "Completed", count: statusCounts.completed, color: "#ff5c00", width: totalBookings > 0 ? (statusCounts.completed / totalBookings) * 100 : 0 },
              ].map((step) => (
                <div key={step.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-[#0a0a0a]/60">{step.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#0a0a0a]">{step.count}</span>
                      <span className="text-xs text-[#0a0a0a]/40">
                        ({totalBookings > 0 ? Math.round((step.count / totalBookings) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-8 w-full rounded-lg bg-[#f2f2f0] overflow-hidden">
                    <div
                      className="h-full rounded-lg transition-all duration-700 flex items-center pl-3"
                      style={{
                        width: `${Math.max(step.width, step.count > 0 ? 8 : 0)}%`,
                        backgroundColor: step.color,
                      }}
                    >
                      {step.width > 20 && (
                        <span className="text-[11px] font-bold text-white">{Math.round(step.width)}%</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-4 pt-4 border-t border-[#f2f2f0] grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-amber-50 p-3 text-center">
                  <p className="text-lg font-bold text-amber-700">{statusCounts.pending}</p>
                  <p className="text-xs text-amber-600">Pending</p>
                </div>
                <div className="rounded-lg bg-red-50 p-3 text-center">
                  <p className="text-lg font-bold text-red-600">{statusCounts.cancelled}</p>
                  <p className="text-xs text-red-500">Cancelled</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Cars by Revenue */}
      <div className="rounded-xl border border-[#f2f2f0] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0a0a0a] mb-6">Top Cars by Revenue</h2>
        {topRevenueCars.length === 0 ? (
          <p className="text-sm text-[#0a0a0a]/30 py-8 text-center">No revenue data yet</p>
        ) : (
          <div className="space-y-4">
            {topRevenueCars.map((car, i) => (
              <div key={car.name} className="flex items-center gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ff5c00]/10 text-sm font-bold text-[#ff5c00]">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[#0a0a0a] truncate">{car.name}</span>
                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <span className="text-xs text-[#0a0a0a]/40">{car.bookings} bookings</span>
                      <span className="text-sm font-semibold text-[#0a0a0a]">{formatCurrency(car.revenue)}</span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#f2f2f0] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#ff5c00] to-[#ff8c40] transition-all duration-700"
                      style={{ width: `${(car.revenue / maxCarRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
