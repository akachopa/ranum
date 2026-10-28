"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Wordmark } from "@/components/brand";
import { Button, Field, inputClass } from "@/components/ui";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/types";

const types: { role: Exclude<Role, "admin">; label: string }[] = [
  { role: "producer", label: "Produsen / kebun" },
  { role: "aggregator", label: "Aggregator / koperasi" },
  { role: "distributor", label: "Distributor" },
  { role: "buyer", label: "Pembeli" },
];

export default function RegisterPage() {
  const { login, notify } = useStore();
  const router = useRouter();
  const [role, setRole] = useState<Exclude<Role, "admin">>("producer");

  return (
    <div className="min-h-screen bg-paper px-4 py-10">
      <div className="mx-auto max-w-lg">
        <Wordmark />
        <h1 className="mt-8 font-display text-3xl text-forest">
          Daftarkan organisasi
        </h1>
        <p className="mt-2 text-sm text-muted">
          Onboarding MVP. Setelah daftar, Anda masuk ke ruang kerja sesuai jenis
          organisasi.
        </p>
        <form
          className="mt-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            login(role);
            notify("Organisasi terdaftar. Selamat datang di RANUM.");
            router.push(`/${role}`);
          }}
        >
          <Field label="Nama organisasi">
            <input className={inputClass} required placeholder="Kebun / PT / koperasi" />
          </Field>
          <Field label="Jenis">
            <select
              className={inputClass}
              value={role}
              onChange={(e) => setRole(e.target.value as Exclude<Role, "admin">)}
            >
              {types.map((t) => (
                <option key={t.role} value={t.role}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Nama penanggung jawab">
            <input className={inputClass} required />
          </Field>
          <Field label="Email">
            <input className={inputClass} type="email" required />
          </Field>
          <Field label="Kota">
            <input className={inputClass} defaultValue="Nganjuk" />
          </Field>
          <Button type="submit" className="w-full">
            Buat akun
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted">
          Sudah terdaftar?{" "}
          <Link href="/masuk" className="font-semibold text-leaf">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
