"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bars3Icon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useState, useEffect } from "react";

const getNavItems = (role) => {
  const adminItems = [
    { href: "/", label: "Dashboard" },
    { href: "/employees", label: "Karyawan" },
    { href: "/positions", label: "Jabatan" },
    { href: "/departments", label: "Departemen" },
    { href: "/salaries", label: "Gaji" },
    { href: "/attendance", label: "Kehadiran" },
  ];

  const employeeItems = [{ href: "/attendance", label: "Kehadiran" }];

  return role === "admin" ? adminItems : employeeItems;
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [navItems, setNavItems] = useState([]);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedUserRole = localStorage.getItem("userRole") || "employee";
    setUserRole(storedUserRole);
    setNavItems(getNavItems(storedUserRole));
    setUserName(localStorage.getItem("userName") || "");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("authToken");

    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    router.replace("/login");
  };

  if (!userRole) return null; // Mencegah sidebar dirender sebelum userRole ter-set

  return (
    <div className="flex transition-all duration-300">
      <aside
        className={`h-screen bg-white border-r border-gray-100 shadow-sm transition-all duration-300 z-40 ${
          isOpen ? "w-72" : "w-0"
        }`}
      >
        <div
          className={`p-6 flex flex-col gap-4 ${isOpen ? "block" : "hidden"}`}
        >
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Manajemen Karyawan
            </h1>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-800"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
          <div className="text-sm text-gray-600">Welcome, {userName}</div>
        </div>

        <nav
          className={`px-3 py-2 flex flex-col h-[calc(100vh-200px)] justify-between ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 mb-1 text-sm rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-3 mb-1 text-sm rounded-lg transition-colors text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </nav>
      </aside>

      <button
        onClick={() => setIsOpen(true)}
        className={`fixed top-4 left-2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 z-50 ${
          isOpen ? "hidden" : "block"
        }`}
      >
        <Bars3Icon className="w-6 h-6 text-gray-700" />
      </button>
    </div>
  );
}
