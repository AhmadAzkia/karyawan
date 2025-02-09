import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function middleware(request) {
  const cookieStore = await cookies(); // Gunakan await untuk cookies
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    const { role } = decoded;

    // Akses halaman berdasarkan role
    if (request.nextUrl.pathname === "/attendance") {
      return NextResponse.next();
    }

    // Hanya admin yang dapat mengakses dashboard
    if (request.nextUrl.pathname === "/" && role !== "admin") {
      return NextResponse.redirect(new URL("/attendance", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/", "/attendance"],
};
