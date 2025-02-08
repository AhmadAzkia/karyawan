import React from "react"; // Import React
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Employee Management System",
  description: "Modern employee management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
