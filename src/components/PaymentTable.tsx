"use client";

import { useState, useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ITEMS_PER_PAGE = 10;

export default function PaymentTable({ payments: rawPayments }: { payments: any[] }) {
  const payments = useMemo(() => rawPayments.map((p: any) => ({
    ...p,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toLocaleDateString("id-ID") : p.createdAt,
  })), [rawPayments]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [bulanFilter, setBulanFilter] = useState("");
  const [tahunFilter, setTahunFilter] = useState("");

  const months = useMemo(() => {
    const set = new Set(payments.map((p: any) => p.month));
    return Array.from(set).sort();
  }, [payments]);

  const years = useMemo(() => {
    const set = new Set(payments.map((p: any) => p.month.split(" ")[1]));
    return Array.from(set).sort();
  }, [payments]);

  const filtered = useMemo(() => {
    let data = payments;
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((p: any) =>
        p.tenant.name.toLowerCase().includes(q) ||
        p.tenant.room.number.toLowerCase().includes(q) ||
        p.month.toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q)
      );
    }
    if (bulanFilter) {
      data = data.filter((p: any) => p.month.startsWith(bulanFilter));
    }
    if (tahunFilter) {
      data = data.filter((p: any) => p.month.endsWith(tahunFilter));
    }
    return data;
  }, [search, payments, bulanFilter, tahunFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const recap = useMemo(() => {
    const total = filtered.length;
    const lunas = filtered.filter((p: any) => p.status === "Lunas").length;
    const belum = filtered.filter((p: any) => p.status === "Belum Lunas").length;
    const totalAmount = filtered.reduce((sum: number, p: any) => sum + p.amount, 0);
    const lunasAmount = filtered.filter((p: any) => p.status === "Lunas").reduce((sum: number, p: any) => sum + p.amount, 0);
    const belumAmount = filtered.filter((p: any) => p.status === "Belum Lunas").reduce((sum: number, p: any) => sum + p.amount, 0);
    return { total, lunas, belum, totalAmount, lunasAmount, belumAmount };
  }, [filtered]);

  function cetakPDF() {
    const doc = new jsPDF();
    const title = bulanFilter
      ? `Laporan Pembayaran ${bulanFilter} ${tahunFilter}`
      : tahunFilter
      ? `Laporan Pembayaran Tahun ${tahunFilter}`
      : "Laporan Semua Pembayaran";

    doc.setFontSize(16);
    doc.text(title, 14, 20);
    doc.setFontSize(10);
    doc.text(`Dicetak: ${new Date().toLocaleDateString("id-ID")}`, 14, 28);

    const tableData = filtered.map((p: any) => [
      p.tenant.name,
      p.tenant.room.number,
      p.month,
      `Rp ${p.amount.toLocaleString()}`,
      p.status,
    ]);

    autoTable(doc, {
      startY: 34,
      head: [["Penyewa", "Kamar", "Bulan", "Jumlah", "Status"]],
      body: tableData,
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(14);
    doc.text("Rekap Total", 14, finalY);
    doc.setFontSize(10);
    const lines = [
      `Total Transaksi: ${recap.total}`,
      `Lunas: ${recap.lunas}`,
      `Belum Lunas: ${recap.belum}`,
      `Total Pendapatan Lunas: Rp ${recap.lunasAmount.toLocaleString()}`,
      `Total Belum Dibayar: Rp ${recap.belumAmount.toLocaleString()}`,
      `Total Keseluruhan: Rp ${recap.totalAmount.toLocaleString()}`,
    ];
    doc.text(lines, 14, finalY + 8);

    doc.save("laporan-pembayaran.pdf");
  }

  return (
    <div>
      <div className="flex gap-2 mb-4 items-end">
        <div>
          <label className="block text-sm mb-1">Bulan</label>
          <select
            value={bulanFilter}
            onChange={(e) => { setBulanFilter(e.target.value); setPage(1); }}
            className="border p-2 rounded"
          >
            <option value="">Semua Bulan</option>
            {months.map((m, i) => (
              <option key={`m-${i}`} value={m.split(" ")[0]}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Tahun</label>
          <select
            value={tahunFilter}
            onChange={(e) => { setTahunFilter(e.target.value); setPage(1); }}
            className="border p-2 rounded"
          >
            <option value="">Semua Tahun</option>
            {years.map((y, i) => (
              <option key={`y-${i}`} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <button
          onClick={cetakPDF}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Cetak PDF
        </button>
      </div>

      <input
        type="text"
        placeholder="Cari penyewa, kamar, bulan..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="w-full border p-2 rounded mb-4"
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Penyewa</th>
              <th className="p-2 text-left">Kamar</th>
              <th className="p-2 text-left">Bulan</th>
              <th className="p-2 text-left">Jumlah</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              paged.map((p: any) => (
                <tr key={p.id} className="border-t">
                  <td className="p-2">{p.tenant.name}</td>
                  <td className="p-2">{p.tenant.room.number}</td>
                  <td className="p-2">{p.month}</td>
                  <td className="p-2">Rp {p.amount.toLocaleString()}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-sm ${p.status === "Lunas" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-2">{p.createdAt}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-100"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`px-3 py-1 rounded border ${n === page ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded shadow">
        <p className="font-semibold">Rekap Total</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-sm">
          <span>Transaksi: {recap.total}</span>
          <span>Lunas: {recap.lunas}</span>
          <span>Belum: {recap.belum}</span>
          <span>Pendapatan: Rp {recap.lunasAmount.toLocaleString()}</span>
          <span>Piutang: Rp {recap.belumAmount.toLocaleString()}</span>
          <span>Total: Rp {recap.totalAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}