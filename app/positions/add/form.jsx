"use client";
import { useState, useEffect } from "react";

export default function PositionForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    Nama_Jabatan: "",
    Deskripsi_Jabatan: "",
    Min_Gaji: "",
    Max_Gaji: "",
    department_id: "", // Gunakan ID departemen
  });

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await fetch("/api/departments");
        if (!res.ok) throw new Error("Gagal mengambil data departemen");
        const data = await res.json();
        setDepartments(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 font-medium">Nama Jabatan</label>
        <input
          type="text"
          name="Nama_Jabatan"
          value={formData.Nama_Jabatan}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium">Deskripsi Jabatan</label>
        <textarea
          name="Deskripsi_Jabatan"
          value={formData.Deskripsi_Jabatan}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        ></textarea>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-medium">Min Gaji</label>
          <input
            type="number"
            name="Min_Gaji"
            value={formData.Min_Gaji}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Max Gaji</label>
          <input
            type="number"
            name="Max_Gaji"
            value={formData.Max_Gaji}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-medium">Departemen</label>
        <select
          name="department_id"
          value={formData.department_id}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        >
          <option value="">Pilih Departemen</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.nama_departemen}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Tambah Jabatan
      </button>
    </form>
  );
}
