import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";
import pool from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, password } = body;

    console.log("Login request received:", { id, password });

    // Admin login
    if (id === "admin" && password === "admin123") {
      console.log("Admin login successful");
      const token = sign(
        { id: "admin", name: "Administrator", role: "admin" },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      const cookieStore = await cookies();
      cookieStore.set("authToken", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 86400,
      });

      return NextResponse.json(
        {
          success: true,
          role: "admin",
          name: "Administrator",
          authToken: token,
          userId: "admin", // Added userId for consistency
        },
        {
          headers: {
            "Cache-Control": "private, max-age=3600",
          },
        }
      );
    }

    // Employee login
    const [rows] = await pool.query(
      "SELECT ID_Karyawan, Nama_Karyawan, Tempat_Tanggal_Lahir FROM Karyawan WHERE ID_Karyawan = ?",
      [id]
    );

    console.log("Query result:", rows);

    if (rows.length === 0) {
      console.log("User not found");
      return NextResponse.json({
        success: false,
        message: "ID Karyawan tidak ditemukan",
      });
    }

    const user = rows[0];
    const birthDate = user.Tempat_Tanggal_Lahir.split(", ")[1];

    console.log("Comparing passwords:", { input: password, birthDate });

    if (password !== birthDate) {
      console.log("Password mismatch");
      return NextResponse.json({
        success: false,
        message: "Password salah",
      });
    }

    console.log("Employee login successful");
    const token = sign(
      {
        id: user.ID_Karyawan,
        name: user.Nama_Karyawan,
        role: "karyawan",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const cookieStore = await cookies();
    cookieStore.set("authToken", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 86400,
    });

    return NextResponse.json(
      {
        success: true,
        role: "karyawan",
        name: user.Nama_Karyawan,
        authToken: token,
        userId: user.ID_Karyawan, // Added userId to response
      },
      {
        headers: {
          "Cache-Control": "private, max-age=3600",
        },
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}
