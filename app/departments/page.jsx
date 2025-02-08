import { use } from "react"

async function getDepartments() {
  const res = await fetch("http://localhost:3000/api/departments")
  if (!res.ok) {
    throw new Error("Failed to fetch departments")
  }
  return res.json()
}

export default function Departments() {
  const departments = use(getDepartments())

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Departments</h1>
      {Array.isArray(departments) ? (
        <ul>
          {departments.map((dept) => (
            <li key={dept.id} className="mb-2">
              <strong>{dept.name}</strong>: {dept.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No departments found or error occurred.</p>
      )}
    </div>
  )
}