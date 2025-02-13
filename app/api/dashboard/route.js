import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    // Get active employees count
    const [karyawanAktif] = await pool.query(
      "SELECT COUNT(*) as count FROM Karyawan WHERE Status_Karyawan = 'aktif'"
    );

    // Get count of employees per department
    const [departmentCounts] = await pool.query(`
      SELECT 
        d.Nama_Departemen,
        COUNT(k.ID_Karyawan) as jumlah_karyawan
      FROM 
        Departemen d
        LEFT JOIN Karyawan k ON d.ID_Departemen = k.ID_Departemen 
        AND k.Status_Karyawan = 'aktif'
      GROUP BY 
        d.ID_Departemen, d.Nama_Departemen
    `);

    // Get salary data for chart
    const [salaryData] = await pool.query(`
      SELECT 
        j.Nama_Jabatan,
        j.Gaji_Pokok
      FROM 
        Jabatan j
      ORDER BY 
        j.Gaji_Pokok DESC
      LIMIT 5
    `);

    // Get total positions count
    const [jumlahJabatan] = await pool.query(
      "SELECT COUNT(*) as count FROM Jabatan"
    );

    // Process department counts into a more usable format
    const departmentData = {};
    departmentCounts.forEach((dept) => {
      departmentData[dept.Nama_Departemen.toLowerCase()] = dept.jumlah_karyawan;
    });

    const dashboardData = {
      jumlah_karyawan_aktif: karyawanAktif[0].count,
      departemen_it: departmentData["it"] || 0,
      departemen_hr: departmentData["hr"] || 0,
      departemen_finance: departmentData["finance"] || 0,
      departemen_marketing: departmentData["marketing"] || 0,
      departemen_sales: departmentData["sales"] || 0,
      jumlah_jabatan: jumlahJabatan[0].count,
      chart_data: {
        salaries: salaryData,
      },
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
