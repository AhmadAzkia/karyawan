import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

async function getNextDepartmentId() {
  const [rows] = await pool.query(
    "SELECT ID_Departemen FROM Departemen ORDER BY ID_Departemen DESC LIMIT 1"
  );

  if (rows.length === 0) {
    return "D001";
  }

  const lastId = rows[0].ID_Departemen;
  const numericPart = Number.parseInt(lastId.substring(1));
  const nextNumericPart = numericPart + 1;
  return `D${nextNumericPart.toString().padStart(3, "0")}`;
}

export async function POST(req) {
  try {
    const { name, description } = await req.json();
    const newDepartmentId = await getNextDepartmentId();

    const [result] = await pool.query(
      `INSERT INTO Departemen (ID_Departemen, Nama_Departemen, Deskripsi_Departemen)
       VALUES (?, ?, ?)`,
      [newDepartmentId, name, description]
    );

    return NextResponse.json(
      {
        message: "Department added successfully",
        departmentId: newDepartmentId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding department:", error);
    return NextResponse.json(
      { message: "Failed to add department" },
      { status: 500 }
    );
  }
}
