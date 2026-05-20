export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import PaymentListTable from "@/components/PaymentListTable";

export default async function PembayaranPage() {
  const payments = await prisma.payment.findMany({
    include: { tenant: { include: { room: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PaymentListTable payments={payments} />
    </div>
  );
}