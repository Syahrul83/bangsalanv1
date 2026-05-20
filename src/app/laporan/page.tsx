import { prisma } from "@/lib/prisma";
import PaymentTable from "@/components/PaymentTable";

export default async function LaporanPage() {
  const allRooms = await prisma.room.findMany({
    include: { tenant: true },
    orderBy: { number: "asc" },
  });

  const totalKamar = allRooms.length;
  const kamarTerisi = allRooms.filter((r) => r.status === "Terisi").length;
  const kamarKosong = allRooms.filter((r) => r.status === "Kosong");

  const payments = await prisma.payment.findMany({
    include: { tenant: { include: { room: true } } },
    orderBy: { createdAt: "desc" },
  });

  const totalPendapatan = payments
    .filter((p) => p.status === "Lunas")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPembayaran = payments.length;
  const pembayaranLunas = payments.filter((p) => p.status === "Lunas").length;
  const pembayaranBelum = payments.filter((p) => p.status === "Belum Lunas").length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Laporan</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow">
          <p className="text-sm">Total Kamar</p>
          <p className="text-3xl font-bold">{totalKamar}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <p className="text-sm">Kamar Terisi</p>
          <p className="text-3xl font-bold">{kamarTerisi}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <p className="text-sm">Kamar Kosong</p>
          <p className="text-3xl font-bold">{kamarKosong.length}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <p className="text-sm">Total Pembayaran</p>
          <p className="text-3xl font-bold">{totalPembayaran}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <p className="text-sm">Lunas</p>
          <p className="text-3xl font-bold">{pembayaranLunas}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <p className="text-sm">Belum Lunas</p>
          <p className="text-3xl font-bold">{pembayaranBelum}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <p className="text-lg font-semibold">Total Pendapatan (Lunas): Rp {totalPendapatan.toLocaleString()}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Kamar Kosong</h2>
        {kamarKosong.length === 0 ? (
          <p className="text-gray-500">Semua kamar terisi</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {kamarKosong.map((r) => (
              <span key={r.id} className="bg-gray-200 px-3 py-1 rounded text-sm">
                {r.number} - Rp {r.price.toLocaleString()}
              </span>
            ))}
          </div>
        )}
      </div>

<div>
        <h2 className="text-xl font-bold mb-2">Riwayat Pembayaran</h2>
        <PaymentTable payments={payments} />
      </div>
    </div>
  );
}