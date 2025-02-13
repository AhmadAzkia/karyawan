"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [data, setData] = useState(null);
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("userRole");
    const authToken = localStorage.getItem("authToken");

    if (!authToken || !storedName || userRole !== "admin") {
      router.replace("/login");
      return;
    }

    setUserName(storedName);
    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = () => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Data:", data); // Debugging
        setData(data);
      })
      .catch((error) => console.error("Fetch error:", error));
  };

  if (!data) {
    return <p>Loading...</p>;
  }

  const dashboardCards = [
    {
      title: "Karyawan Aktif",
      description: "Jumlah karyawan yang masih bekerja",
      count: `${data.jumlah_karyawan_aktif} Orang`,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      title: "Departemen IT",
      description: "Jumlah Karyawan dalam departemen IT",
      count: `${data.jumlah_departemen} Departemen`,
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
    },
    {
      title: "Departemen HR",
      description: "Jumlah Karyawan dalam departemen HR",
      count: `${data.jumlah_departemen} Departemen`,
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
    },
    {
      title: "Departemen Finance",
      description: "Jumlah Karyawan dalam departemen Finance",
      count: `${data.jumlah_departemen} Departemen`,
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
    },
    {
      title: "Departemen Marketing",
      description: "Jumlah Karyawan dalam departemen Marketing",
      count: `${data.jumlah_departemen} Departemen`,
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
    },
    {
      title: "Departemen Sales",
      description: "Jumlah Karyawan dalam departemen Sales",
      count: `${data.jumlah_departemen} Departemen`,
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
    },
    {
      title: "Jabatan",
      description: "Total jabatan aktif",
      count: `${data.jumlah_jabatan} Jabatan`,
      color: "bg-gradient-to-br from-rose-500 to-rose-600",
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {userName}
        </h1>
        <p className="text-gray-600 mt-1">
          Berikut ringkasan aktivitas di perusahaan Anda
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-xl p-6 transition-all hover:shadow-lg"
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
          </div>
        ))}
      </div>
    </div>
  );
}
