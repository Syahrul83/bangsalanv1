"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ITEMS_PER_PAGE = 10;

export default function PaymentListTable({ payments: rawPayments }: { payments: any[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const payments = useMemo(() => rawPayments, [rawPayments]);

  const filtered = useMemo(() => {
    if (!search.trim()) return payments;
    const q = search.toLowerCase();
    return payments.filter(
      (p: any) =>
        p.tenant.name.toLowerCase().includes(q) ||
        p.tenant.room.number.toLowerCase().includes(q) ||
        p.month.toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q)
    );
  }, [search, payments]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  async function handleLunaskan(id: number) {
    const res = await fetch(`/api/pembayaran/${id}`, { method: "PUT" });
    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Daftar Pembayaran</h1>
        <Link href="/pembayaran/tambah" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Tambah Pembayaran
        </Link>
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
              <th className="p-2 text-left">Aksi</th>
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
                  <td className="p-2">
                    {p.status === "Belum Lunas" && (
                      <button
                        onClick={() => handleLunaskan(p.id)}
                        className="text-green-600 hover:underline"
                      >
                        Lunaskan
                      </button>
                    )}
                  </td>
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
      <p className="text-sm text-gray-500 mt-2">
        Menampilkan {filtered.length} data
      </p>
    </div>
  );
}