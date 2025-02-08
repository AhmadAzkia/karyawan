import { use } from "react";

async function getDepartments() {
  const res = await fetch("http://localhost:3000/api/departments");
  if (!res.ok) {
    throw new Error("Failed to fetch departments");
  }
  return res.json();
}

export default function Departments() {
  const departments = use(getDepartments());

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Departemen</h1>
      {Array.isArray(departments) && departments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Nama Departemen</th>
                <th className="py-3 px-6 text-left">Deskripsi</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {departments.map((dept) => (
                <tr key={dept.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{dept.id}</td>
                  <td className="py-3 px-6 text-left font-semibold">{dept.name}</td>
                  <td className="py-3 px-6 text-left">{dept.description}</td>
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
