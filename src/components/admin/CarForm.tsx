"use client";

import { useState, FormEvent } from "react";

interface CarData {
  name?: string;
  slug?: string;
  category?: string;
  description?: string;
  pricePerDay?: number;
  zeroToHundred?: string;
  topSpeed?: number;
  seats?: number;
  engine?: string;
  transmission?: string;
  colors?: string;
  image?: string;
  available?: boolean;
  featured?: boolean;
}

interface CarFormProps {
  car?: CarData;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}

const categories = ["SUV", "Sedan", "Supercar", "Convertible"];

export default function CarForm({ car, onSubmit }: CarFormProps) {
  const [name, setName] = useState(car?.name || "");
  const [category, setCategory] = useState(car?.category || "Supercar");
  const [description, setDescription] = useState(car?.description || "");
  const [pricePerDay, setPricePerDay] = useState(car?.pricePerDay?.toString() || "");
  const [zeroToHundred, setZeroToHundred] = useState(car?.zeroToHundred || "");
  const [topSpeed, setTopSpeed] = useState(car?.topSpeed?.toString() || "");
  const [seats, setSeats] = useState(car?.seats?.toString() || "4");
  const [engine, setEngine] = useState(car?.engine || "Twin-Turbo V8");
  const [transmission, setTransmission] = useState(car?.transmission || "Automatic");
  const [colors, setColors] = useState(
    car?.colors || '[{"name": "Black", "hex": "#000000"}]'
  );
  const [image, setImage] = useState(car?.image || "/images/placeholder.jpg");
  const [featured, setFeatured] = useState(car?.featured || false);
  const [available, setAvailable] = useState(car?.available ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate colors JSON
      try {
        JSON.parse(colors);
      } catch {
        setError("Colors must be valid JSON");
        setLoading(false);
        return;
      }

      await onSubmit({
        name,
        category,
        description,
        pricePerDay: parseInt(pricePerDay),
        zeroToHundred,
        topSpeed: parseInt(topSpeed),
        seats: parseInt(seats),
        engine,
        transmission,
        colors,
        image,
        featured,
        available,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputClasses =
    "w-full rounded-lg border border-[#f2f2f0] bg-white px-4 py-2.5 text-sm text-[#0a0a0a] placeholder:text-[#0a0a0a]/20 focus:outline-none focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent transition-all";
  const labelClasses =
    "block text-xs font-medium text-[#0a0a0a]/50 uppercase tracking-wider mb-1.5";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-[#f2f2f0] bg-white p-8 shadow-sm space-y-6"
    >
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label className={labelClasses}>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="e.g. Porsche 911 Carrera"
          className={inputClasses}
        />
      </div>

      {/* Category & Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClasses}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClasses}>Price Per Day (MAD)</label>
          <input
            type="number"
            value={pricePerDay}
            onChange={(e) => setPricePerDay(e.target.value)}
            required
            placeholder="8500"
            className={inputClasses}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelClasses}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          placeholder="Describe the vehicle..."
          className={`${inputClasses} resize-none`}
        />
      </div>

      {/* Performance */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClasses}>0-100 km/h</label>
          <input
            type="text"
            value={zeroToHundred}
            onChange={(e) => setZeroToHundred(e.target.value)}
            required
            placeholder="3.6s"
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Top Speed (km/h)</label>
          <input
            type="number"
            value={topSpeed}
            onChange={(e) => setTopSpeed(e.target.value)}
            required
            placeholder="308"
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Seats</label>
          <input
            type="number"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            required
            placeholder="4"
            className={inputClasses}
          />
        </div>
      </div>

      {/* Engine & Transmission */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Engine</label>
          <input
            type="text"
            value={engine}
            onChange={(e) => setEngine(e.target.value)}
            required
            placeholder="Twin-Turbo V8"
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Transmission</label>
          <input
            type="text"
            value={transmission}
            onChange={(e) => setTransmission(e.target.value)}
            required
            placeholder="Automatic"
            className={inputClasses}
          />
        </div>
      </div>

      {/* Image */}
      <div>
        <label className={labelClasses}>Image Path</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="/images/cars/porsche-911.jpg"
          className={inputClasses}
        />
      </div>

      {/* Colors JSON */}
      <div>
        <label className={labelClasses}>Colors (JSON)</label>
        <textarea
          value={colors}
          onChange={(e) => setColors(e.target.value)}
          rows={3}
          placeholder='[{"name": "Black", "hex": "#000000"}]'
          className={`${inputClasses} resize-none font-mono text-xs`}
        />
        <p className="mt-1 text-xs text-[#0a0a0a]/30">
          JSON array of objects with &quot;name&quot; and &quot;hex&quot; fields.
        </p>
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-8">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
            className="h-4 w-4 rounded border-[#f2f2f0] text-[#ff5c00] focus:ring-[#ff5c00]"
          />
          <span className="text-sm font-medium text-[#0a0a0a]">Available</span>
        </label>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4 rounded border-[#f2f2f0] text-[#ff5c00] focus:ring-[#ff5c00]"
          />
          <span className="text-sm font-medium text-[#0a0a0a]">Featured</span>
        </label>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[#ff5c00] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#e05200] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Saving...
            </span>
          ) : car ? (
            "Update Car"
          ) : (
            "Create Car"
          )}
        </button>
      </div>
    </form>
  );
}
