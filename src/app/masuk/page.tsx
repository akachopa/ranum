"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Wordmark } from "@/components/brand";
import { Button, Field, inputClass } from "@/components/ui";
import { demoUsers } from "@/lib/seed";
import { useStore } from "@/lib/store";
import { roleLabel } from "@/lib/nav";

export default function LoginPage() {
  const { login, loginWithEmail } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState("rina@sumberrejeki.id");
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-forest p-10 text-cream lg:flex">
        <Wordmark light />
        <div>
          <h1 className="font-display text-5xl leading-tight">
            Masuk ke ruang kerja rantai pasok.
          </h1>
          <p className="mt-4 max-w-md text-cream/75">
            Demo MVP memakai akun peran. Tidak ada kata sandi sungguhan — pilih
            peran atau gunakan email contoh.
          </p>
        </div>
        <p className="text-sm text-cream/50">Asia/Jakarta · Pilot Jawa Timur</p>
      </div>
      <div className="flex items-center px-4 py-10 sm:px-10">
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden">
            <Wordmark />
          </div>
          <h2 className="mt-8 font-display text-3xl text-forest">Masuk</h2>
          <p className="mt-2 text-sm text-muted">
            Belum punya organisasi?{" "}
            <Link href="/daftar" className="font-semibold text-leaf">
              Daftar
            </Link>
          </p>
          <form
            className="mt-6 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              const ok = loginWithEmail(email);
              if (!ok) {
                setError("Email tidak ada di akun demo.");
                return;
              }
              const user = demoUsers.find(
                (u) => u.email.toLowerCase() === email.toLowerCase(),
              );
              if (user) router.push(`/${user.role}`);
            }}
          >
            <Field label="Email">
              <input
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
            </Field>
            <Field label="Kata sandi">
              <input className={inputClass} type="password" defaultValue="demo" />
            </Field>
            {error ? <p className="text-sm text-clay">{error}</p> : null}
            <Button type="submit" className="w-full">
              Masuk
            </Button>
          </form>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Satu ketuk — akun demo
          </p>
          <div className="mt-3 grid gap-2">
            {demoUsers.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => {
                  login(user.role);
                  router.push(`/${user.role}`);
                }}
                className="rounded-2xl border border-line bg-white px-4 py-3 text-left hover:border-leaf"
              >
                <p className="font-semibold text-forest">{user.name}</p>
                <p className="text-sm text-muted">
                  {roleLabel[user.role]} · {user.orgName}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
