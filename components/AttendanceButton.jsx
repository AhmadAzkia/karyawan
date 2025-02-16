"use client";

import { useState, useEffect } from "react";

export default function AttendanceButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Cek apakah pengguna adalah admin
    const role = localStorage.getItem("userRole");
    if (role === "admin") {
      setIsAdmin(true);
    }
    checkTodayAttendance();
  }, []);

  const checkTodayAttendance = async () => {
    try {
      const res = await fetch("/api/attendance");
      const data = await res.json();
      const today = new Date().toISOString().split("T")[0];
      const todayRecord = data.find((record) => record.tanggal.includes(today));
      setAttendance(todayRecord || null);
    } catch (error) {
      console.error("Error checking attendance:", error);
    }
  };

  const handleAttendance = async (action) => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");

      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: data.message });
        // Update local state immediately
        if (action === "checkin") {
          setAttendance({ ...attendance, jam_masuk: data.time });
        } else {
          setAttendance({ ...attendance, jam_keluar: data.time });
        }
      } else {
        throw new Error(data.message || "Gagal mencatat absensi");
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const isAfter4PM = new Date().getHours() >= 16;

  if (isAdmin) {
    return null; // Tidak menampilkan tombol jika user adalah admin
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <button
          onClick={() => handleAttendance("checkin")}
          disabled={loading || attendance?.jam_masuk}
          className={`flex-1 px-4 py-2 text-white font-medium rounded-lg transition-colors
            ${
              loading || attendance?.jam_masuk
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
        >
          {loading ? "Memproses..." : "Check In"}
        </button>

        <button
          onClick={() => handleAttendance("checkout")}
          disabled={
            loading ||
            !attendance?.jam_masuk ||
            attendance?.jam_keluar ||
            !isAfter4PM
          }
          className={`flex-1 px-4 py-2 text-white font-medium rounded-lg transition-colors
            ${
              loading ||
              !attendance?.jam_masuk ||
              attendance?.jam_keluar ||
              !isAfter4PM
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
        >
          {loading ? "Memproses..." : "Check Out"}
        </button>
      </div>

      {attendance?.jam_masuk && (
        <div className="p-4 bg-green-50 rounded-lg text-green-700">
          ✓ Sudah Check In pada {attendance.jam_masuk}
        </div>
      )}

      {attendance?.jam_masuk && !attendance?.jam_keluar && !isAfter4PM && (
        <div className="p-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm">
          Tombol check-out akan aktif setelah jam 16:00
        </div>
      )}

      {attendance?.jam_keluar && (
        <div className="p-4 bg-green-50 rounded-lg text-green-700">
          ✓ Sudah Check Out pada {attendance.jam_keluar}
        </div>
      )}

      {message && (
        <div
          className={`p-4 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
