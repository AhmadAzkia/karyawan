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
}
