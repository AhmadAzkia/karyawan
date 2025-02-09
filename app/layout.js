"use client";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  // Get user role from localStorage if available
  const userRole =
    typeof window !== "undefined" ? localStorage.getItem("userRole") : null;

  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="flex min-h-screen">
          {!isLoginPage && userRole && <Sidebar userRole={userRole} />}
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
