"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SalaryForm() {
  const [formData, setFormData] = useState({
    nama_karyawan: "",
    gaji_pokok: "",
    tunjangan: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/salaries/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Gagal menambah gaji");

      alert("Gaji berhasil ditambahkan!");
      router.push("/salaries"); // Redirect ke halaman daftar gaji
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 font-semibold">Nama Karyawan</label>
        <input
          type="text"
          name="nama_karyawan"
          value={formData.nama_karyawan}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
      
      <div>
        <label className="block text-gray-700 font-semibold">Gaji Pokok</label>
        <input
          type="number"
          name="gaji_pokok"
          value={formData.gaji_pokok}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
      
      <div>
        <label className="block text-gray-700 font-semibold">Tunjangan</label>
        <input
          type="number"
          name="tunjangan"
          value={formData.tunjangan}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}
