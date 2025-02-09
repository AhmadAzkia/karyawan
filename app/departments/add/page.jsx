"use client";
import { useRouter } from "next/navigation";
import DepartmentForm from "./form";

export default function AddDepartmentPage() {
  const router = useRouter();

  const handleSubmit = async (formData) => {
    await fetch("/api/departments/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    router.push("/departments");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Tambah Departemen</h1>
      <DepartmentForm onSubmit={handleSubmit} />
    </div>
  );
}
