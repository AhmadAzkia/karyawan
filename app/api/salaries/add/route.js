import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

async function getNextSalaryId() {
  const [rows] = await pool.query(
    "SELECT ID_Gaji FROM Gaji ORDER BY ID_Gaji DESC LIMIT 1"
  );

  if (rows.length === 0) {
    return "G001";
  }

  const lastId = rows[0].ID_Gaji;
  const numericPart = Number.parseInt(lastId.substring(1));
  const nextNumericPart = numericPart + 1;
  return `G${nextNumericPart.toString().padStart(3, "0")}`;
}

export async function POST(req) {
  try {
    const { id_karyawan, gaji_pokok, tunjangan } = await req.json();
    const newSalaryId = await getNextSalaryId();

    const [result] = await pool.query(
      `INSERT INTO Gaji (ID_Gaji, ID_Karyawan, Gaji_Pokok, Tunjangan)
       VALUES (?, ?, ?, ?)`,
      [newSalaryId, id_karyawan, gaji_pokok, tunjangan]
    );

    return NextResponse.json(
      {
        message: "Salary record added successfully",
        salaryId: newSalaryId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding salary:", error);
    return NextResponse.json(
      { message: "Failed to add salary record" },
      { status: 500 }
    );
  }
}
