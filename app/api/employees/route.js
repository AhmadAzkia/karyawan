import { NextResponse } from "next/server"
import pool from "../../../lib/db"

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        k.ID_Karyawan, 
        k.Nama_Karyawan, 
        d.Nama_Departemen, 
        j.Nama_Jabatan
      FROM 
        Karyawan k
        JOIN Departemen d ON k.ID_Departemen = d.ID_Departemen
        JOIN Jabatan j ON k.ID_Jabatan = j.ID_Jabatan
    `)

    const formattedEmployees = rows.map((employee) => ({
      id: employee.ID_Karyawan,
      name: employee.Nama_Karyawan,
      department: employee.Nama_Departemen,
      position: employee.Nama_Jabatan,
    }))

    return NextResponse.json(formattedEmployees)
  } catch (error) {
    console.error("Error fetching employees:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}