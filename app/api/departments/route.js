import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM Departemen");

    const departments = rows.map((dept) => ({
      id: dept.ID_Departemen,
      name: dept.Nama_Departemen,
      description: dept.Deskripsi_Departemen,
    }));

    return NextResponse.json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
