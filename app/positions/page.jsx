import { use } from "react";

async function getPositions() {
  const res = await fetch("http://localhost:3000/api/positions");
  if (!res.ok) {
    throw new Error("Failed to fetch positions");
  }
  return res.json();
}

export default function Positions() {
  const positions = use(getPositions());

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Jabatan</h1>
      {Array.isArray(positions) && positions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Nama Jabatan</th>
                <th className="py-3 px-6 text-left w-1/2">Deskripsi</th>
                <th className="py-3 px-6 text-left">Min-Gaji</th>
                <th className="py-3 px-6 text-left">Max-Gaji</th>
                <th className="py-3 px-6 text-left">Departemen</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {positions.map((pos, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{pos.ID_Jabatan || "-"}</td>
                  <td className="py-3 px-6 text-left font-semibold">{pos.Nama_Jabatan || "-"}</td>
                  <td className="py-3 px-6 text-left">{pos.Deskripsi_Jabatan || "-"}</td>
                  <td className="py-3 px-6 text-left">{pos.Min_Gaji !== null && pos.Min_Gaji !== undefined ? `Rp ${pos.Min_Gaji.toLocaleString("id-ID")}` : "-"}</td>
                  <td className="py-3 px-6 text-left">{pos.Max_Gaji !== null && pos.Max_Gaji !== undefined ? `Rp ${pos.Max_Gaji.toLocaleString("id-ID")}` : "-"}</td>
                  <td className="py-3 px-6 text-center">{pos.department || "Tidak ada data"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">No positions found or error occurred.</p>
      )}
    </div>
  );
}
