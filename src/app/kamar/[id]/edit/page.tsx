"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditKamarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [number, setNumber] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => {
      fetch(`/api/kamar/${p.id}`)
        .then((res) => res.json())
        .then((data) => {
          setNumber(data.number);
          setPrice(data.price.toString());
          setLoading(false);
        });
    });
  }, [params]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const { id } = await params;
    const formData = new FormData(form);
    const res = await fetch(`/api/kamar/${id}`, {
      method: "PUT",
      body: formData,
    });
    if (res.ok) {
      router.push("/kamar");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Gagal mengedit kamar");
    }
  }

  if (loading) return <p>Memuat...</p>;

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Edit Kamar</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mt-4">
        <div className="mb-4">
          <label className="block mb-1">Nomor Kamar</label>
          <input
            name="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Harga Sewa</label>
          <input
            name="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Simpan
        </button>
      </form>
    </div>
  );
}
