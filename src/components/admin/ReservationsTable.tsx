"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, CheckCircle, XCircle, Clock, Check } from "lucide-react";

interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupDate: string;
  dropoffDate: string;
  totalPrice: number;
  status: string;
  car: { name: string };
}

interface ReservationsTableProps {
  reservations: Reservation[];
  currentStatus: string;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string) {
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

export default function ReservationsTable({ reservations: initial, currentStatus }: ReservationsTableProps) {
  const [reservations, setReservations] = useState(initial);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState("confirmed");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const allSelected = reservations.length > 0 && selected.size === reservations.length;

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(reservations.map((r) => r.id)));
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function quickAction(id: string, status: string) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const data = await res.json();
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: data.reservation.status } : r))
        );
      }
    } catch {
      // silent
    } finally {
      setActionLoading(null);
    }
  }

  async function handleBulkUpdate() {
    if (selected.size === 0) return;
    setBulkLoading(true);
    try {
      const res = await fetch("/api/admin/reservations/bulk", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected), status: bulkStatus }),
      });
      if (res.ok) {
        setReservations((prev) =>
          prev.map((r) => (selected.has(r.id) ? { ...r, status: bulkStatus } : r))
        );
        setSelected(new Set());
      }
    } catch {
      // silent
    } finally {
      setBulkLoading(false);
    }
  }

  function handleExport() {
    const statusParam = currentStatus !== "all" ? `?status=${currentStatus}` : "";
    window.location.href = `/api/admin/reservations/export${statusParam}`;
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          {selected.size > 0 && (
            <>
              <span className="text-sm text-[#0a0a0a]/50">
                {selected.size} selected
              </span>
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                className="rounded-lg border border-[#f2f2f0] bg-white px-3 py-1.5 text-sm text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={handleBulkUpdate}
                disabled={bulkLoading}
                className="rounded-lg bg-[#0a0a0a] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#1a1a1a] disabled:opacity-50 transition-colors"
              >
                {bulkLoading ? "Updating..." : "Apply"}
              </button>
            </>
          )}
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 rounded-lg border border-[#f2f2f0] bg-white px-4 py-2 text-sm font-medium text-[#0a0a0a] hover:bg-[#f2f2f0] transition-colors"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#f2f2f0] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f2f2f0] text-left bg-[#f2f2f0]/30">
                <th className="px-4 py-3.5">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-gray-300 accent-[#ff5c00]"
                  />
                </th>
                <th className="px-4 py-3.5 text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3.5 text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider">
                  Car
                </th>
                <th className="px-4 py-3.5 text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-4 py-3.5 text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3.5 text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider text-right">
                  Total
                </th>
                <th className="px-4 py-3.5 text-xs font-medium text-[#0a0a0a]/40 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2f2f0]">
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-[#0a0a0a]/30">
                    No reservations found.
                  </td>
                </tr>
              ) : (
                reservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className={`hover:bg-[#f2f2f0]/50 transition-colors ${selected.has(reservation.id) ? "bg-[#ff5c00]/5" : ""}`}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selected.has(reservation.id)}
                        onChange={() => toggleOne(reservation.id)}
                        className="h-4 w-4 rounded border-gray-300 accent-[#ff5c00]"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-[#0a0a0a]">{reservation.customerName}</div>
                      <div className="text-xs text-[#0a0a0a]/40">{reservation.customerEmail}</div>
                    </td>
                    <td className="px-4 py-4 text-[#0a0a0a]/60">{reservation.car.name}</td>
                    <td className="px-4 py-4 text-[#0a0a0a]/60 text-xs">
                      {formatDate(reservation.pickupDate)}
                      <br />
                      <span className="text-[#0a0a0a]/30">to</span> {formatDate(reservation.dropoffDate)}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                          statusColors[reservation.status] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right font-medium text-[#0a0a0a]">
                      {formatCurrency(reservation.totalPrice)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {reservation.status === "pending" && (
                          <>
                            <button
                              onClick={() => quickAction(reservation.id, "confirmed")}
                              disabled={actionLoading === reservation.id}
                              title="Confirm"
                              className="rounded-lg p-1.5 text-green-600 hover:bg-green-50 disabled:opacity-50 transition-colors"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => quickAction(reservation.id, "cancelled")}
                              disabled={actionLoading === reservation.id}
                              title="Cancel"
                              className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {reservation.status === "confirmed" && (
                          <>
                            <button
                              onClick={() => quickAction(reservation.id, "completed")}
                              disabled={actionLoading === reservation.id}
                              title="Mark completed"
                              className="rounded-lg p-1.5 text-[#ff5c00] hover:bg-[#ff5c00]/10 disabled:opacity-50 transition-colors"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => quickAction(reservation.id, "cancelled")}
                              disabled={actionLoading === reservation.id}
                              title="Cancel"
                              className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {reservation.status === "cancelled" && (
                          <button
                            onClick={() => quickAction(reservation.id, "pending")}
                            disabled={actionLoading === reservation.id}
                            title="Reopen"
                            className="rounded-lg p-1.5 text-amber-600 hover:bg-amber-50 disabled:opacity-50 transition-colors"
                          >
                            <Clock className="h-4 w-4" />
                          </button>
                        )}
                        <Link
                          href={`/admin/reservations/${reservation.id}`}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#ff5c00] hover:bg-[#ff5c00]/10 transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
