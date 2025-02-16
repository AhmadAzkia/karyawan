import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request) {
  try {
    const { userId, action } = await request.json();

    // Get current date and time
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().split(" ")[0];

    // Check if attendance record exists for today
    const [existingRecord] = await pool.query(
      "SELECT * FROM absensi WHERE ID_karyawan = ? AND tanggal = ?",
      [userId, currentDate]
    );

    if (action === "checkin") {
      // If no record exists for today, create new check-in record
      if (!existingRecord.length) {
        const [result] = await pool.query(
          `INSERT INTO absensi (ID_absensi, ID_karyawan, tanggal, status_kehadiran, jam_masuk) 
           VALUES (?, ?, ?, ?, ?)`,
          [
            `A${Math.floor(Math.random() * 1000)}`, // Generate random ID
            userId,
            currentDate,
            "Hadir",
            currentTime,
          ]
        );
        return NextResponse.json({ message: "Check-in recorded successfully" });
      } else {
        return NextResponse.json(
          { message: "Already checked in for today" },
          { status: 400 }
        );
      }
    } else if (action === "checkout") {
      // Update existing record with check-out time
      if (existingRecord.length) {
        const [result] = await pool.query(
          `UPDATE absensi SET jam_keluar = ? WHERE ID_karyawan = ? AND tanggal = ?`,
          [currentTime, userId, currentDate]
        );
        return NextResponse.json({
          message: "Check-out recorded successfully",
        });
      } else {
        return NextResponse.json(
          { message: "No check-in record found for today" },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
