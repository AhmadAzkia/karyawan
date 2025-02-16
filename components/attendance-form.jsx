"use client";

import { useState } from "react";

export default function AttendanceForm({ onSubmit, currentStatus }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (action) => {
    try {
      setLoading(true);

      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found");
      }

      const response = await fetch("/api/attendance/record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          action, // 'checkin' or 'checkout'
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to record attendance");
      }

      // Refresh attendance data
      if (onSubmit) {
        onSubmit();
      }
    } catch (error) {
      console.error("Error recording attendance:", error);
      alert("Failed to record attendance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Record Attendance
      </h2>

      <div className="flex gap-4">
        <button
          onClick={() => handleSubmit("checkin")}
          disabled={loading || currentStatus === "checked-in"}
          className={`px-6 py-2 rounded-lg font-medium ${
            currentStatus === "checked-in"
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {loading ? "Processing..." : "Check In"}
        </button>

        <button
          onClick={() => handleSubmit("checkout")}
          disabled={
            loading || currentStatus === "checked-out" || !currentStatus
          }
          className={`px-6 py-2 rounded-lg font-medium ${
            currentStatus === "checked-out" || !currentStatus
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          {loading ? "Processing..." : "Check Out"}
        </button>
      </div>

      {currentStatus && (
        <p className="mt-4 text-sm text-gray-600">
          Current Status:{" "}
          {currentStatus === "checked-in" ? "Checked In" : "Checked Out"}
        </p>
      )}
    </div>
  );
}
