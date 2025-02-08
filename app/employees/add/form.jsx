"use client";
import { useState, useEffect } from "react";

export default function EmployeeForm({ onSuccess }) {
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

  // Fetch Departemen dan Jabatan dari API
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

        console.log("Departemen:", deptData);
        console.log("Jabatan:", posData);

        setDepartments(deptData);
        setPositions(posData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Gagal mengambil data departemen dan jabatan.");
      }
    }

    fetchData();
  }, []);

  // Filter jabatan berdasarkan departemen yang dipilih
  useEffect(() => {
    if (formData.departemen) {
      console.log("Departemen Terpilih:", formData.departemen);
      console.log("Semua Jabatan:", positions);
  
      // 🔥 Pastikan filtering berdasarkan `department_id`
      const filtered = positions.filter(
        (pos) => pos.department_id === formData.departemen
      );
  
      console.log("Jabatan yang Ditampilkan:", filtered);
      setFilteredPositions(filtered);
      setFormData((prev) => ({ ...prev, jabatan: "" })); // Reset pilihan jabatan jika departemen berubah
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

      onSuccess(); // Panggil fungsi setelah berhasil
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      <div>
        <label className="block text-sm font-medium">Nama Karyawan</label>
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
          <label className="block text-sm font-medium">Departemen</label>
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
          <label className="block text-sm font-medium">Jabatan</label>
          <select
            name="jabatan"
            value={formData.jabatan}
            onChange={handleChange}
            required
            disabled={!formData.departemen || filteredPositions.length === 0}
            className="w-full p-2 border border-gray-300 rounded disabled:bg-gray-100"
          >
            <option value="">Pilih Jabatan</option>
            {filteredPositions.map((pos) => (
              <option key={pos.id} value={pos.id}>
                {pos.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Tanggal Bergabung</label>
        <input
          type="date"
          name="tanggal_bergabung"
          value={formData.tanggal_bergabung}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">Status</label>
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
          <label className="block text-sm font-medium">Jenis Kelamin</label>
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
        <label className="block text-sm font-medium">Tempat & Tanggal Lahir</label>
        <input
          type="text"
          name="tempat_tanggal_lahir"
          value={formData.tempat_tanggal_lahir}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Nomor HP</label>
        <input
          type="text"
          name="nomor_hp"
          value={formData.nomor_hp}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? "Menyimpan..." : "Tambah Karyawan"}
      </button>
    </form>
  );
}
