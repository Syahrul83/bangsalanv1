import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rooms = await prisma.room.findMany({ include: { tenant: true }, orderBy: { number: "asc" } });
  return NextResponse.json(rooms);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const number = formData.get("number") as string;
  const price = parseFloat(formData.get("price") as string);

  const existing = await prisma.room.findUnique({ where: { number } });
  if (existing) {
    return NextResponse.json({ error: "Nomor kamar sudah ada" }, { status: 400 });
  }

  const room = await prisma.room.create({ data: { number, price } });
  return NextResponse.json(room);
}