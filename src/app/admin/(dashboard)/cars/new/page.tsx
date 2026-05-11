"use client";

import { useRouter } from "next/navigation";
import CarForm from "@/components/admin/CarForm";

export default function NewCarPage() {
  const router = useRouter();

  async function handleSubmit(data: Record<string, unknown>) {
    const res = await fetch("/api/admin/cars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create car");
    }

    router.push("/admin/cars");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0a0a0a]">Add New Car</h1>
        <p className="mt-1 text-sm text-[#0a0a0a]/50">
          Add a new vehicle to your fleet.
        </p>
      </div>

      <div className="max-w-3xl">
        <CarForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
