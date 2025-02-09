"use client";

import { usePathname } from "next/navigation";
import { Bars3Icon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/employees", label: "Karyawan" },
  { href: "/positions", label: "Jabatan" },
  { href: "/departments", label: "Departemen" },
  { href: "/salaries", label: "Gaji" },
  { href: "/attendance", label: "Kehadiran" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex transition-all duration-300">
      {/* Sidebar */}
      <aside
        className={`h-full bg-white border-r border-gray-100 shadow-sm transition-all duration-300 z-40 ${
          isOpen ? "w-72" : "w-0"
        }`}
      >
        <div className={`p-6 flex justify-between items-center ${isOpen ? "block" : "hidden"}`}>
          <h1 className="text-xl font-semibold text-gray-900">Manajemen Karyawan</h1>
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800">
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>
        <nav className={`px-3 py-2 ${isOpen ? "block" : "hidden"}`}>
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
        </nav>
      </aside>

      {/* Tombol untuk membuka sidebar saat tertutup */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed top-4 left-2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 z-50 ${isOpen ? "hidden" : "block"}`}
      >
        <Bars3Icon className="w-6 h-6 text-gray-700" />
      </button>

      {/* Konten utama bergeser saat sidebar dibuka */}
      <main className={`flex-1 transition-all duration-300 p-8 ${isOpen ? "ml-50" : "ml-0"}`}>
        {/* Tempat untuk konten utama */}
      </main>
    </div>
  );
}
