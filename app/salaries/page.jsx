import { use } from "react";

async function getSalaries() {
  const res = await fetch("http://localhost:3000/api/salaries");
  if (!res.ok) {
    throw new Error("Failed to fetch salaries");
  }
  return res.json();
}

export default function Salaries() {
  const salaries = use(getSalaries());

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Gaji Karyawan</h1>
      {Array.isArray(salaries) && salaries.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID Gaji</th>
                <th className="py-3 px-6 text-left">Nama Karyawan</th>
                <th className="py-3 px-6 text-left">Gaji Pokok</th>
                <th className="py-3 px-6 text-left">Tunjangan</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {salaries.map((salary, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{salary.id_gaji}</td>
                  <td className="py-3 px-6 text-left font-semibold">{salary.nama_karyawan}</td>
                  <td className="py-3 px-6 text-left">Rp {salary.gaji_pokok.toLocaleString("id-ID")}</td>
                  <td className="py-3 px-6 text-left">Rp {salary.tunjangan.toLocaleString("id-ID")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">No salaries found or error occurred.</p>
      )}
    </div>
  );
}