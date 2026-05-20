"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname === "/login") return null;

  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/kamar", label: "Kamar" },
    { href: "/penyewa", label: "Penyewa" },
    { href: "/pembayaran", label: "Pembayaran" },
    { href: "/laporan", label: "Laporan" },
  ];

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Sistem Kos</Link>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <div className={`${menuOpen ? "block" : "hidden"} md:flex gap-4 items-center`}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:underline">
              {l.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}