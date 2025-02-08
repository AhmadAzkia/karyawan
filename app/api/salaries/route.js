import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    // Query untuk mengambil data gaji dengan informasi karyawan
    const [rows] = await pool.query(`
      SELECT 
        g.ID_Gaji, 
        k.Nama_Karyawan, 
        g.Gaji_Pokok, 
        g.Tunjangan 
      FROM gaji g
      JOIN Karyawan k ON g.ID_Karyawan = k.ID_Karyawan
    `);

    // Format data
    const formattedSalaries = rows.map((salary) => ({
      id_gaji: salary.ID_Gaji,
      nama_karyawan: salary.Nama_Karyawan,
      gaji_pokok: salary.Gaji_Pokok,
      tunjangan: salary.Tunjangan,
    }));

    return NextResponse.json(formattedSalaries, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
