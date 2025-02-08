import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM jabatan");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.error();
  }
}
