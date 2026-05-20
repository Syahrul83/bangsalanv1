import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const tenant = await prisma.tenant.findUnique({
    where: { id: parseInt(id) },
    include: { room: true },
  });
  if (!tenant) {
    return NextResponse.json({ error: "Penyewa tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json(tenant);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const entryDate = new Date(formData.get("entryDate") as string);
  const roomId = parseInt(formData.get("roomId") as string);

  const existing = await prisma.tenant.findFirst({
    where: { roomId, NOT: { id: parseInt(id) } },
  });
  if (existing) {
    return NextResponse.json({ error: "Kamar sudah ditempati penyewa lain" }, { status: 400 });
  }

  const oldTenant = await prisma.tenant.findUnique({ where: { id: parseInt(id) } });

  const tenant = await prisma.tenant.update({
    where: { id: parseInt(id) },
    data: { name, phone, entryDate, roomId },
  });

  if (oldTenant && oldTenant.roomId !== roomId) {
    await prisma.room.update({
      where: { id: oldTenant.roomId },
      data: { status: "Kosong" },
    });
    await prisma.room.update({
      where: { id: roomId },
      data: { status: "Terisi" },
    });
  }

  return NextResponse.json(tenant);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const tenant = await prisma.tenant.findUnique({ where: { id: parseInt(id) } });
  if (tenant) {
    await prisma.room.update({
      where: { id: tenant.roomId },
      data: { status: "Kosong" },
    });
    await prisma.tenant.delete({ where: { id: parseInt(id) } });
  }
  return NextResponse.json({ ok: true });
}