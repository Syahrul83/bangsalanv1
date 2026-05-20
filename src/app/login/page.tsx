"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

async function doLogin(username: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.ok;
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const ok = await doLogin(
      form.get("username") as string,
      form.get("password") as string
    );
    if (ok) {
      router.push("/");
      router.refresh();
    } else {
      setError("Username atau password salah");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4 text-center">Login Sistem Kos</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block mb-1">Username</label>
          <input name="username" className="w-full border p-2 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input name="password" type="password" className="w-full border p-2 rounded" required />
        </div>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
}