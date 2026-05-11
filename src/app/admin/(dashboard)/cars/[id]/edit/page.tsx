"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CarForm from "@/components/admin/CarForm";

interface CarData {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  pricePerDay: number;
  zeroToHundred: string;
  topSpeed: number;
  seats: number;
  engine: string;
  transmission: string;
  colors: string;
  image: string;
  available: boolean;
  featured: boolean;
}

export default function EditCarPage() {
  const router = useRouter();
  const params = useParams();
  const carId = params.id as string;

  const [car, setCar] = useState<CarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCar() {
      try {
        const res = await fetch(`/api/admin/cars/${carId}`);
        if (!res.ok) throw new Error("Car not found");
        const data = await res.json();
        setCar(data);
      } catch {
        setError("Failed to load car data");
      } finally {
        setLoading(false);
      }
    }
    fetchCar();
  }, [carId]);

  async function handleSubmit(data: Record<string, unknown>) {
    const res = await fetch(`/api/admin/cars/${carId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update car");
    }

    router.push("/admin/cars");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ff5c00] border-t-transparent" />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-500">{error || "Car not found"}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0a0a0a]">Edit Car</h1>
        <p className="mt-1 text-sm text-[#0a0a0a]/50">
          Update details for {car.name}.
        </p>
      </div>

      <div className="max-w-3xl">
        <CarForm car={car} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
