import React from "react"; // Import React
import "./globals.css";

export const metadata = {
  title: "Employee Management System",
  description: "Modern employee management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="flex min-h-screen">
          <aside className="w-72 bg-white border-r border-gray-100 shadow-sm">
            <div className="p-6">
              <h1 className="text-xl font-semibold text-gray-900">EMS</h1>
            </div>
            <nav className="px-3 py-2">
              {[
                { href: "/", label: "Dashboard", active: true },
                { href: "/departments", label: "Departments" },
                { href: "/employees", label: "Employees" },
                { href: "/positions", label: "Positions" },
                { href: "/salaries", label: "Salaries" },
                { href: "/attendance", label: "Attendance" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 mb-1 text-sm rounded-lg transition-colors ${
                    item.active
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
