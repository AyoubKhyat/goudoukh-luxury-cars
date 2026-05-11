"use client";

import Link from "next/link";

interface ReservationStatusFilterProps {
  currentStatus: string;
}

const tabs = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function ReservationStatusFilter({
  currentStatus,
}: ReservationStatusFilterProps) {
  return (
    <div className="flex items-center gap-1 mb-6 p-1 bg-[#f2f2f0] rounded-lg w-fit">
      {tabs.map((tab) => (
        <Link
          key={tab.value}
          href={
            tab.value === "all"
              ? "/admin/reservations"
              : `/admin/reservations?status=${tab.value}`
          }
          className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
            currentStatus === tab.value
              ? "bg-white text-[#0a0a0a] shadow-sm"
              : "text-[#0a0a0a]/40 hover:text-[#0a0a0a]/60"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
