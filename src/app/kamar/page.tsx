import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Room, Tenant } from "@prisma/client";

// bikin tipe Room + Tenant
type KamarWithTenant = Room & { tenant: Tenant | null };

export async function getServerSideProps() {
  const kamar = await prisma.room.findMany({
    include: { tenant: true },
    orderBy: { number: "asc" },
  });
  return { props: { kamar } };
}

export default function KamarPage({ kamar }: { kamar: KamarWithTenant[] }) {
  async function handleDelete(formData: FormData) {
    "use server";
    const id = parseInt(formData.get("id") as string);
    await prisma.room.delete({ where: { id } });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Daftar Kamar</h1>
        <Link
          href="/kamar/tambah"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Tambah Kamar
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">No. Kamar</th>
              <th className="p-2 text-left">Harga</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Penyewa</th>
              <th className="p-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kamar.map((k: KamarWithTenant) => (
              <tr key={k.id} className="border-t">
                <td className="p-2">{k.number}</td>
                <td className="p-2">Rp {k.price.toLocaleString()}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      k.status === "Terisi"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {k.status}
                  </span>
                </td>
                <td className="p-2">{k.tenant?.name || "-"}</td>
                <td className="p-2 flex gap-2">
                  <Link
                    href={`/kamar/${k.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <form action={handleDelete}>
                    <input type="hidden" name="id" value={k.id} />
                    <button
                      type="submit"
                      className="text-red-600 hover:underline"
                    >
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
