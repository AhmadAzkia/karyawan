import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

// Function to get the next employee ID
async function getNextEmployeeId() {
  const [rows] = await pool.query(
    "SELECT ID_Karyawan FROM Karyawan ORDER BY ID_Karyawan DESC LIMIT 1"
  );

  if (rows.length === 0) {
    return "K001"; // Initial ID if no employees exist
  }

  // Get the last ID and increment it
  const lastId = rows[0].ID_Karyawan;
  const numericPart = Number.parseInt(lastId.substring(1));
  const nextNumericPart = numericPart + 1;
  return `K${nextNumericPart.toString().padStart(3, "0")}`;
}

export async function POST(req) {
  try {
    const {
      nama,
      departemen,
      jabatan,
      tanggal_bergabung,
      status,
      jenis_kelamin,
      tempat_tanggal_lahir,
      nomor_hp,
    } = await req.json();

    // Get the next available ID
    const newEmployeeId = await getNextEmployeeId();

    const [result] = await pool.query(
      `INSERT INTO Karyawan 
       (ID_Karyawan, Nama_Karyawan, ID_Departemen, ID_Jabatan, Tanggal_Bergabung, 
        Status_Karyawan, Jenis_Kelamin, Tempat_Tanggal_Lahir, Nomor_HP) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newEmployeeId,
        nama,
        departemen,
        jabatan,
        tanggal_bergabung,
        status,
        jenis_kelamin,
        tempat_tanggal_lahir,
        nomor_hp,
      ]
    );

    return NextResponse.json(
      {
        message: "Karyawan berhasil ditambahkan",
        employeeId: newEmployeeId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error: " + error.message,
      },
      { status: 500 }
    );
  }
}
