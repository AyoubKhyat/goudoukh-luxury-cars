"use client";

import { useState } from "react";

interface ReservationActionsProps {
  reservationId: string;
  currentStatus: string;
  onStatusChange?: (newStatus: string) => void;
}

const statuses = ["pending", "confirmed", "completed", "cancelled"];

export default function ReservationActions({
  reservationId,
  currentStatus,
  onStatusChange,
}: ReservationActionsProps) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch(`/api/admin/reservations/${reservationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setSaved(true);
        onStatusChange?.(status);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full rounded-lg border border-[#f2f2f0] bg-white px-4 py-2.5 text-sm text-[#0a0a0a] capitalize focus:outline-none focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent transition-all"
      >
        {statuses.map((s) => (
          <option key={s} value={s} className="capitalize">
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>

      <button
        onClick={handleSave}
        disabled={saving || status === currentStatus}
        className="w-full rounded-lg bg-[#ff5c00] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#e05200] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? "Saving..." : saved ? "Saved!" : "Update Status"}
      </button>
    </div>
  );
}
