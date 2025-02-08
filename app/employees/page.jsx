import { use } from "react"

async function getEmployees() {
  const res = await fetch("http://localhost:3000/api/employees")
  if (!res.ok) {
    throw new Error("Failed to fetch employees")
  }
  return res.json()
}

export default function Employees() {
  const employees = use(getEmployees())

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Employees</h1>
      {Array.isArray(employees) ? (
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">ID</th>
              <th className="text-left">Name</th>
              <th className="text-left">Department</th>
              <th className="text-left">Position</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.department}</td>
                <td>{employee.position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No employees found or error occurred.</p>
      )}
    </div>
  )
}