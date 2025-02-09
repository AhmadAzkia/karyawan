"use client";
import { useState } from "react";
import PositionForm from "./form";
import { useRouter } from "next/navigation";

export default function AddPositionPage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      const res = await fetch("/api/positions/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to add position");
      }

      router.push("/positions");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Tambah Jabatan</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <PositionForm onSubmit={handleSubmit} />
    </div>
  );
}
