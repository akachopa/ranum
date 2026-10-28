"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  GitBranch,
  Leaf,
  Package,
  Shield,
  Store,
  Truck,
} from "lucide-react";
import { Wordmark } from "@/components/brand";
import { Button } from "@/components/ui";
import { useStore } from "@/lib/store";
import { roleLabel } from "@/lib/nav";
import type { Role } from "@/lib/types";

const roles: { role: Role; title: string; body: string }[] = [
  {
    role: "producer",
    title: "Produsen",
    body: "Kebun, siklus, panen, batch, dan jual hasil tanpa kehilangan jejak.",
  },
  {
    role: "aggregator",
    title: "Aggregator",
    body: "Terima, grading, gabung batch, jaga silsilah, jual ke pasar B2B.",
  },
  {
    role: "distributor",
    title: "Distributor",
    body: "Pengadaan, gudang dingin, pemenuhan, dan kirim tepat waktu.",
  },
  {
    role: "buyer",
    title: "Pembeli",
    body: "Cari pasokan, RFQ, kontrak, terima, QC, dan telusuri asal buah.",
  },
  {
    role: "admin",
    title: "Admin RANUM",
    body: "Standar mutu, organisasi, transaksi lintas tenant, dan audit.",
  },
];

const steps = [
  { icon: Leaf, label: "Panen" },
  { icon: Package, label: "Batch & mutu" },
  { icon: Store, label: "Pasar" },
  { icon: Truck, label: "Kirim" },
  { icon: GitBranch, label: "Jejak" },
];

export default function LandingPage() {
  const { login, user } = useStore();
  const router = useRouter();
  const [code, setCode] = useState("RN-MEL-20261025-001");

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Wordmark />
          <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
            <a href="#alur">Alur</a>
            <a href="#peran">Peran</a>
            <a href="#jejak">Keterlacakan</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button href="/masuk" variant="ghost" className="hidden sm:inline-flex">
              Masuk
            </Button>
            <Button href="/masuk">Coba demo</Button>
          </div>
        </div>
      </header>

      <section className="paper-grid">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-moss">
              Agricultural supply chain
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-forest sm:text-6xl">
              Dari panen ke pasar, terukur dan terlacak.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">
              RANUM menghubungkan produsen, aggregator, distributor, dan pembeli
              dalam satu platform operasi: batch, mutu, stok, transaksi, dan
              keterlacakan.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => {
                  login("producer");
                  router.push("/producer");
                }}
              >
                Masuk sebagai produsen
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="#peran" variant="secondary">
                Lihat lima peran
              </Button>
            </div>
            {user ? (
              <p className="mt-4 text-sm text-moss">
                Sesi aktif: {user.name} ·{" "}
                <Link className="underline" href={`/${user.role}`}>
                  buka ruang kerja
                </Link>
              </p>
            ) : null}
          </div>
          <div className="rounded-3xl border border-line bg-white p-5 sm:p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">
              Alur utama
            </p>
            <ol className="mt-4 space-y-3">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <li key={step.label} className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mint text-leaf">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-medium">
                      {index + 1}. {step.label}
                    </span>
                  </li>
                );
              })}
            </ol>
            <div className="mt-6 rounded-2xl bg-forest p-4 text-cream">
              <p className="text-xs uppercase tracking-widest text-cream/60">
                Pilot Jawa Timur
              </p>
              <p className="mt-1 font-display text-2xl">Melon & semangka</p>
              <p className="mt-1 text-sm text-cream/75">
                Nganjuk · Magetan · Surabaya
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="alur" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="font-display text-3xl text-forest sm:text-4xl">
            Satu batch, satu sumber kebenaran
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            Produk, lot, mutu, stok, perpindahan, dan transaksi mengikuti batch.
            Gabung atau pecah lot tanpa kehilangan silsilah.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Batch first", "Semua proses tertaut ke kode lot."],
              ["Trace everything", "Setiap peristiwa penting tercatat."],
              ["Action oriented", "Dasbor mendorong tindakan, bukan hanya KPI."],
              ["Sederhana untuk petani", "UI produsen lebih ringkas dari admin."],
            ].map(([t, b]) => (
              <div key={t} className="rounded-2xl border border-line bg-white p-5">
                <h3 className="font-display text-xl text-forest">{t}</h3>
                <p className="mt-2 text-sm text-muted">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="peran" className="border-t border-line bg-cream/50">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="font-display text-3xl text-forest sm:text-4xl">
            Lima ruang kerja
          </h2>
          <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {roles.map((item) => (
              <button
                key={item.role}
                type="button"
                onClick={() => {
                  login(item.role);
                  router.push(`/${item.role}`);
                }}
                className="rounded-2xl border border-line bg-white p-5 text-left hover:border-leaf"
              >
                <p className="text-xs uppercase tracking-widest text-moss">
                  {roleLabel[item.role]}
                </p>
                <h3 className="mt-1 font-display text-2xl text-forest">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{item.body}</p>
                <p className="mt-4 text-sm font-semibold text-leaf">
                  Buka demo →
                </p>
              </button>
            ))}
            <div className="rounded-2xl bg-forest p-5 text-cream">
              <Shield className="h-6 w-6 text-mint" />
              <h3 className="mt-3 font-display text-2xl">Multi-tenant</h3>
              <p className="mt-2 text-sm text-cream/75">
                Data organisasi terisolasi. Admin melihat lintas platform tanpa
                mencampur stok tenant.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="jejak" className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-forest sm:text-4xl">
              Telusuri batch publik
            </h2>
            <p className="mt-3 text-muted">
              Halaman jejak bisa dibuka lewat QR. Data harga dan kontrak tidak
              ditampilkan ke publik.
            </p>
            <form
              className="mt-6 flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                router.push(`/jejak/${code}`);
              }}
            >
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="min-h-11 flex-1 rounded-full border border-line bg-white px-4 text-sm outline-none ring-leaf/30 focus:border-leaf focus:ring-2"
              />
              <Button type="submit">Lihat jejak</Button>
            </form>
          </div>
          <div className="rounded-3xl border border-line bg-white p-6">
            <p className="font-mono text-sm text-moss">RN-MEL-20261025-001</p>
            <p className="mt-2 font-display text-2xl text-forest">
              Melon Musk Premium · Grade A
            </p>
            <p className="mt-1 text-sm text-muted">
              Greenhouse Kertosono, Nganjuk · panen 25 Okt 2026
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>Panen 1.180 kg</li>
              <li>QC Grade A · maturity 86%</li>
              <li>800 kg dipesan Arcadia Hospitality</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>RANUM · produk agritech Arconesia</p>
          <p>From Harvest to Market</p>
        </div>
      </footer>
    </div>
  );
}
