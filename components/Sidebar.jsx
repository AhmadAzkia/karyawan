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
    <aside className="w-64 min-h-screen bg-[#1a1f2e] text-gray-300">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-md transition-colors ${
                isActive ? "bg-blue-500 text-white" : "hover:bg-[#2a2f3e] hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-4 left-4">
        <div className="p-2 rounded-md bg-[#2a2f3e]">
          <BoltIcon className="w-6 h-6 text-gray-400" />
        </div>
      </div>
    </aside>
  )
}