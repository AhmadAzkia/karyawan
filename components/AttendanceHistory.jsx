"use client";

import { useState, useEffect } from "react";

export function AttendanceHistory({ userId }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendanceHistory();
  }, []);

  const fetchAttendanceHistory = async () => {
    try {
      const res = await fetch(`/api/attendance?id_karyawan=${userId}`);
      const data = await res.json();
      setRecords(data);
    } catch (error) {
      console.error("Error fetching attendance history:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return timeString ? timeString.slice(0, 5) : "-";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Riwayat Absensi</h2>
      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Tanggal</th>
              <th className="text-left">Jam Masuk</th>
              <th className="text-left">Jam Pulang</th>
              <th className="text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id_absensi}>
                <td>{formatDate(record.tanggal)}</td>
                <td>{formatTime(record.jam_masuk)}</td>
                <td>{formatTime(record.jam_keluar)}</td>
                <td>{record.status_kehadiran}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
