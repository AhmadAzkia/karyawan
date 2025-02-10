import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        ID_Departemen as id, 
        Nama_Departemen as name, 
        Deskripsi_Departemen as description 
      FROM Departemen
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
