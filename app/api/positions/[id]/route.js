import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function GET(req, { params }) {
  try {
    const { id } = params;

    const [rows] = await pool.query(
      `SELECT 
        ID_Jabatan as id,
        Nama_Jabatan as nama_jabatan,
        ID_Departemen as id_departemen,
        Deskripsi_Jabatan as deskripsi_jabatan,
        Min_Gaji as min_gaji,
        Max_Gaji as max_gaji
       FROM Jabatan
       WHERE ID_Jabatan = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Position not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error fetching position:", error);
    return NextResponse.json(
      { message: "Failed to fetch position" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const {
      nama_jabatan,
      id_departemen,
      deskripsi_jabatan,
      min_gaji,
      max_gaji,
    } = await req.json();

    const [result] = await pool.query(
      `UPDATE Jabatan 
       SET Nama_Jabatan = ?, ID_Departemen = ?, Deskripsi_Jabatan = ?, Min_Gaji = ?, Max_Gaji = ?
       WHERE ID_Jabatan = ?`,
      [nama_jabatan, id_departemen, deskripsi_jabatan, min_gaji, max_gaji, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Position not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Position updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating position:", error);
    return NextResponse.json(
      { message: "Failed to update position" },
      { status: 500 }
    );
  }
}
