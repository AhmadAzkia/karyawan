import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(request) {
  const cookieStore = await cookies(); // Gunakan await untuk memanggil cookies secara asinkron
  const token = cookieStore.get("authToken")?.value; // Ambil token dari cookies

  if (!token) {
    return NextResponse.json({ isAuthenticated: false });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET); // Verifikasi token
    return NextResponse.json({
      isAuthenticated: true,
      role: decoded.role,
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ isAuthenticated: false });
  }
}
