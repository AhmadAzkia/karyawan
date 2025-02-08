import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    // Query untuk mengambil data absensi dengan informasi karyawan
    const [rows] = await pool.query(`
      SELECT 
        a.id_absensi, 
        k.Nama_Karyawan, 
        a.tanggal, 
        a.status_kehadiran, 
        a.jam_masuk, 
        a.jam_keluar 
      FROM absensi a
      JOIN Karyawan k ON a.id_karyawan = k.ID_Karyawan
    `);

    // Format data
    const formattedAttendance = rows.map((record) => ({
      id_absensi: record.id_absensi,
      nama_karyawan: record.Nama_Karyawan,
      tanggal: record.tanggal,
      status_kehadiran: record.status_kehadiran,
      jam_masuk: record.jam_masuk,
      jam_keluar: record.jam_keluar,
    }));

    return NextResponse.json(formattedAttendance, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
