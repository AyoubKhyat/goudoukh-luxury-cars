"use client";

import { useEffect, useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BookedRange {
  start: string;
  end: string;
}

interface AvailabilityCalendarProps {
  carSlug: string;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function AvailabilityCalendar({ carSlug }: AvailabilityCalendarProps) {
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  useEffect(() => {
    async function fetchAvailability() {
      try {
        const res = await fetch(`/api/cars/${carSlug}/availability`);
        if (res.ok) {
          const data = await res.json();
          setBookedRanges(data.bookedRanges);
        }
      } catch {
        // fail silently
      } finally {
        setLoading(false);
      }
    }
    fetchAvailability();
  }, [carSlug]);

  const bookedDates = useMemo(() => {
    const set = new Set<string>();
    for (const range of bookedRanges) {
      const start = new Date(range.start);
      const end = new Date(range.end);
      const cursor = new Date(start);
      while (cursor <= end) {
        set.add(cursor.toISOString().split("T")[0]);
        cursor.setDate(cursor.getDate() + 1);
      }
    }
    return set;
  }, [bookedRanges]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(
    new Date(viewYear, viewMonth, 1)
  );

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  const canGoPrev =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  return (
    <div>
      <h3 className="font-bebas text-2xl tracking-wide text-[#0a0a0a] mb-4">
        Availability
      </h3>
      <div className="rounded-xl border border-[#f2f2f0] bg-white p-5">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#ff5c00] border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevMonth}
                disabled={!canGoPrev}
                className="rounded-lg p-1.5 text-[#0a0a0a]/50 hover:bg-[#f2f2f0] hover:text-[#0a0a0a] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-semibold text-[#0a0a0a]">{monthLabel}</span>
              <button
                onClick={nextMonth}
                className="rounded-lg p-1.5 text-[#0a0a0a]/50 hover:bg-[#f2f2f0] hover:text-[#0a0a0a] transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d} className="text-center text-[10px] font-medium text-[#0a0a0a]/30 uppercase">
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = toDateStr(viewYear, viewMonth, day);
                const isBooked = bookedDates.has(dateStr);
                const isPast = dateStr < todayStr;
                const isToday = dateStr === todayStr;

                return (
                  <div
                    key={day}
                    className={`flex h-8 items-center justify-center rounded-md text-xs font-medium transition-colors ${
                      isPast
                        ? "text-[#0a0a0a]/15"
                        : isBooked
                        ? "bg-red-100 text-red-600"
                        : isToday
                        ? "bg-[#ff5c00] text-white"
                        : "text-[#0a0a0a]/70 hover:bg-[#f2f2f0]"
                    }`}
                    title={isBooked ? "Booked" : isPast ? "" : "Available"}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center gap-4 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#ff5c00]" />
                <span className="text-[#0a0a0a]/40">Today</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-red-100 border border-red-200" />
                <span className="text-[#0a0a0a]/40">Booked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-white border border-[#f2f2f0]" />
                <span className="text-[#0a0a0a]/40">Available</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
