"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  X,
} from "lucide-react";
import { Wordmark } from "./brand";
import { Toasts } from "./ui";
import { navigation, roleLabel } from "@/lib/nav";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/types";

const roles: Role[] = [
  "producer",
  "aggregator",
  "distributor",
  "buyer",
  "admin",
];

export function AppShell({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const { user, ready, switchRole, logout, toasts } = useStore();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const items = navigation[role] ?? [];
  const mobileItems = items.filter((i) => i.mobile).slice(0, 4);

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace("/masuk");
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper text-muted">
        Memuat ruang kerja...
      </div>
    );
  }

  const navList = (
    <nav className="flex flex-col gap-0.5 p-3">
      {items.map((item) => {
        const active =
          item.href === `/${role}`
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm ${
              active
                ? "bg-leaf text-cream"
                : "text-cream/80 hover:bg-white/10 hover:text-cream"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] bg-forest md:flex md:flex-col">
        <div className="border-b border-white/10 px-4 py-4">
          <Link href={`/${role}`}>
            <Wordmark light compact />
          </Link>
          <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-cream/50">
            {roleLabel[role] ?? "RANUM"}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">{navList}</div>
        <div className="border-t border-white/10 p-4 text-xs text-cream/70">
          <p className="truncate font-medium text-cream">{user.orgName}</p>
          <p className="mt-1 truncate">{user.name}</p>
        </div>
      </aside>

      {open ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            className="absolute inset-0 bg-ink/40"
            aria-label="Tutup menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-forest">
            <div className="flex items-center justify-between px-4 py-4">
              <Wordmark light compact />
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-cream"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{navList}</div>
            <div className="border-t border-white/10 p-4">
              <p className="mb-2 text-[11px] uppercase tracking-widest text-cream/50">
                Peran demo
              </p>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      switchRole(r);
                      router.push(`/${r}`);
                    }}
                    className={`min-h-10 rounded-xl px-2 text-xs font-semibold ${
                      r === role ? "bg-leaf text-cream" : "bg-white/10 text-cream"
                    }`}
                  >
                    {roleLabel[r]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="md:pl-[260px]">
        <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
          <div className="flex items-center gap-2 px-3 py-3 sm:px-6">
            <button
              className="rounded-xl p-2 text-forest md:hidden"
              onClick={() => setOpen(true)}
              aria-label="Buka menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <form
              className="relative min-w-0 flex-1"
              onSubmit={(e) => {
                e.preventDefault();
                if (query.trim()) {
                  router.push(`/${role}/jejak?q=${encodeURIComponent(query)}`);
                }
              }}
            >
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari batch atau pesanan"
                className="h-11 w-full rounded-full border border-line bg-white pl-10 pr-4 text-sm outline-none ring-leaf/30 placeholder:text-muted focus:border-leaf focus:ring-2"
              />
            </form>
            <button
              className="hidden rounded-full border border-line p-2.5 text-forest sm:inline-flex"
              aria-label="Notifikasi"
            >
              <Bell className="h-4 w-4" />
            </button>
            <label className="relative hidden sm:block">
              <span className="sr-only">Ganti peran demo</span>
              <select
                value={role}
                onChange={(e) => {
                  const next = e.target.value as Role;
                  switchRole(next);
                  router.push(`/${next}`);
                }}
                className="h-11 appearance-none rounded-full border border-line bg-white py-0 pl-3 pr-9 text-sm text-forest"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {roleLabel[r]}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            </label>
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="rounded-full p-2 text-muted hover:bg-cream"
              aria-label="Keluar"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>
        <main
          className={`px-3 py-5 sm:px-6 sm:py-8 ${
            mobileItems.length ? "pb-24 md:pb-10" : "pb-10"
          }`}
        >
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>

      {mobileItems.length ? (
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur md:hidden safe-bottom">
          <div className="grid grid-cols-4">
            {mobileItems.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === `/${role}`
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
              const short = item.label.split(" ")[0];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex min-w-0 flex-col items-center gap-1 overflow-hidden px-1 py-2 text-center text-[10px] leading-tight ${
                    active ? "text-leaf" : "text-muted"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                  <span className="w-full truncate">{short}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      ) : null}

      <Toasts items={toasts} />
    </div>
  );
}
