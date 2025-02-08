import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    const queries = {
      jumlah_karyawan_aktif: "SELECT COUNT(*) AS jumlah FROM Karyawan WHERE Status_Karyawan = 'aktif';",
      total_gaji_bulan_ini: "SELECT SUM(Gaji_Pokok + Tunjangan) AS total FROM Gaji;",
      jumlah_departemen: "SELECT COUNT(*) AS jumlah FROM Departemen;",
      jumlah_jabatan: "SELECT COUNT(*) AS jumlah FROM Jabatan;",
    };

    let results = {};
    for (const [key, query] of Object.entries(queries)) {
      const [rows] = await pool.query(query);
      results[key] = rows.length ? Object.values(rows[0])[0] : null;
    }

    console.log("API Response:", results); // Debugging

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
