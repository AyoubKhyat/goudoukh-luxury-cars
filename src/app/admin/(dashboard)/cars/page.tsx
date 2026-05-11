import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import CarActions from "@/components/admin/CarActions";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default async function AdminCarsPage() {
  const cars = await prisma.car.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { reservations: true },
      },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0a0a0a]">Cars</h1>
          <p className="mt-1 text-sm text-[#0a0a0a]/50">
            Manage your fleet of luxury vehicles.
          </p>
        </div>
        <Link
          href="/admin/cars/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#ff5c00] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#e05200]"
        >
          <Plus className="h-4 w-4" />
          Add New Car
        </Link>
      </div>

      <div className="rounded-xl border border-[#f2f2f0] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f2f2f0] text-left bg-[#f2f2f0]/30">
                <th className="px-6 py-3.5 text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3.5 text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3.5 text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider">
                  Price/Day
                </th>
                <th className="px-6 py-3.5 text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider">
                  Available
                </th>
                <th className="px-6 py-3.5 text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3.5 text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider">
                  Reservations
                </th>
                <th className="px-6 py-3.5 text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2f2f0]">
              {cars.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-[#0a0a0a]/30"
                  >
                    No cars added yet. Add your first car to get started.
                  </td>
                </tr>
              ) : (
                cars.map((car) => (
                  <tr
                    key={car.id}
                    className="hover:bg-[#f2f2f0]/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-[#0a0a0a]">
                      {car.name}
                    </td>
                    <td className="px-6 py-4 text-[#0a0a0a]/60">
                      {car.category}
                    </td>
                    <td className="px-6 py-4 text-[#0a0a0a]/60">
                      {formatCurrency(car.pricePerDay)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          car.available
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {car.available ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          car.featured
                            ? "bg-[#ff5c00]/10 text-[#ff5c00]"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {car.featured ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#0a0a0a]/60">
                      {car._count.reservations}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <CarActions carId={car.id} />
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
