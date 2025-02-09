"use client"; // Tambahkan ini di baris pertama

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Departments() {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await fetch("/api/departments");
        if (!res.ok) throw new Error("Failed to fetch departments");
        const data = await res.json();
        setDepartments(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchDepartments();
  }, []);

  const handleDelete = async (id) => {
    await fetch(`/api/departments/delete?id=${id}`, { method: "DELETE" });
    setDepartments(departments.filter(dept => dept.id !== id)); // Hapus dari state
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Departemen</h1>
        <Link href="/departments/add">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Tambah Departemen
          </button>
        </Link>
      </div>

      {departments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Nama Departemen</th>
                <th className="py-3 px-6 text-left">Deskripsi</th>
                <th className="py-3 px-6 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {departments.map((dept) => (
                <tr key={dept.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{dept.id}</td>
                  <td className="py-3 px-6 text-left font-semibold">{dept.name}</td>
                  <td className="py-3 px-6 text-left">{dept.description}</td>
                  <td className="py-3 px-6 text-left flex space-x-2">
                    <Link href={`/departments/edit/${dept.id}`}>
                      <button className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(dept.id)}
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
        <p className="text-center text-gray-600">No departments found or error occurred.</p>
      )}
    </div>
  );
}
