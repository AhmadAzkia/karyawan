"use client";

import { useState, useEffect } from "react";
import AttendanceForm from "./attendance-form";

export default function AttendanceStatus({ userId, onAttendanceUpdate }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state

  const checkStatus = async () => {
    setError(null); // Reset error on each check
    setLoading(true);
    try {
      const response = await fetch(`/api/attendance/status?userId=${userId}`);
      if (!response.ok) {
        const errorData = await response.json(); // Try to get error details
        const errorMessage = errorData.message || "Failed to fetch status";
        throw new Error(errorMessage);
      }
      const data = await response.json();
      setStatus(data.status);
    } catch (error) {
      console.error("Error checking status:", error);
      setError(error.message); // Set error message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleAttendanceUpdate = () => {
    checkStatus();
    if (onAttendanceUpdate) {
      onAttendanceUpdate();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message
  }

  return (
    <AttendanceForm currentStatus={status} onSubmit={handleAttendanceUpdate} />
  );
}
