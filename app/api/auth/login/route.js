import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Get user from database
    const [users] = await pool.query(
      `SELECT 
        k.ID_Karyawan as id,
        k.Nama_Karyawan as nama,
        CASE 
          WHEN j.Nama_Jabatan LIKE '%Manager%' OR j.Nama_Jabatan LIKE '%Director%' THEN 'admin'
          ELSE 'karyawan'
        END as role
      FROM karyawan k
      JOIN jabatan j ON k.ID_Jabatan = j.ID_Jabatan
      WHERE k.Nama_Karyawan = ?`,
      [username]
    );

    if (!users.length) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const user = users[0];

    // Generate simple token (in production, use proper JWT)
    const token = Buffer.from(`${user.id}-${Date.now()}`).toString("base64");

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        nama: user.nama,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
