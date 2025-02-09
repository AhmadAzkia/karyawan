"use client";

import { useState, useEffect } from "react";

export function AttendanceStatus({ userId }) {
  const [status, setStatus] = useState({
    isCheckedIn: false,
    isCheckedOut: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const res = await fetch(`/api/attendance/status?id_karyawan=${userId}`);
      const data = await res.json();
      if (data.todayRecord) {
        setStatus({
          isCheckedIn: !!data.todayRecord.jam_masuk,
          isCheckedOut: !!data.todayRecord.jam_keluar,
        });
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendance = async (type) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/attendance/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_karyawan: userId, type }),
      });
      const data = await res.json();
      if (res.ok) {
        await fetchTodayAttendance();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Status Absensi Hari Ini</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex space-x-4">
        <button
          onClick={() => handleAttendance("masuk")}
          disabled={loading || status.isCheckedIn}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          {status.isCheckedIn ? "Sudah Absen Masuk" : "Absen Masuk"}
        </button>
        <button
          onClick={() => handleAttendance("pulang")}
          disabled={loading || !status.isCheckedIn || status.isCheckedOut}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          {status.isCheckedOut ? "Sudah Absen Pulang" : "Absen Pulang"}
        </button>
      </div>
    </div>
  );
}
