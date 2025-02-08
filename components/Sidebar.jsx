"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BoltIcon } from "@heroicons/react/24/solid"

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/employees", label: "Karyawan" },
  { href: "/departments", label: "Departemen" },
  { href: "/positions", label: "Jabatan" },
  { href: "/salaries", label: "Gaji" },
  { href: "/attendance", label: "Kehadiran" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-72 bg-white border-r border-gray-100 shadow-sm">
    <div className="p-6">
      <h1 className="text-xl font-semibold text-gray-900">Manajemen Karyawan</h1>
    </div>
    <nav className="px-3 py-2">
      {[
        { href: "/", label: "Dashboard", active: true },
        { href: "/employees", label: "Karyawan" },
        { href: "/positions", label: "Jabatan" },
        { href: "/departments", label: "Departemen" },
        { href: "/salaries", label: "Gaji" },
        { href: "/attendance", label: "Kehadiran" },
      ].map((item) => (
        <a key={item.href} href={item.href} className={`flex items-center px-4 py-3 mb-1 text-sm rounded-lg transition-colors ${item.active ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}>
          {item.label}
        </a>
      ))}
    </nav>
  </aside>
  )
}