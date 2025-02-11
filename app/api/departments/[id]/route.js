import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

// Get single department
export async function GET(req, { params }) {
  try {
    const { id } = params;

    const [rows] = await pool.query(
      `SELECT 
        ID_Departemen as id,
        Nama_Departemen as name,
        Deskripsi_Departemen as description
       FROM Departemen
       WHERE ID_Departemen = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Department not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error fetching department:", error);
    return NextResponse.json(
      { message: "Failed to fetch department" },
      { status: 500 }
    );
  }
}

// Update department
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { name, description } = await req.json();

    const [result] = await pool.query(
      `UPDATE Departemen 
       SET Nama_Departemen = ?, Deskripsi_Departemen = ?
       WHERE ID_Departemen = ?`,
      [name, description, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Department not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Department updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating department:", error);
    return NextResponse.json(
      { message: "Failed to update department" },
      { status: 500 }
    );
  }
}

// Delete department
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    // First check if there are any employees in this department
    const [employees] = await pool.query(
      "SELECT COUNT(*) as count FROM Karyawan WHERE ID_Departemen = ?",
      [id]
    );

    if (employees[0].count > 0) {
      return NextResponse.json(
        { message: "Cannot delete department with existing employees" },
        { status: 400 }
      );
    }

    // Also check if there are any positions in this department
    const [positions] = await pool.query(
      "SELECT COUNT(*) as count FROM Jabatan WHERE ID_Departemen = ?",
      [id]
    );

    if (positions[0].count > 0) {
      return NextResponse.json(
        { message: "Cannot delete department with existing positions" },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      "DELETE FROM Departemen WHERE ID_Departemen = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Department not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Department deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting department:", error);
    return NextResponse.json(
      { message: "Failed to delete department" },
      { status: 500 }
    );
  }
}
