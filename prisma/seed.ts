import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Hapus data lama (urutan aman)
  await prisma.payment.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();

  // Buat user admin
  await prisma.user.create({
    data: { username: "admin", password: "admin123", name: "Pemilik Kos" },
  });

  // Buat kamar
  const roomsData = [
    { number: "A1", price: 500000 },
    { number: "A2", price: 500000 },
    { number: "A3", price: 550000 },
    { number: "B1", price: 600000 },
    { number: "B2", price: 600000 },
    { number: "B3", price: 650000 },
    { number: "C1", price: 700000 },
    { number: "C2", price: 700000 },
    { number: "C3", price: 750000 },
    { number: "D1", price: 800000 },
  ];

  const rooms: any[] = [];
  for (let i = 0; i < roomsData.length; i++) {
    const r = roomsData[i];
    const status = i < 6 ? "Terisi" : "Kosong";
    const room = await prisma.room.create({
      data: { number: r.number, price: r.price, status },
    });
    rooms.push(room);
  }

  // Buat penyewa untuk kamar yang terisi
  const tenantsData = [
    { name: "Ahmad Fauzi", phone: "081234567890", entryDate: new Date("2026-01-01"), roomIndex: 0 },
    { name: "Budi Santoso", phone: "081234567891", entryDate: new Date("2026-01-15"), roomIndex: 1 },
    { name: "Citra Dewi", phone: "081234567892", entryDate: new Date("2026-02-01"), roomIndex: 2 },
    { name: "Dodi Kusuma", phone: "081234567893", entryDate: new Date("2026-02-10"), roomIndex: 3 },
    { name: "Eka Putri", phone: "081234567894", entryDate: new Date("2026-03-01"), roomIndex: 4 },
    { name: "Fajar Nugroho", phone: "081234567895", entryDate: new Date("2026-03-15"), roomIndex: 5 },
  ];

  const tenants: any[] = [];
  for (const t of tenantsData) {
    const tenant = await prisma.tenant.create({
      data: {
        name: t.name,
        phone: t.phone,
        entryDate: t.entryDate,
        roomId: rooms[t.roomIndex].id,
      },
    });
    tenants.push(tenant);
  }

  // Buat pembayaran
  const months = [
    "Januari 2026", "Februari 2026", "Maret 2026",
    "April 2026", "Mei 2026",
  ];

  for (const tenant of tenants) {
    const idx = tenants.indexOf(tenant);
    const price = roomsData[idx].price;
    for (let m = 0; m < months.length; m++) {
      const status = m < 3 ? "Lunas" : "Belum Lunas";
      await prisma.payment.create({
        data: {
          tenantId: tenant.id,
          month: months[m],
          amount: price,
          status,
        },
      });
    }
  }

  console.log("Seed data berhasil!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
