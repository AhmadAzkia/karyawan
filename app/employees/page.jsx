import { use } from "react";
import Link from "next/link";

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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Karyawan</h1>
       <Link href="/employees/add">
       <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Tambah Karyawan</button>
       </Link>
      </div>
      {Array.isArray(employees) && employees.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Nama Karyawan</th>
                <th className="py-3 px-6 text-left">Departemen</th>
                <th className="py-3 px-6 text-left">Jabatan</th>
                <th className="py-3 px-6 text-left">Tanggal Bergabung</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Jenis Kelamin</th>
                <th className="py-3 px-6 text-left">Tempat, Tanggal Lahir</th>
                <th className="py-3 px-6 text-left">Nomor HP</th>
                <th className="py-3 px-6 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {employees.map((employee) => (
                <tr key={employee.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{employee.id}</td>
                  <td className="py-3 px-6 text-left font-semibold">{employee.name}</td>
                  <td className="py-3 px-6 text-left">{employee.department}</td>
                  <td className="py-3 px-6 text-left">{employee.position}</td>
                  <td className="py-3 px-6 text-left">{new Date(employee.joinDate).toLocaleDateString("id-ID")}</td>
                  <td className="py-3 px-6 text-left">{employee.status}</td>
                  <td className="py-3 px-6 text-left">{employee.gender}</td>
                  <td className="py-3 px-6 text-left">{employee.birthPlaceDate}</td>
                  <td className="py-3 px-6 text-left">{employee.phoneNumber}</td>
                  <td className="py-3 px-6 text-left flex space-x-2">
                    <button className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">Edit</button>
                    <button className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600">Hapus</button>
                  </td>
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
