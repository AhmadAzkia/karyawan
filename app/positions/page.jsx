"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";

async function getPositions() {
  const res = await fetch("http://localhost:3000/api/positions", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch positions");
  }
  return res.json();
}

export default function Positions() {
  const [positions, setPositions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const router = useRouter();

  useState(() => {
    getPositions().then(setPositions);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus jabatan ini?")) {
      return;
    }

    try {
      const res = await fetch(`/api/positions?id=${id}`, {
        method: "Hapus",
      });

      if (!res.ok) {
        throw new Error("Gagal menghapus jabatan");
      }

      setPositions(positions.filter((pos) => pos.id !== id));
    } catch (error) {
      console.error("Error deleting position:", error);
      alert("Gagal menghapus jabatan");
    }
  };

  const filteredPositions = positions.filter((pos) =>
    pos.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedDepartment === "" || pos.department_name === selectedDepartment)
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Jabatan</h1>
        <Link href="/positions/add">
          <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <PlusCircle className="w-5 h-5 mr-2" />
            Tambah Jabatan
          </button>
        </Link>
      </div>
      
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Cari Jabatan..."
          className="border p-2 rounded-lg w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border p-2 rounded-lg w-1/3"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="">Semua Departemen</option>
          {[...new Set(positions.map((pos) => pos.department_name))].map(
            (dept, index) => (
              <option key={index} value={dept}>{dept}</option>
            )
          )}
        </select>
      </div>
      
      {filteredPositions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Nama Jabatan</th>
                <th className="py-3 px-6 text-left w-1/2">Deskripsi</th>
                <th className="py-3 px-6 text-left">Gaji Pokok</th>
                <th className="py-3 px-6 text-left">Departemen</th>
                <th className="py-3 px-6 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {filteredPositions.map((pos) => (
                <tr
                  key={pos.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left">{pos.id || "-"}</td>
                  <td className="py-3 px-6 text-left font-semibold">
                    {pos.name || "-"}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {pos.description || "-"}
                  </td>
                  <td className="py-3 px-6 text-left">{pos.salary || "-"}</td>
                  <td className="py-3 px-6 text-left">
                    {pos.department_name || "Tidak ada data"}
                  </td>
                  <td className="py-3 px-6 text-left flex space-x-2">
                    <Link href={`/positions/edit/${pos.id}`}>
                      <button className="flex items-center px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(pos.id)}
                      className="flex items-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">
          No positions found or error occurred.
        </p>
      )}
    </div>
  );
}
