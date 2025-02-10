import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

// Menambahkan GET method untuk mengambil data karyawan
export async function GET(req, { params }) {
  try {
    const { id } = params;

    // Mengambil data karyawan beserta informasi departemen dan jabatan
    const [rows] = await pool.query(
      `SELECT 
        k.*,
        d.Nama_Departemen as nama_departemen,
        j.Nama_Jabatan as nama_jabatan
       FROM Karyawan k
       LEFT JOIN Departemen d ON k.ID_Departemen = d.ID_Departemen
       LEFT JOIN Jabatan j ON k.ID_Jabatan = j.ID_Jabatan
       WHERE k.ID_Karyawan = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Data karyawan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error fetching employee:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data karyawan: " + error.message },
      { status: 500 }
    );
  }
}

// Method DELETE yang sudah ada
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    await pool.query("DELETE FROM absensi WHERE id_karyawan = ?", [id]);
    await pool.query("DELETE FROM gaji WHERE ID_Karyawan = ?", [id]);

    const [checkRows] = await pool.query(
      "SELECT ID_Karyawan FROM Karyawan WHERE ID_Karyawan = ?",
      [id]
    );

    if (checkRows.length === 0) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    const [result] = await pool.query(
      "DELETE FROM Karyawan WHERE ID_Karyawan = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Failed to delete employee" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Employee deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { message: "Failed to delete employee: " + error.message },
      { status: 500 }
    );
  }
}

// Menambahkan PUT method untuk update data
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const data = await req.json();

    const [result] = await pool.query(
      `UPDATE Karyawan SET 
        Nama_Karyawan = ?,
        ID_Departemen = ?,
        ID_Jabatan = ?,
        Tanggal_Bergabung = ?,
        Status_Karyawan = ?,
        Jenis_Kelamin = ?,
        Tempat_Tanggal_Lahir = ?,
        Nomor_HP = ?
       WHERE ID_karyawan = ?`,
      [
        data.nama,
        data.departemen,
        data.jabatan,
        data.tanggal_bergabung,
        data.status,
        data.jenis_kelamin,
        data.tempat_tanggal_lahir,
        data.nomor_hp,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Gagal memperbarui data karyawan" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Data berhasil diperbarui" });
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui data: " + error.message },
      { status: 500 }
    );
  }
}
