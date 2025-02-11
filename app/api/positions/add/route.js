import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

async function getNextPositionId() {
  const [rows] = await pool.query(
    "SELECT ID_Jabatan FROM Jabatan ORDER BY ID_Jabatan DESC LIMIT 1"
  );

  if (rows.length === 0) {
    return "J001";
  }

  const lastId = rows[0].ID_Jabatan;
  const numericPart = Number.parseInt(lastId.substring(1));
  const nextNumericPart = numericPart + 1;
  return `J${nextNumericPart.toString().padStart(3, "0")}`;
}

export async function POST(req) {
  try {
    const {
      nama_jabatan,
      id_departemen,
      deskripsi_jabatan,
      min_gaji,
      max_gaji,
    } = await req.json();
    const newPositionId = await getNextPositionId();

    const [result] = await pool.query(
      `INSERT INTO Jabatan (ID_Jabatan, Nama_Jabatan, ID_Departemen, Deskripsi_Jabatan, Min_Gaji, Max_Gaji)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        newPositionId,
        nama_jabatan,
        id_departemen,
        deskripsi_jabatan,
        min_gaji,
        max_gaji,
      ]
    );

    return NextResponse.json(
      {
        message: "Position added successfully",
        positionId: newPositionId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding position:", error);
    return NextResponse.json(
      { message: "Failed to add position" },
      { status: 500 }
    );
  }
}
