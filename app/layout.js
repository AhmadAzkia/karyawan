import "./globals.css"
import { Inter } from "next/font/google"
import Sidebar from "../components/Sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Employee Management System",
  description: "Manage your company's employees efficiently",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1">
            <header className="bg-[#1a1f2e] p-6">
              <h1 className="text-2xl font-semibold text-white">Employee Management System</h1>
            </header>
            <main className="p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}