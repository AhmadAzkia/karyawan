export default function Home() {
  return (
    <div className="max-w-[1400px] mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, Admin
        </h1>
        <p className="text-gray-600 mt-1">
          Here&apos;s what&apos;s happening in your organization
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Departments",
            description: "Manage company departments",
            count: "8 Active",
            color: "bg-gradient-to-br from-blue-500 to-blue-600",
          },
          {
            title: "Employees",
            description: "View all employees",
            count: "145 Total",
            color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
          },
          {
            title: "Positions",
            description: "Job roles and titles",
            count: "24 Open",
            color: "bg-gradient-to-br from-amber-500 to-amber-600",
          },
          {
            title: "Salaries",
            description: "Payroll management",
            count: "Monthly",
            color: "bg-gradient-to-br from-rose-500 to-rose-600",
          },
          {
            title: "Attendance",
            description: "Track employee attendance",
            count: "98% Present",
            color: "bg-gradient-to-br from-violet-500 to-violet-600",
          },
          {
            title: "Quick Actions",
            description: "Common tasks",
            count: "5 Actions",
            color: "bg-gradient-to-br from-gray-600 to-gray-700",
          },
        ].map((card, i) => (
          <a
            key={i}
            href={`/${card.title.toLowerCase()}`}
            className="group relative overflow-hidden rounded-xl p-6 transition-all hover:shadow-lg"
          >
            <div
              className={`absolute inset-0 opacity-90 transition-opacity group-hover:opacity-100 ${card.color}`}
            />
            <div className="relative">
              <h3 className="text-lg font-medium text-white mb-1">
                {card.title}
              </h3>
              <p className="text-white/80 text-sm mb-4">{card.description}</p>
              <div className="inline-flex items-center rounded-full bg-white/20 px-3 py-1">
                <span className="text-sm text-white">{card.count}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
