import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    const [karyawanAktif] = await pool.query(
      "SELECT COUNT(*) as count FROM Karyawan WHERE Status_Karyawan = 'aktif'"
    );
    const [totalGaji] = await pool.query(
      "SELECT SUM(Gaji_Pokok + Tunjangan) as total FROM Gaji"
    );
    const [jumlahDepartemen] = await pool.query(
      "SELECT COUNT(*) as count FROM Departemen"
    );
    const [jumlahJabatan] = await pool.query(
      "SELECT COUNT(*) as count FROM Jabatan"
    );

    const dashboardData = {
      jumlah_karyawan_aktif: karyawanAktif[0].count,
      total_gaji_bulan_ini: totalGaji[0].total,
      jumlah_departemen: jumlahDepartemen[0].count,
      jumlah_jabatan: jumlahJabatan[0].count,
    };

    return NextResponse.json(dashboardData, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
