"use client";

import { useEffect, useState } from "react";
import { Star, Check, X, Trash2 } from "lucide-react";

interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  title: string;
  comment: string;
  approved: boolean;
  createdAt: string;
  car: { name: string };
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function fetchReviews() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews?filter=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  async function handleApprove(id: string, approved: boolean) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, approved } : r))
        );
      }
    } catch {
      // silent
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(id: string) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      }
    } catch {
      // silent
    } finally {
      setActionLoading(null);
    }
  }

  const pendingCount = reviews.filter((r) => !r.approved).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0a0a0a]">Reviews</h1>
        <p className="mt-1 text-sm text-[#0a0a0a]/50">
          Manage customer reviews and ratings.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-6 p-1 bg-[#f2f2f0] rounded-lg w-fit">
        {(["all", "pending", "approved"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all capitalize ${
              filter === tab
                ? "bg-white text-[#0a0a0a] shadow-sm"
                : "text-[#0a0a0a]/40 hover:text-[#0a0a0a]/60"
            }`}
          >
            {tab}
            {tab === "pending" && pendingCount > 0 && filter !== "pending" && (
              <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#ff5c00] text-[10px] font-bold text-white">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ff5c00] border-t-transparent" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-xl border border-[#f2f2f0] bg-white p-12 text-center">
          <p className="text-[#0a0a0a]/30">No reviews found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className={`rounded-xl border bg-white p-5 shadow-sm transition-all ${
                review.approved ? "border-[#f2f2f0]" : "border-amber-200 bg-amber-50/30"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff5c00]/10 text-sm font-bold text-[#ff5c00]">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0a0a0a]">{review.name}</p>
                      <p className="text-xs text-[#0a0a0a]/40">{review.email}</p>
                    </div>
                    <span className={`ml-auto sm:ml-2 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
                      review.approved
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {review.approved ? "Approved" : "Pending"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < review.rating ? "text-[#ff5c00] fill-[#ff5c00]" : "text-gray-200"}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-[#0a0a0a]/40">for {review.car.name}</span>
                    <span className="text-xs text-[#0a0a0a]/30">{timeAgo(review.createdAt)}</span>
                  </div>

                  <h4 className="text-sm font-semibold text-[#0a0a0a]">{review.title}</h4>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {!review.approved && (
                    <button
                      onClick={() => handleApprove(review.id, true)}
                      disabled={actionLoading === review.id}
                      title="Approve"
                      className="rounded-lg p-2 text-green-600 hover:bg-green-50 disabled:opacity-50 transition-colors"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  {review.approved && (
                    <button
                      onClick={() => handleApprove(review.id, false)}
                      disabled={actionLoading === review.id}
                      title="Unapprove"
                      className="rounded-lg p-2 text-amber-600 hover:bg-amber-50 disabled:opacity-50 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    disabled={actionLoading === review.id}
                    title="Delete"
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
