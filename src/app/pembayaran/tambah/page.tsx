"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const months = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

type Tenant = {
  id: number;
  name: string;
  room: { number: string; price: number };
};

export default function TambahPembayaranPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    fetch("/api/penyewa")
      .then((res) => res.json())
      .then((data) => setTenants(data));
  }, []);

  function handleTenantChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = parseInt(e.target.value);
    const tenant = tenants.find((t) => t.id === id);
    setAmount(tenant ? tenant.room.price : 0);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const month = (form.elements.namedItem("month") as HTMLSelectElement).value;
    const year = (form.elements.namedItem("year") as HTMLSelectElement).value;
    const formData = new FormData(form);
    formData.set("month", `${month} ${year}`);
    formData.set("amount", amount.toString());
    const res = await fetch("/api/pembayaran", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      router.push("/pembayaran");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Gagal menambah pembayaran");
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Tambah Pembayaran</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mt-4">
        <div className="mb-4">
          <label className="block mb-1">Penyewa</label>
          <select name="tenantId" className="w-full border p-2 rounded" required onChange={handleTenantChange}>
            <option value="">Pilih Penyewa</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} - Kamar {t.room.number} (Rp {t.room.price.toLocaleString()})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Bulan</label>
          <select name="month" className="w-full border p-2 rounded" required>
            <option value="">Pilih Bulan</option>
            {months.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Tahun</label>
          <select name="year" className="w-full border p-2 rounded" required>
            <option value="">Pilih Tahun</option>
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        {amount > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded">
            <p className="text-sm text-gray-600">Jumlah Pembayaran (otomatis dari harga kamar):</p>
            <p className="text-xl font-bold text-blue-700">Rp {amount.toLocaleString()}</p>
          </div>
        )}
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Simpan
        </button>
      </form>
    </div>
  );
}