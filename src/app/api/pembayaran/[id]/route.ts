import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const payment = await prisma.payment.update({
    where: { id: parseInt(id) },
    data: { status: "Lunas" },
  });
  return NextResponse.json(payment);
}