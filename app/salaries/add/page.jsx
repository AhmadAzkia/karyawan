"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddSalary() {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    id_karyawan: "",
    gaji_pokok: "",
    tunjangan: "",
  });

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch("http://localhost:3000/api/employees");
        if (!res.ok) throw new Error("Failed to fetch employees");
        const data = await res.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    }
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/salaries/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add salary");

      router.push("/salaries");
    } catch (error) {
      console.error("Error adding salary:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Tambah Gaji Karyawan</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Karyawan</label>
          <select
            name="id_karyawan"
            value={formData.id_karyawan}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Pilih Karyawan</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Gaji Pokok</label>
          <input
            type="number"
            name="gaji_pokok"
            value={formData.gaji_pokok}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tunjangan</label>
          <input
            type="number"
            name="tunjangan"
            value={formData.tunjangan}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => router.push("/salaries")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
