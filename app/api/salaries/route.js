import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        g.ID_Gaji as id_gaji,
        k.Nama_Karyawan as nama_karyawan,
        j.Gaji_Pokok as gaji
      FROM 
        Gaji g
        JOIN Karyawan k ON g.ID_Karyawan = k.ID_Karyawan
        JOIN Jabatan j ON g.ID_Jabatan = j.ID_Jabatan
      ORDER BY g.ID_Gaji
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching salaries:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    const [result] = await pool.query("DELETE FROM Gaji WHERE ID_Gaji = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Data gaji tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Data gaji berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting salary:", error);
    return NextResponse.json(
      { message: "Gagal menghapus data gaji" },
      { status: 500 }
    );
  }
}
