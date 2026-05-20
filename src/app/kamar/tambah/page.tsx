"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TambahKamarPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/kamar", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      router.push("/kamar");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Gagal menambah kamar");
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Tambah Kamar</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mt-4">
        <div className="mb-4">
          <label className="block mb-1">Nomor Kamar</label>
          <input name="number" className="w-full border p-2 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Harga Sewa</label>
          <input name="price" type="number" className="w-full border p-2 rounded" required />
        </div>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Simpan
        </button>
      </form>
    </div>
  );
}