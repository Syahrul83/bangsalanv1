import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const payments = await prisma.payment.findMany({
    include: { tenant: { include: { room: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(payments);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const tenantId = parseInt(formData.get("tenantId") as string);
  const month = formData.get("month") as string;
  const amount = parseFloat(formData.get("amount") as string);

  const existing = await prisma.payment.findFirst({
    where: { tenantId, month },
  });

  if (existing) {
    return NextResponse.json(
      { error: `Pembayaran untuk ${month} sudah ada. Tidak boleh duplikat!` },
      { status: 409 }
    );
  }

  const payment = await prisma.payment.create({
    data: { tenantId, month, amount },
  });

  return NextResponse.json(payment);
}