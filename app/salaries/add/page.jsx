"use client";

import SalaryForm from "./form";

export default function AddSalaryPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Tambah Gaji</h1>
      <SalaryForm />
    </div>
  );
}
