import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request) {
  try {
    const userRole = request.headers.get("x-user-role");
    const userId = request.headers.get("x-user-id");

    let query = `
      SELECT 
        a.ID_absensi, 
        k.Nama_Karyawan, 
        a.tanggal, 
        a.status_kehadiran, 
        a.jam_masuk, 
        a.jam_keluar,
        a.ID_karyawan
      FROM absensi a
      JOIN karyawan k ON a.ID_karyawan = k.ID_Karyawan
    `;

    // Jika role karyawan, hanya tampilkan data dirinya
    if (userRole === "karyawan") {
      query += ` WHERE a.ID_karyawan = ?`;
    }

    query += ` ORDER BY a.tanggal DESC, a.jam_masuk DESC`;

    const [rows] =
      userRole === "karyawan"
        ? await pool.query(query, [userId])
        : await pool.query(query);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { userId, action, attendanceId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID tidak ditemukan" },
        { status: 400 }
      );
    }

    // Get current date and time
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().split(" ")[0];

    // Handle check-out
    if (action === "checkout") {
      if (!attendanceId) {
        return NextResponse.json(
          { message: "ID Absensi tidak ditemukan" },
          { status: 400 }
        );
      }

      // Cek apakah sudah jam 16:00
      if (now.getHours() < 16) {
        return NextResponse.json(
          { message: "Check-out hanya bisa dilakukan setelah jam 16:00" },
          { status: 400 }
        );
      }

      await pool.query(
        "UPDATE absensi SET jam_keluar = ? WHERE ID_absensi = ?",
        [currentTime, attendanceId]
      );

      return NextResponse.json({
        message: "Check-out berhasil dicatat",
        time: currentTime,
      });
    }

    // Handle check-in
    const [existingRecord] = await pool.query(
      "SELECT * FROM absensi WHERE ID_karyawan = ? AND tanggal = ?",
      [userId, currentDate]
    );

    if (existingRecord.length > 0) {
      return NextResponse.json(
        { message: "Anda sudah melakukan absensi hari ini" },
        { status: 400 }
      );
    }

    // Generate new ID_absensi
    const [lastRecord] = await pool.query(
      "SELECT ID_absensi FROM absensi ORDER BY ID_absensi DESC LIMIT 1"
    );

    let newId = "A001";
    if (lastRecord.length > 0) {
      const lastNum = Number.parseInt(lastRecord[0].ID_absensi.substring(1));
      newId = `A${String(lastNum + 1).padStart(3, "0")}`;
    }

    // Insert new attendance record
    await pool.query(
      `INSERT INTO absensi (ID_absensi, ID_karyawan, tanggal, status_kehadiran, jam_masuk) 
       VALUES (?, ?, ?, 'Hadir', ?)`,
      [newId, userId, currentDate, currentTime]
    );

    return NextResponse.json({
      message: "Check-in berhasil dicatat",
      id: newId,
      time: currentTime,
    });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mencatat absensi" },
      { status: 500 }
    );
  }
}
