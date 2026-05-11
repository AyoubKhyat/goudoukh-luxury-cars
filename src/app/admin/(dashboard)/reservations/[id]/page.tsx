"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Car,
  Shield,
  UserCheck,
  Baby,
  Navigation,
} from "lucide-react";
import ReservationActions from "@/components/admin/ReservationActions";

interface ReservationData {
  id: string;
  carId: string;
  car: {
    id: string;
    name: string;
    category: string;
    pricePerDay: number;
    image: string;
  };
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupDate: string;
  dropoffDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  insurance: boolean;
  chauffeur: boolean;
  childSeat: boolean;
  gps: boolean;
  totalPrice: number;
  status: string;
  notes: string | null;
  createdAt: string;
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
    weekday: "long",
    month: "long",
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

export default function ReservationDetailPage() {
  const params = useParams();
  const reservationId = params.id as string;

  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    async function fetchReservation() {
      try {
        const res = await fetch(`/api/admin/reservations/${reservationId}`);
        if (!res.ok) throw new Error("Reservation not found");
        const data = await res.json();
        setReservation(data);
        setNotes(data.notes || "");
      } catch {
        setError("Failed to load reservation");
      } finally {
        setLoading(false);
      }
    }
    fetchReservation();
  }, [reservationId]);

  async function handleSaveNotes() {
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/reservations/${reservationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (res.ok) {
        const updated = await res.json();
        setReservation(updated);
      }
    } catch {
      // silently fail
    } finally {
      setSavingNotes(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ff5c00] border-t-transparent" />
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-500">{error || "Reservation not found"}</p>
        <Link
          href="/admin/reservations"
          className="mt-4 inline-block text-sm text-[#ff5c00] hover:text-[#e05200]"
        >
          Back to Reservations
        </Link>
      </div>
    );
  }

  const pickupDate = new Date(reservation.pickupDate);
  const dropoffDate = new Date(reservation.dropoffDate);
  const days = Math.ceil(
    (dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/reservations"
          className="inline-flex items-center gap-1.5 text-sm text-[#0a0a0a]/50 hover:text-[#0a0a0a] transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Reservations
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0a0a0a]">
              Reservation Details
            </h1>
            <p className="mt-1 text-sm text-[#0a0a0a]/40 font-mono">
              {reservation.id}
            </p>
          </div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-medium capitalize ${
              statusColors[reservation.status] || "bg-gray-100 text-gray-600"
            }`}
          >
            {reservation.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="rounded-xl border border-[#f2f2f0] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0a0a0a] mb-4">
              Customer Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-[#f2f2f0] p-2">
                  <User className="h-4 w-4 text-[#0a0a0a]/50" />
                </div>
                <div>
                  <p className="text-xs text-[#0a0a0a]/40">Name</p>
                  <p className="text-sm font-medium text-[#0a0a0a]">
                    {reservation.customerName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-[#f2f2f0] p-2">
                  <Mail className="h-4 w-4 text-[#0a0a0a]/50" />
                </div>
                <div>
                  <p className="text-xs text-[#0a0a0a]/40">Email</p>
                  <p className="text-sm font-medium text-[#0a0a0a]">
                    {reservation.customerEmail}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-[#f2f2f0] p-2">
                  <Phone className="h-4 w-4 text-[#0a0a0a]/50" />
                </div>
                <div>
                  <p className="text-xs text-[#0a0a0a]/40">Phone</p>
                  <p className="text-sm font-medium text-[#0a0a0a]">
                    {reservation.customerPhone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Car & Dates */}
          <div className="rounded-xl border border-[#f2f2f0] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0a0a0a] mb-4">
              Rental Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-[#f2f2f0] p-2">
                  <Car className="h-4 w-4 text-[#0a0a0a]/50" />
                </div>
                <div>
                  <p className="text-xs text-[#0a0a0a]/40">Vehicle</p>
                  <p className="text-sm font-medium text-[#0a0a0a]">
                    {reservation.car.name}
                  </p>
                  <p className="text-xs text-[#0a0a0a]/40">
                    {reservation.car.category} &middot;{" "}
                    {formatCurrency(reservation.car.pricePerDay)}/day
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-[#f2f2f0] p-2">
                  <Calendar className="h-4 w-4 text-[#0a0a0a]/50" />
                </div>
                <div>
                  <p className="text-xs text-[#0a0a0a]/40">Duration</p>
                  <p className="text-sm font-medium text-[#0a0a0a]">
                    {days} {days === 1 ? "day" : "days"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-[#f2f2f0] p-2">
                  <MapPin className="h-4 w-4 text-[#0a0a0a]/50" />
                </div>
                <div>
                  <p className="text-xs text-[#0a0a0a]/40">Pickup</p>
                  <p className="text-sm font-medium text-[#0a0a0a]">
                    {formatDate(reservation.pickupDate)}
                  </p>
                  <p className="text-xs text-[#0a0a0a]/40">
                    {reservation.pickupLocation}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-[#f2f2f0] p-2">
                  <MapPin className="h-4 w-4 text-[#0a0a0a]/50" />
                </div>
                <div>
                  <p className="text-xs text-[#0a0a0a]/40">Dropoff</p>
                  <p className="text-sm font-medium text-[#0a0a0a]">
                    {formatDate(reservation.dropoffDate)}
                  </p>
                  <p className="text-xs text-[#0a0a0a]/40">
                    {reservation.dropoffLocation}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Extras */}
          <div className="rounded-xl border border-[#f2f2f0] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0a0a0a] mb-4">
              Extras
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Insurance", active: reservation.insurance, icon: Shield },
                { label: "Chauffeur", active: reservation.chauffeur, icon: UserCheck },
                { label: "Child Seat", active: reservation.childSeat, icon: Baby },
                { label: "GPS", active: reservation.gps, icon: Navigation },
              ].map((extra) => {
                const Icon = extra.icon;
                return (
                  <div
                    key={extra.label}
                    className={`rounded-lg border p-3 text-center ${
                      extra.active
                        ? "border-[#ff5c00]/30 bg-[#ff5c00]/5"
                        : "border-[#f2f2f0] bg-[#f2f2f0]/30"
                    }`}
                  >
                    <Icon
                      className={`mx-auto h-5 w-5 mb-1 ${
                        extra.active ? "text-[#ff5c00]" : "text-[#0a0a0a]/20"
                      }`}
                    />
                    <p
                      className={`text-xs font-medium ${
                        extra.active ? "text-[#ff5c00]" : "text-[#0a0a0a]/30"
                      }`}
                    >
                      {extra.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-xl border border-[#f2f2f0] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0a0a0a] mb-4">
              Notes
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Add internal notes about this reservation..."
              className="w-full rounded-lg border border-[#f2f2f0] px-4 py-3 text-sm text-[#0a0a0a] placeholder:text-[#0a0a0a]/20 focus:outline-none focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent transition-all resize-none"
            />
            <div className="mt-3 flex justify-end">
              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white hover:bg-[#0a0a0a] disabled:opacity-50 transition-colors"
              >
                {savingNotes ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Price & Actions */}
        <div className="space-y-6">
          {/* Price Breakdown */}
          <div className="rounded-xl border border-[#f2f2f0] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0a0a0a] mb-4">
              Price Breakdown
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#0a0a0a]/50">
                  {formatCurrency(reservation.car.pricePerDay)} x {days}{" "}
                  {days === 1 ? "day" : "days"}
                </span>
                <span className="font-medium text-[#0a0a0a]">
                  {formatCurrency(reservation.car.pricePerDay * days)}
                </span>
              </div>
              {reservation.insurance && (
                <div className="flex justify-between">
                  <span className="text-[#0a0a0a]/50">Insurance</span>
                  <span className="font-medium text-[#0a0a0a]">Included</span>
                </div>
              )}
              {reservation.chauffeur && (
                <div className="flex justify-between">
                  <span className="text-[#0a0a0a]/50">Chauffeur</span>
                  <span className="font-medium text-[#0a0a0a]">Included</span>
                </div>
              )}
              {reservation.childSeat && (
                <div className="flex justify-between">
                  <span className="text-[#0a0a0a]/50">Child Seat</span>
                  <span className="font-medium text-[#0a0a0a]">Included</span>
                </div>
              )}
              {reservation.gps && (
                <div className="flex justify-between">
                  <span className="text-[#0a0a0a]/50">GPS</span>
                  <span className="font-medium text-[#0a0a0a]">Included</span>
                </div>
              )}
              <div className="border-t border-[#f2f2f0] pt-3 flex justify-between">
                <span className="font-semibold text-[#0a0a0a]">Total</span>
                <span className="font-bold text-lg text-[#ff5c00]">
                  {formatCurrency(reservation.totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="rounded-xl border border-[#f2f2f0] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0a0a0a] mb-4">
              Update Status
            </h2>
            <ReservationActions
              reservationId={reservation.id}
              currentStatus={reservation.status}
              onStatusChange={(newStatus) =>
                setReservation((prev) =>
                  prev ? { ...prev, status: newStatus } : prev
                )
              }
            />
          </div>

          {/* Created at */}
          <div className="rounded-xl border border-[#f2f2f0] bg-white p-6 shadow-sm">
            <p className="text-xs text-[#0a0a0a]/40 uppercase tracking-wider">
              Created
            </p>
            <p className="mt-1 text-sm text-[#0a0a0a]">
              {formatDate(reservation.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
