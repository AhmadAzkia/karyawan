import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        k.ID_Karyawan as id, 
        k.Nama_Karyawan as name, 
        d.Nama_Departemen as department, 
        j.Nama_Jabatan as position,
        k.Tanggal_Bergabung as joinDate,
        k.Status_Karyawan as status,
        k.Jenis_Kelamin as gender,
        k.Tempat_Tanggal_Lahir as birthPlaceDate,
        k.Nomor_HP as phoneNumber,
        k.ID_Departemen as departmentId,
        k.ID_Jabatan as positionId
      FROM 
        Karyawan k
        JOIN Departemen d ON k.ID_Departemen = d.ID_Departemen
        JOIN Jabatan j ON k.ID_Jabatan = j.ID_Jabatan
      ORDER BY k.ID_Karyawan DESC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
