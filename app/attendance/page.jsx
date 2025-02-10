"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AttendanceStatus } from "@/components/AttendanceStatus";

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    const storedUserId = localStorage.getItem("userId");
    if (!userRole) {
      router.push("/login");
    } else {
      setUserId(storedUserId);
      fetchAttendance();
    }
  }, [router]);

  const fetchAttendance = async () => {
    try {
      const res = await fetch("/api/attendance");
      if (!res.ok) {
        throw new Error("Failed to fetch attendance records");
      }
      const data = await res.json();
      setAttendance(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex transition-all duration-300">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
            Kehadiran Karyawan
          </h1>
          {userId && (
            <AttendanceStatus
              userId={userId}
              onAttendanceUpdate={fetchAttendance}
            />
          )}
          {attendance.length > 0 ? (
            <div className="overflow-x-auto mt-6">
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
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-3 px-6 text-left">
                        {record.id_absensi}
                      </td>
                      <td className="py-3 px-6 text-left font-semibold">
                        {record.nama_karyawan}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {new Date(record.tanggal).toLocaleDateString("id-ID")}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {record.status_kehadiran}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {record.jam_masuk}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {record.jam_keluar}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-600">
              No attendance records found.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
