"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [search, departmentFilter, positionFilter, employees]);

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees");
      if (!res.ok) throw new Error("Failed to fetch employees");
      const data = await res.json();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees.filter((employee) =>
      employee.name.toLowerCase().includes(search.toLowerCase())
    );

    if (departmentFilter) {
      filtered = filtered.filter((employee) => employee.department === departmentFilter);
    }

    if (positionFilter) {
      filtered = filtered.filter((employee) => employee.position === positionFilter);
    }

    setFilteredEmployees(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Anda yakin ingin menghapus karyawan ini?")) {
      return;
    }

    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: "Hapus",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal menghapus karyawan");
      }

      setEmployees(employees.filter((employee) => employee.id !== id));
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Karyawan</h1>
        <Link href="/employees/add">
          <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <PlusCircle className="w-5 h-5 mr-2" /> Tambah Karyawan
          </button>
        </Link>
      </div>

      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Cari Nama Karyawan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg w-1/3"
        />
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="border p-2 rounded-lg w-1/3"
        >
          <option value="">Semua Departemen</option>
          {[...new Set(employees.map((emp) => emp.department))].map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {filteredEmployees.length > 0 ? (
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
              {filteredEmployees.map((employee) => (
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
                    <Link href={`/employees/edit/${employee.id}`}>
                      <button className="flex items-center px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                        <Pencil className="w-4 h-4 mr-1" /> Ubah
                      </button>
                    </Link>
                    <button onClick={() => handleDelete(employee.id)} className="flex items-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600">
                      <Trash2 className="w-4 h-4 mr-1" /> Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">Tidak ada karyawan yang ditemukan.</p>
      )}
    </div>
  );
}
