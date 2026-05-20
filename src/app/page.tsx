export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const totalKamar = await prisma.room.count();
  const kamarTerisi = await prisma.room.count({ where: { status: "Terisi" } });
  const totalPenyewa = await prisma.tenant.count();
  const pembayaranBelum = await prisma.payment.count({ where: { status: "Belum Lunas" } });

  const totalPendapatan = await prisma.payment.aggregate({
    where: { status: "Lunas" },
    _sum: { amount: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow">
          <p className="text-sm">Total Kamar</p>
          <p className="text-3xl font-bold">{totalKamar}</p>
        </div>

        <div className="bg-green-100 p-4 rounded shadow">
          <p className="text-sm">Kamar Terisi</p>
          <p className="text-3xl font-bold">{kamarTerisi}</p>
        </div>

        <div className="bg-yellow-100 p-4 rounded shadow">
          <p className="text-sm">Penyewa Aktif</p>
          <p className="text-3xl font-bold">{totalPenyewa}</p>
        </div>

        <div className="bg-red-100 p-4 rounded shadow">
          <p className="text-sm">Belum Lunas</p>
          <p className="text-3xl font-bold">{pembayaranBelum}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <p className="text-lg font-semibold">
          Total Pendapatan (Lunas): Rp {totalPendapatan._sum.amount?.toLocaleString() ?? 0}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/kamar" className="bg-blue-600 text-white p-4 rounded text-center hover:bg-blue-700">
          Kelola Kamar
        </Link>

        <Link href="/penyewa" className="bg-green-600 text-white p-4 rounded text-center hover:bg-green-700">
          Kelola Penyewa
        </Link>

        <Link href="/pembayaran" className="bg-yellow-600 text-white p-4 rounded text-center hover:bg-yellow-700">
          Catat Pembayaran
        </Link>

        <Link href="/laporan" className="bg-purple-600 text-white p-4 rounded text-center hover:bg-purple-700">
          Lihat Laporan
        </Link>
      </div>
    </div>
  );
}