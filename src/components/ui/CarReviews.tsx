"use client";

import { useEffect, useState } from "react";
import StarRating from "./StarRating";

interface Review {
  id: string;
  name: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}

interface CarReviewsProps {
  carSlug: string;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return "1 month ago";
  return `${months} months ago`;
}

export default function CarReviews({ carSlug }: CarReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    title: "",
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`/api/cars/${carSlug}/reviews`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data.reviews);
          setAverageRating(data.averageRating);
          setTotalReviews(data.totalReviews);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [carSlug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/cars/${carSlug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        setShowForm(false);
        setFormData({ name: "", email: "", rating: 5, title: "", comment: "" });
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit review");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="mt-10">
      <h3 className="font-bebas text-2xl tracking-wide text-[#0a0a0a]">
        Reviews
      </h3>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#ff5c00] border-t-transparent" />
        </div>
      ) : (
        <div className="mt-4 space-y-6">
          {/* Rating summary */}
          <div className="rounded-xl border border-[#f2f2f0] bg-white p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              {/* Big number */}
              <div className="text-center sm:text-left">
                <p className="font-bebas text-5xl text-[#0a0a0a]">
                  {averageRating > 0 ? averageRating.toFixed(1) : "—"}
                </p>
                <StarRating rating={Math.round(averageRating)} size="md" />
                <p className="mt-1 text-xs text-gray-400">
                  {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                </p>
              </div>

              {/* Distribution bars */}
              {totalReviews > 0 && (
                <div className="flex-1 space-y-1.5">
                  {ratingDistribution.map((d) => (
                    <div key={d.star} className="flex items-center gap-2">
                      <span className="w-4 text-right text-xs font-medium text-[#0a0a0a]/50">{d.star}</span>
                      <svg className="h-3 w-3 text-[#ff5c00]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                      </svg>
                      <div className="flex-1 h-2 rounded-full bg-[#f2f2f0] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#ff5c00] transition-all duration-500"
                          style={{ width: `${totalReviews > 0 ? (d.count / totalReviews) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="w-6 text-xs text-[#0a0a0a]/40">{d.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write a review button */}
            <div className="mt-5 border-t border-[#f2f2f0] pt-5">
              {submitted ? (
                <p className="text-sm text-green-600 font-medium">
                  Thank you! Your review has been submitted and is pending approval.
                </p>
              ) : (
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="rounded-lg bg-[#0a0a0a] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1a1a1a]"
                >
                  {showForm ? "Cancel" : "Write a Review"}
                </button>
              )}
            </div>
          </div>

          {/* Review form */}
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border border-[#f2f2f0] bg-white p-6 space-y-4"
            >
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Your Rating
                </label>
                <StarRating
                  rating={formData.rating}
                  size="lg"
                  interactive
                  onChange={(rating) => setFormData((p) => ({ ...p, rating }))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 bg-[#f2f2f0]/50 px-4 py-2.5 text-sm text-[#0a0a0a] outline-none focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 bg-[#f2f2f0]/50 px-4 py-2.5 text-sm text-[#0a0a0a] outline-none focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Review Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Sum up your experience"
                  className="w-full rounded-lg border border-gray-200 bg-[#f2f2f0]/50 px-4 py-2.5 text-sm text-[#0a0a0a] outline-none focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Your Review
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.comment}
                  onChange={(e) => setFormData((p) => ({ ...p, comment: e.target.value }))}
                  placeholder="Tell others about your rental experience..."
                  className="w-full rounded-lg border border-gray-200 bg-[#f2f2f0]/50 px-4 py-2.5 text-sm text-[#0a0a0a] outline-none focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00] resize-none"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-[#ff5c00] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e05200] disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}

          {/* Reviews list */}
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-xl border border-[#f2f2f0] bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff5c00]/10 text-sm font-bold text-[#ff5c00]">
                          {review.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#0a0a0a]">{review.name}</p>
                          <p className="text-[11px] text-gray-400">{timeAgo(review.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  <h4 className="mt-3 text-sm font-semibold text-[#0a0a0a]">{review.title}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : !submitted && (
            <p className="text-center text-sm text-gray-400 py-4">
              No reviews yet. Be the first to share your experience!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
