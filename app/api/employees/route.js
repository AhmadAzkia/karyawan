import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        k.ID_Karyawan, 
        k.Nama_Karyawan, 
        d.Nama_Departemen, 
        j.Nama_Jabatan,
        k.Tanggal_Bergabung,
        k.Status_Karyawan,
        k.Jenis_Kelamin,
        k.Tempat_Tanggal_Lahir,
        k.Nomor_HP
      FROM 
        Karyawan k
        JOIN Departemen d ON k.ID_Departemen = d.ID_Departemen
        JOIN Jabatan j ON k.ID_Jabatan = j.ID_Jabatan
    `);

    const formattedEmployees = rows.map((employee) => ({
      id: employee.ID_Karyawan,
      name: employee.Nama_Karyawan,
      department: employee.Nama_Departemen,
      position: employee.Nama_Jabatan,
      joinDate: employee.Tanggal_Bergabung,
      status: employee.Status_Karyawan,
      gender: employee.Jenis_Kelamin,
      birthPlaceDate: employee.Tempat_Tanggal_Lahir,
      phoneNumber: employee.Nomor_HP
    }));

    return NextResponse.json(formattedEmployees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}