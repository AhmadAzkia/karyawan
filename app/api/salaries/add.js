import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Sesuaikan dengan koneksi database

export async function POST(req) {
  try {
    const { nama_karyawan, gaji_pokok, tunjangan } = await req.json();

    if (!nama_karyawan || !gaji_pokok || !tunjangan) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
    }

    const result = await db.query("INSERT INTO salaries (nama_karyawan, gaji_pokok, tunjangan) VALUES (?, ?, ?)", [nama_karyawan, gaji_pokok, tunjangan]);

    return NextResponse.json({ message: "Gaji berhasil ditambahkan", id: result.insertId });
  } catch (error) {
    console.error("Error adding salary:", error);
    return NextResponse.json({ error: "Gagal menambah gaji" }, { status: 500 });
  }
}
