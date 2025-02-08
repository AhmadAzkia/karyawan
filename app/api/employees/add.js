import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function POST(req) {
  try {
    const { nama, departemen, jabatan, tanggal_bergabung, status, jenis_kelamin, tempat_tanggal_lahir, nomor_hp } =
      await req.json();

    const [result] = await pool.query(
      `INSERT INTO Karyawan 
       (Nama_Karyawan, ID_Departemen, ID_Jabatan, Tanggal_Bergabung, Status_Karyawan, Jenis_Kelamin, Tempat_Tanggal_Lahir, Nomor_HP) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nama, departemen, jabatan, tanggal_bergabung, status, jenis_kelamin, tempat_tanggal_lahir, nomor_hp]
    );

    if (result.affectedRows > 0) {
      return NextResponse.json({ message: "Karyawan berhasil ditambahkan" }, { status: 201 });
    } else {
      return NextResponse.json({ message: "Gagal menambahkan karyawan" }, { status: 500 });
    }
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
