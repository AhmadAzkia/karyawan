import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    // Pastikan koneksi database tersedia sebelum query
    if (!pool) {
      return NextResponse.json({ error: "Database connection not available" }, { status: 500 });
    }

    const [rows] = await pool.query(`
      SELECT 
        j.ID_Jabatan, 
        j.Nama_Jabatan, 
        j.Deskripsi_Jabatan, 
        COALESCE(j.Min_Gaji, 0) AS Min_Gaji, 
        COALESCE(j.Max_Gaji, 0) AS Max_Gaji, 
        COALESCE(d.Nama_Departemen, 'Tidak ada data') AS Nama_Departemen
      FROM 
        Jabatan j
      LEFT JOIN 
        Departemen d ON j.ID_Departemen = d.ID_Departemen
    `);

    if (rows.length === 0) {
      return NextResponse.json({ error: "No positions found" }, { status: 404 });
    }

    // Format data sebelum dikirim ke frontend
    const formattedPositions = rows.map((position) => ({
      ID_Jabatan: position.ID_Jabatan || "-",
      Nama_Jabatan: position.Nama_Jabatan || "-",
      Deskripsi_Jabatan: position.Deskripsi_Jabatan || "-",
      Min_Gaji: position.Min_Gaji,
      Max_Gaji: position.Max_Gaji,
      department: position.Nama_Departemen,
    }));

    return NextResponse.json(formattedPositions);
  } catch (error) {
    console.error("Error fetching positions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
