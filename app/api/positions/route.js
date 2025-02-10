import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        j.ID_Jabatan as id,
        j.Nama_Jabatan as name,
        j.Deskripsi_Jabatan as description,
        j.ID_Departemen as department_id
      FROM 
        Jabatan j
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching positions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
