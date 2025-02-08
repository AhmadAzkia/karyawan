import Link from "next/link"

const cards = [
  { href: "/departments", label: "Departments", color: "bg-[#4287f5]" },
  { href: "/employees", label: "Employees", color: "bg-[#2ecc71]" },
  { href: "/positions", label: "Positions", color: "bg-[#f1c40f]" },
  { href: "/salaries", label: "Salaries", color: "bg-[#e74c3c]" },
  { href: "/attendance", label: "Attendance", color: "bg-[#9b59b6]" },
]

export default function Home() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className={`${card.color} rounded-xl p-6 text-white text-xl font-semibold hover:opacity-90 transition-opacity`}
        >
          {card.label}
        </Link>
      ))}
    </div>
  )
}