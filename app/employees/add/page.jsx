"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddEmployee() {
  const router = useRouter();
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nama: "",
    departemen: "",
    jabatan: "",
    tanggal_bergabung: "",
    status: "aktif",
    jenis_kelamin: "L",
    tempat_tanggal_lahir: "",
    nomor_hp: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [resDept, resPos] = await Promise.all([
          fetch("/api/departments"),
          fetch("/api/positions"),
        ]);

        if (!resDept.ok || !resPos.ok) throw new Error("Gagal mengambil data");

        const deptData = await resDept.json();
        const posData = await resPos.json();

        console.log("Data Departemen:", deptData); // Cek apakah data departemen tersedia
        console.log("Data Jabatan:", posData); // Cek apakah data jabatan tersedia

        setDepartments(deptData);
        setPositions(posData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Gagal mengambil data departemen dan jabatan.");
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (formData.departemen) {
      console.log("🔍 Filter Jabatan untuk Departemen:", formData.departemen);
      console.log("📋 Data Jabatan Tersedia:", positions);

      const filtered = positions.filter(
        (pos) =>
          String(pos.department_id).trim() ===
          String(formData.departemen).trim()
      );

      console.log("🎯 Jabatan yang cocok:", filtered);
      setFilteredPositions(filtered);
      setFormData((prev) => ({ ...prev, jabatan: "" }));
    }
  }, [formData.departemen, positions]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/employees/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Gagal menambahkan karyawan");

      router.push("/employees");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Tambah Karyawan Baru</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}

        <div>
          <label className="block text-sm font-medium mb-1">
            Nama Karyawan
          </label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Departemen</label>
            <select
              name="departemen"
              value={formData.departemen}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
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
            <label className="block text-sm font-medium mb-1">Jabatan</label>
            <select
              name="jabatan"
              value={formData.jabatan}
              onChange={handleChange}
              required
              disabled={!formData.departemen || filteredPositions.length === 0}
              className="w-full p-2 border border-gray-300 rounded disabled:bg-gray-100"
            >
              <option value="">Pilih Jabatan</option>
              {filteredPositions.length > 0 ? (
                filteredPositions.map((pos) => (
                  <option key={pos.id} value={pos.id}>
                    {pos.name} ({pos.department_id})
                  </option>
                ))
              ) : (
                <option disabled>Jabatan tidak ditemukan</option>
              )}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Tanggal Bergabung
          </label>
          <input
            type="date"
            name="tanggal_bergabung"
            value={formData.tanggal_bergabung}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Jenis Kelamin
            </label>
            <select
              name="jenis_kelamin"
              value={formData.jenis_kelamin}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Tempat & Tanggal Lahir
          </label>
          <input
            type="text"
            name="tempat_tanggal_lahir"
            value={formData.tempat_tanggal_lahir}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Contoh: Jakarta, 2003-03-21"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nomor HP</label>
          <input
            type="text"
            name="nomor_hp"
            value={formData.nomor_hp}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Contoh: 08123456789"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan"}
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
