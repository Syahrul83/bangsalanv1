import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const tenants = await prisma.tenant.findMany({
    include: { room: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(tenants);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const entryDate = new Date(formData.get("entryDate") as string);
  const roomId = parseInt(formData.get("roomId") as string);

  const existingTenant = await prisma.tenant.findUnique({ where: { roomId } });
  if (existingTenant) {
    return NextResponse.json({ error: "Kamar sudah ditempati" }, { status: 400 });
  }

  const tenant = await prisma.tenant.create({
    data: { name, phone, entryDate, roomId },
  });

  await prisma.room.update({
    where: { id: roomId },
    data: { status: "Terisi" },
  });

  return NextResponse.json(tenant);
}