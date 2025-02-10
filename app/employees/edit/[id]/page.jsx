"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditEmployee() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [loading, setLoading] = useState(true);
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
      if (!id) {
        setError("ID Karyawan tidak ditemukan");
        setLoading(false);
        return;
      }

      try {
        // Fetch data karyawan
        const employeeRes = await fetch("/api/employees/" + id);

        // Cek response status
        if (!employeeRes.ok) {
          const errorData = await employeeRes.json().catch(() => ({}));
          throw new Error(errorData.message || "Gagal mengambil data karyawan");
        }

        const employeeData = await employeeRes.json();

        // Fetch data departemen dan jabatan secara parallel
        const [deptRes, posRes] = await Promise.all([
          fetch("/api/departments"),
          fetch("/api/positions"),
        ]);

        // Cek response status untuk departemen dan jabatan
        if (!deptRes.ok || !posRes.ok) {
          throw new Error("Gagal mengambil data departemen atau jabatan");
        }

        const [deptData, posData] = await Promise.all([
          deptRes.json(),
          posRes.json(),
        ]);

        // Update state dengan data yang diterima
        setFormData({
          nama: employeeData.Nama_Karyawan || "",
          departemen: employeeData.departemen || "",
          jabatan: employeeData.jabatan || "",
          tanggal_bergabung: employeeData.Tanggal_Bergabung
            ? new Date(employeeData.Tanggal_Bergabung)
                .toISOString()
                .split("T")[0]
            : "",
          status: employeeData.status || "aktif",
          jenis_kelamin: employeeData.jenis_kelamin || "L",
          tempat_tanggal_lahir: employeeData.Tempat_Tanggal_Lahir || "",
          nomor_hp: employeeData.Nomor_HP || "",
        });

        setDepartments(deptData);
        setPositions(posData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  useEffect(() => {
    if (formData.departemen) {
      const filtered = positions.filter(
        (pos) => pos.department_id === formData.departemen
      );
      setFilteredPositions(filtered);
    }
  }, [formData.departemen, positions]);

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
      const res = await fetch(`/api/employees/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal memperbarui data karyawan");
      }

      router.push("/employees");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Memuat data...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">Error</p>
          <p>{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Kembali
          </button>
        </div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Edit Karyawan</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

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
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
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
          <label className="block text-sm font-medium mb-1">
            Tanggal Bergabung
          </label>
          <input
            type="date"
            name="tanggal_bergabung"
            value={formData.tanggal_bergabung}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="aktif">Aktif</option>
              <option value="non-aktif">Nonaktif</option>
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
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 p-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
