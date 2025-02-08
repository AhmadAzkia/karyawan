import { use } from "react";

async function getSalaries() {
  const res = await fetch("http://localhost:3000/api/salaries");
  if (!res.ok) {
    throw new Error("Failed to fetch salaries");
  }
  return res.json();
}

export default function Salaries() {
  const salaries = use(getSalaries());

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Salaries</h1>
      {Array.isArray(salaries) ? (
        <table className="min-w-full">
          <thead>
            <tr>
              <th>ID Gaji</th>
              <th>ID Karyawan</th>
              <th>Gaji Pokok</th>
              <th>Tunjangan</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((salary) => (
              <tr key={salary.ID_Gaji}>
                <td>{salary.ID_Gaji}</td>
                <td>{salary.ID_Karyawan}</td>
                <td>{salary.Gaji_Pokok}</td>
                <td>{salary.Tunjangan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No salaries found or error occurred.</p>
      )}
    </div>
  );
}
