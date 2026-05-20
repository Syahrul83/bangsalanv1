import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const room = await prisma.room.findUnique({
    where: { id: parseInt(id) },
    include: { tenant: true },
  });
  if (!room) {
    return NextResponse.json({ error: "Kamar tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json(room);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const formData = await request.formData();
  const number = formData.get("number") as string;
  const price = parseFloat(formData.get("price") as string);

  const existing = await prisma.room.findFirst({
    where: { number, NOT: { id: parseInt(id) } },
  });
  if (existing) {
    return NextResponse.json({ error: "Nomor kamar sudah ada" }, { status: 400 });
  }

  const room = await prisma.room.update({
    where: { id: parseInt(id) },
    data: { number, price },
  });
  return NextResponse.json(room);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.room.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
