import { NextResponse } from "next/server";
import pool from "../../../lib/db"; // Pastikan file ini mengandung koneksi ke database

export async function POST(req) {
  try {
    const body = await req.json();

    // Validasi input
    if (!body.Nama_Jabatan || !body.Deskripsi_Jabatan || !body.Min_Gaji || !body.Max_Gaji || !body.department_id) {
      return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
    }

    // Periksa apakah department_id valid
    const [department] = await pool.query("SELECT id FROM departments WHERE id = ?", [body.department_id]);

    if (department.length === 0) {
      return NextResponse.json({ error: "Departemen tidak ditemukan" }, { status: 404 });
    }

    // Simpan jabatan ke database
    const [result] = await pool.query("INSERT INTO positions (Nama_Jabatan, Deskripsi_Jabatan, Min_Gaji, Max_Gaji, department_id) VALUES (?, ?, ?, ?, ?)", [
      body.Nama_Jabatan,
      body.Deskripsi_Jabatan,
      body.Min_Gaji,
      body.Max_Gaji,
      body.department_id,
    ]);

    return NextResponse.json({ message: "Jabatan berhasil ditambahkan", data: { id: result.insertId } }, { status: 201 });
  } catch (error) {
    console.error("Error adding position:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
