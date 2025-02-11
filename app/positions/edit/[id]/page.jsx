"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as React from "react";

export default function EditPosition({ params }) {
  const router = useRouter();
  const { id } = React.use(params);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nama_jabatan: "",
    id_departemen: "",
    deskripsi_jabatan: "",
    min_gaji: "",
    max_gaji: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [positionRes, departmentsRes] = await Promise.all([
          fetch(`/api/positions/${id}`),
          fetch("/api/departments"),
        ]);

        if (!positionRes.ok || !departmentsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [position, departmentsData] = await Promise.all([
          positionRes.json(),
          departmentsRes.json(),
        ]);

        setFormData({
          nama_jabatan: position.nama_jabatan,
          id_departemen: position.id_departemen,
          deskripsi_jabatan: position.deskripsi_jabatan,
          min_gaji: position.min_gaji,
          max_gaji: position.max_gaji,
        });

        setDepartments(departmentsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/positions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update position");
      }

      router.push("/positions");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Edit Jabatan</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg">{error}</div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Nama Jabatan</label>
          <input
            type="text"
            name="nama_jabatan"
            value={formData.nama_jabatan}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Departemen</label>
          <select
            name="id_departemen"
            value={formData.id_departemen}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Pilih Departemen</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Deskripsi Jabatan
          </label>
          <textarea
            name="deskripsi_jabatan"
            value={formData.deskripsi_jabatan}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gaji Minimum</label>
          <input
            type="number"
            name="min_gaji"
            value={formData.min_gaji}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Gaji Maksimum
          </label>
          <input
            type="number"
            name="max_gaji"
            value={formData.max_gaji}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
