/**
 * Formats a number as Moroccan Dirham (MAD) with comma-separated thousands.
 *
 * @example
 * formatMAD(15000)  // "15,000 MAD"
 * formatMAD(1500.5) // "1,501 MAD"
 */
export function formatMAD(amount: number): string {
  const rounded = Math.round(amount);
  const formatted = rounded
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted} MAD`;
}

/**
 * Merges class name strings, filtering out falsy values.
 * A lightweight alternative to the `clsx` / `classnames` libraries.
 *
 * @example
 * cn("btn", isActive && "btn--active", undefined, "btn--lg")
 * // "btn btn--active btn--lg"
 */
export function cn(
  ...classes: (string | undefined | false | null)[]
): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Extra service daily surcharges in MAD.
 */
const EXTRAS_PRICING = {
  insurance: 500,
  driver: 1200,
  childSeat: 150,
} as const;

/**
 * Calculates the total rental price including optional extras.
 *
 * Pricing rules:
 * - Base price is per day and multiplied by the number of days.
 * - Each selected extra adds a fixed daily surcharge multiplied by the number of days.
 * - A 10% discount is applied automatically for rentals of 7 days or more.
 *
 * @param basePrice - The car's daily rate in MAD.
 * @param days      - Number of rental days (clamped to a minimum of 1).
 * @param extras    - Optional add-on services.
 * @returns The total price in MAD (rounded to the nearest whole number).
 *
 * @example
 * calculatePrice(8500, 3, { insurance: true, driver: false, childSeat: false })
 * // (8500 + 500) * 3 = 27,000 MAD
 *
 * calculatePrice(8500, 7, { insurance: true, driver: true, childSeat: false })
 * // ((8500 + 500 + 1200) * 7) * 0.9 = 63,630 MAD
 */
export function calculatePrice(
  basePrice: number,
  days: number,
  extras: { insurance: boolean; driver: boolean; childSeat: boolean }
): number {
  const effectiveDays = Math.max(1, Math.round(days));

  let dailyTotal = basePrice;

  if (extras.insurance) {
    dailyTotal += EXTRAS_PRICING.insurance;
  }
  if (extras.driver) {
    dailyTotal += EXTRAS_PRICING.driver;
  }
  if (extras.childSeat) {
    dailyTotal += EXTRAS_PRICING.childSeat;
  }

  let total = dailyTotal * effectiveDays;

  // 10% discount for weekly or longer rentals
  if (effectiveDays >= 7) {
    total *= 0.9;
  }

  return Math.round(total);
}
