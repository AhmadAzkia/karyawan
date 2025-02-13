import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        j.ID_Jabatan as id,
        j.Nama_Jabatan as name,
        j.Deskripsi_Jabatan as description,
        j.Gaji_Pokok as salary,
        j.ID_Departemen as department_id,
        d.Nama_Departemen as department_name
      FROM 
        Jabatan j
        LEFT JOIN Departemen d ON j.ID_Departemen = d.ID_Departemen
      ORDER BY j.ID_Jabatan
    `);

    console.log(rows);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching positions:", error);
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
    // First, check if there are any employees with this position
    const [employees] = await pool.query(
      "SELECT COUNT(*) as count FROM Karyawan WHERE ID_Jabatan = ?",
      [id]
    );

    if (employees[0].count > 0) {
      return NextResponse.json(
        { message: "Cannot delete position with existing employees" },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      "DELETE FROM Jabatan WHERE ID_Jabatan = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Position not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Position deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting position:", error);
    return NextResponse.json(
      { message: "Failed to delete position" },
      { status: 500 }
    );
  }
}
