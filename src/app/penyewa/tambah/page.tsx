"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TambahPenyewaPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [rooms, setRooms] = useState<{ id: number; number: string }[]>([]);

  useEffect(() => {
    fetch("/api/kamar")
      .then((res) => res.json())
      .then((data) => setRooms(data.filter((r: { status: string }) => r.status === "Kosong")));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/penyewa", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      router.push("/penyewa");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Gagal menambah penyewa");
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Tambah Penyewa</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mt-4">
        <div className="mb-4">
          <label className="block mb-1">Nama</label>
          <input name="name" className="w-full border p-2 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">No. HP</label>
          <input name="phone" className="w-full border p-2 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Tanggal Masuk</label>
          <input name="entryDate" type="date" className="w-full border p-2 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Kamar</label>
          <select name="roomId" className="w-full border p-2 rounded" required>
            <option value="">Pilih Kamar</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>{r.number}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Simpan
        </button>
      </form>
    </div>
  );
}