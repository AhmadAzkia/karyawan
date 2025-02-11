"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Salaries() {
  const [salaries, setSalaries] = useState([]);

  useEffect(() => {
    async function fetchSalaries() {
      try {
        const res = await fetch("http://localhost:3000/api/salaries");
        if (!res.ok) throw new Error("Failed to fetch salaries");
        const data = await res.json();
        setSalaries(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchSalaries();
  }, []);

  const handleDelete = async (id_gaji) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus gaji ini?");
    if (confirmDelete) {
      try {
        const res = await fetch(
          `http://localhost:3000/api/salaries?id=${id_gaji}`,
          {
            method: "DELETE",
          }
        );
        if (!res.ok) throw new Error("Failed to delete salary");
        setSalaries(salaries.filter((salary) => salary.id_gaji !== id_gaji));
      } catch (error) {
        console.error("Error deleting salary:", error);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Gaji Karyawan</h1>
        <Link href="/salaries/add">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Tambah Gaji
          </button>
        </Link>
      </div>

      {salaries.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID Gaji</th>
                <th className="py-3 px-6 text-left">Nama Karyawan</th>
                <th className="py-3 px-6 text-left">Gaji Pokok</th>
                <th className="py-3 px-6 text-left">Tunjangan</th>
                <th className="py-3 px-6 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {salaries.map((salary) => (
                <tr
                  key={salary.id_gaji}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left">{salary.id_gaji}</td>
                  <td className="py-3 px-6 text-left font-semibold">
                    {salary.nama_karyawan}
                  </td>
                  <td className="py-3 px-6 text-left">
                    Rp {salary.gaji_pokok.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-6 text-left">
                    Rp {salary.tunjangan.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-6 text-left flex space-x-2">
                    <Link href={`/salaries/edit/${salary.id_gaji}`}>
                      <button className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(salary.id_gaji)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
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
          No salaries found or error occurred.
        </p>
      )}
    </div>
  );
}
