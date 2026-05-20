import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const user = await prisma.user.findUnique({ where: { username } });

  if (user && user.password === password) {
    (await cookies()).set("session", user.id.toString(), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}