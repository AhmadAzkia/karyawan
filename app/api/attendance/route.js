import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    // Query untuk mengambil semua data absensi
    const [rows] = await pool.query("SELECT * FROM absensi");

    // Mengembalikan data dalam format JSON
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
