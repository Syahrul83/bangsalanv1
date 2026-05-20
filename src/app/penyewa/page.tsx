export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PenyewaPage() {
  const tenants = await prisma.tenant.findMany({
    include: { room: true },
    orderBy: { createdAt: "desc" },
  });

  async function handleDelete(formData: FormData) {
    "use server";
    const id = parseInt(formData.get("id") as string);
    const tenant = await prisma.tenant.findUnique({ where: { id } });
    if (tenant) {
      await prisma.room.update({
        where: { id: tenant.roomId },
        data: { status: "Kosong" },
      });
      await prisma.tenant.delete({ where: { id } });
    }
    redirect("/penyewa");
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Daftar Penyewa</h1>
        <Link href="/penyewa/tambah" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Tambah Penyewa
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Nama</th>
              <th className="p-2 text-left">No. HP</th>
              <th className="p-2 text-left">Kamar</th>
              <th className="p-2 text-left">Tgl Masuk</th>
              <th className="p-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="p-2">{t.name}</td>
                <td className="p-2">{t.phone}</td>
                <td className="p-2">{t.room.number}</td>
                <td className="p-2">{t.entryDate.toLocaleDateString("id-ID")}</td>
                <td className="p-2 flex gap-2">
                  <Link href={`/penyewa/${t.id}/edit`} className="text-blue-600 hover:underline">
                    Edit
                  </Link>
                  <form action={handleDelete}>
                    <input type="hidden" name="id" value={t.id} />
                    <button type="submit" className="text-red-600 hover:underline">
                      Hapus
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
