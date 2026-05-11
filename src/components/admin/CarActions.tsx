"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

interface CarActionsProps {
  carId: string;
}

export default function CarActions({ carId }: CarActionsProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/cars/${carId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      // silently fail
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/admin/cars/${carId}/edit`}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#f2f2f0] px-3 py-1.5 text-xs font-medium text-[#0a0a0a]/60 hover:bg-[#f2f2f0] transition-colors"
      >
        <Pencil className="h-3 w-3" />
        Edit
      </Link>

      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="h-3 w-3" />
          Delete
        </button>
      ) : (
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
          >
            {deleting ? "..." : "Confirm"}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="rounded-lg border border-[#f2f2f0] px-3 py-1.5 text-xs font-medium text-[#0a0a0a]/40 hover:bg-[#f2f2f0] transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
