import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    // Ambil data dari tabel Departemen
    const [rows] = await pool.query(`
      SELECT 
        ID_Departemen AS id, 
        Nama_Departemen AS name, 
        Deskripsi_Departemen AS description 
      FROM Departemen
    `);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
