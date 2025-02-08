import { use } from "react";

async function getPositions() {
  const res = await fetch("http://localhost:3000/api/positions");
  if (!res.ok) {
    throw new Error("Failed to fetch positions");
  }
  return res.json();
}

export default function Positions() {
  const positions = use(getPositions());

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Positions</h1>
      {Array.isArray(positions) ? (
        <table className="min-w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Min Salary</th>
              <th>Max Salary</th>
              <th>Department ID</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos) => (
              <tr key={pos.ID_Jabatan}>
                <td>{pos.ID_Jabatan}</td>
                <td>{pos.Nama_Jabatan}</td>
                <td>{pos.Min_Gaji}</td>
                <td>{pos.Max_Gaji}</td>
                <td>{pos.ID_Departemen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No positions found or error occurred.</p>
      )}
    </div>
  );
}
