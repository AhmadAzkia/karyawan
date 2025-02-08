import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        j.ID_Jabatan, 
        j.Nama_Jabatan, 
        j.Deskripsi_Jabatan, 
        j.Min_Gaji, 
        j.Max_Gaji, 
        d.Nama_Departemen 
      FROM 
        Jabatan j
        LEFT JOIN Departemen d ON j.ID_Departemen = d.ID_Departemen
    `);

    if (!rows.length) {
      return NextResponse.json({ error: "No positions found" }, { status: 404 });
    }

    const formattedPositions = rows.map((position) => ({
      ID_Jabatan: position.ID_Jabatan || "-",
      Nama_Jabatan: position.Nama_Jabatan || "-",
      Deskripsi_Jabatan: position.Deskripsi_Jabatan || "-",
      Min_Gaji: position.Min_Gaji !== null && position.Min_Gaji !== undefined ? position.Min_Gaji : 0,
      Max_Gaji: position.Max_Gaji !== null && position.Max_Gaji !== undefined ? position.Max_Gaji : 0,
      department: position.Nama_Departemen || "Tidak ada data",
    }));

    return NextResponse.json(formattedPositions);
  } catch (error) {
    console.error("Error fetching positions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
