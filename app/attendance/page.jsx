import { use } from "react";

async function getAttendance() {
  const res = await fetch("http://localhost:3000/api/attendance");
  if (!res.ok) {
    throw new Error("Failed to fetch attendance records");
  }
  return res.json();
}

export default function Attendance() {
  const attendance = use(getAttendance());

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Kehadiran Karyawan</h1>
      {Array.isArray(attendance) && attendance.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID Absensi</th>
                <th className="py-3 px-6 text-left">Nama Karyawan</th>
                <th className="py-3 px-6 text-left">Tanggal</th>
                <th className="py-3 px-6 text-left">Status Kehadiran</th>
                <th className="py-3 px-6 text-left">Jam Masuk</th>
                <th className="py-3 px-6 text-left">Jam Keluar</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {attendance.map((record, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{record.id_absensi}</td>
                  <td className="py-3 px-6 text-left font-semibold">{record.nama_karyawan || record.id_karyawan}</td>
                  <td className="py-3 px-6 text-left">{new Date(record.tanggal).toLocaleDateString("id-ID")}</td>
                  <td className="py-3 px-6 text-left">{record.status_kehadiran}</td>
                  <td className="py-3 px-6 text-left">{record.jam_masuk}</td>
                  <td className="py-3 px-6 text-left">{record.jam_keluar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">No attendance records found or error occurred.</p>
      )}
    </div>
  );
}
