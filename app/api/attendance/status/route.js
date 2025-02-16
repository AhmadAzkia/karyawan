import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Get current date
    const currentDate = new Date().toISOString().split("T")[0];

    // Check today's attendance status
    const [record] = await pool.query(
      "SELECT * FROM absensi WHERE ID_karyawan = ? AND tanggal = ?",
      [userId, currentDate]
    );

    let status = null;
    if (record.length > 0) {
      status = record[0].jam_keluar ? "checked-out" : "checked-in";
    }

    return NextResponse.json({ status });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
