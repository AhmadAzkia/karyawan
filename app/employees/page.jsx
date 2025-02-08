import { use } from "react";

async function getEmployees() {
  const res = await fetch("http://localhost:3000/api/employees");
  if (!res.ok) {
    throw new Error("Failed to fetch employees");
  }
  return res.json();
}

export default function Employees() {
  const employees = use(getEmployees());

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Karyawan</h1>
      {Array.isArray(employees) && employees.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Nama Karyawan</th>
                <th className="py-3 px-6 text-left">Departemen</th>
                <th className="py-3 px-6 text-left">Jabatan</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {employees.map((employee) => (
                <tr key={employee.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{employee.id}</td>
                  <td className="py-3 px-6 text-left font-semibold">{employee.name}</td>
                  <td className="py-3 px-6 text-left">{employee.department}</td>
                  <td className="py-3 px-6 text-left">{employee.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">No employees found or error occurred.</p>
      )}
    </div>
  );
}
