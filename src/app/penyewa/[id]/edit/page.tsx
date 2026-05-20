"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditPenyewaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [roomId, setRoomId] = useState("");
  const [rooms, setRooms] = useState<{ id: number; number: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => {
      Promise.all([
        fetch(`/api/penyewa/${p.id}`).then((r) => r.json()),
        fetch("/api/kamar").then((r) => r.json()),
      ]).then(([tenant, allRooms]) => {
        setName(tenant.name);
        setPhone(tenant.phone);
        setEntryDate(tenant.entryDate.split("T")[0]);
        setRoomId(tenant.roomId.toString());
        setRooms(allRooms);
        setLoading(false);
      });
    });
  }, [params]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const { id } = await params;
    const formData = new FormData(form);
    const res = await fetch(`/api/penyewa/${id}`, {
      method: "PUT",
      body: formData,
    });
    if (res.ok) {
      router.push("/penyewa");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Gagal mengedit penyewa");
    }
  }

  if (loading) return <p>Memuat...</p>;

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Edit Penyewa</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mt-4">
        <div className="mb-4">
          <label className="block mb-1">Nama</label>
          <input name="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">No. HP</label>
          <input name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border p-2 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Tanggal Masuk</label>
          <input name="entryDate" type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} className="w-full border p-2 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Kamar</label>
          <select name="roomId" value={roomId} onChange={(e) => setRoomId(e.target.value)} className="w-full border p-2 rounded" required>
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