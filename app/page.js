"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Home() {
  const [data, setData] = useState(null);
  const [userName, setUserName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
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
        console.log("Fetched Data:", data);
        setData(data);
      })
      .catch((error) => console.error("Fetch error:", error));
  };

  if (!data) {
    return <p>Loading...</p>;
  }

  const dashboardCards = [
    {
      title: "Departemen IT",
      description: "Jumlah Karyawan dalam departemen IT",
      count: `${data.departemen_it} Orang`,
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
    },
    {
      title: "Departemen HR",
      description: "Jumlah Karyawan dalam departemen HR",
      count: `${data.departemen_hr} Orang`,
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
    },
    {
      title: "Departemen Finance",
      description: "Jumlah Karyawan dalam departemen Finance",
      count: `${data.departemen_finance} Orang`,
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
    },
    {
      title: "Departemen Marketing",
      description: "Jumlah Karyawan dalam departemen Marketing",
      count: `${data.departemen_marketing} Orang`,
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
    },
    {
      title: "Departemen Sales",
      description: "Jumlah Karyawan dalam departemen Sales",
      count: `${data.departemen_sales} Orang`,
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
    },
  ];

  const pieChartData = {
    labels: ["IT", "HR", "Finance", "Marketing", "Sales"],
    datasets: [
      {
        data: [data.departemen_it, data.departemen_hr, data.departemen_finance, data.departemen_marketing, data.departemen_sales],
        backgroundColor: ["rgba(54, 162, 235, 0.8)", "rgba(255, 206, 86, 0.8)", "rgba(75, 192, 192, 0.8)", "rgba(153, 102, 255, 0.8)", "rgba(255, 159, 64, 0.8)"],
      },
    ],
  };

  const barChartData = {
    labels: data.chart_data?.salaries?.map((s) => s.Nama_Jabatan) || [],
    datasets: [
      {
        label: "Gaji Pokok",
        data: data.chart_data?.salaries?.map((s) => s.Gaji_Pokok) || [],
        backgroundColor: "rgba(54, 162, 235, 0.8)",
      },
    ],
  };

  return (
    <div className="max-w-[1400px] mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome back, {userName}</h1>
        <p className="text-gray-600 mt-1">Berikut ringkasan aktivitas di perusahaan Anda</p>
      </header>

      <div className="flex flex-col">
        <div className="shadow rounded-lg bg-white  mt-8 p-6">
          <h3 className="text-xl font-semibold mb-4">Distribusi Karyawan</h3>
          <div className="h-[300px]">
            <Pie
              data={pieChartData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </div>

          <div className="shadow rounded-lg bg-white  mt-8 p-6">
            <h3 className="text-xl font-semibold mb-4">Distribusi Karyawan</h3>
            <div className="h-[300px]">
              <Bar
                data={barChartData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) =>
                          new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(value),
                      },
                    },
                  },
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardCards.map((card, i) => (
                <div key={i} className={`relative overflow-hidden rounded-xl p-6 transition-all hover:shadow-lg ${card.onClick ? "cursor-pointer" : ""}`} onClick={card.onClick}>
                  <div className={`absolute inset-0 opacity-90 ${card.color}`} />
                  <div className="relative">
                    <h3 className="text-lg font-medium text-white mb-1">{card.title}</h3>
                    <p className="text-white/80 text-sm mb-4">{card.description}</p>
                    <div className="inline-flex items-center rounded-full bg-white/20 px-3 py-1">
                      <span className="text-sm text-white">{card.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{modalContent === "chart" ? "Distribusi Karyawan" : "Perbandingan Gaji"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
