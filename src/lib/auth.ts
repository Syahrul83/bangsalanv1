import { cookies } from "next/headers";

export async function getSession() {
  const sessionCookie = (await cookies()).get("session");
  return sessionCookie?.value || null;
}

export async function login(username: string, password: string): Promise<boolean> {
  const { prisma } = await import("./prisma");
  const user = await prisma.user.findUnique({ where: { username } });
  if (user && user.password === password) {
    (await cookies()).set("session", user.id.toString(), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return true;
  }
  return false;
}

export async function logout() {
  (await cookies()).set("session", "", { httpOnly: true, path: "/", maxAge: 0 });
}