import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id_karyawan = searchParams.get("id_karyawan");
  const today = new Date().toISOString().split("T")[0];

  try {
    const [rows] = await pool.query(
      "SELECT * FROM Absensi WHERE id_karyawan = ? AND tanggal = ?",
      [id_karyawan, today]
    );

    return NextResponse.json({ todayRecord: rows[0] || null });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
