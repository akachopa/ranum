"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  BarList,
  Button,
  Card,
  Field,
  inputClass,
  Kpi,
  PageHeader,
  Timeline,
} from "@/components/ui";
import { DataTable } from "@/components/table";
import {
  auditLog,
  demoUsers,
  listings,
  orders,
  organizations,
  protocols,
  qualityStandards,
  rfqs,
  traceEvents,
} from "@/lib/seed";
import { formatDateTime, formatKg, formatRp } from "@/lib/format";
import { roleLabel } from "@/lib/nav";

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Arconesia"
        title="Dasbor eksekutif RANUM"
        description="Kesehatan ekosistem: organisasi, volume, GMV, waste, dan pemenuhan."
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Organisasi" value="12" hint="5 produsen · 1 aggregator" />
        <Kpi label="Pengguna aktif" value="48" />
        <Kpi label="Volume terlacak" value="88 t" />
        <Kpi label="GMV 30 hari" value={formatRp(412000000)} tone="gold" />
        <Kpi label="Pesanan" value="36" />
        <Kpi label="Fulfillment" value="94%" />
        <Kpi label="Reject" value="2,0%" tone="clay" />
        <Kpi label="Waste" value="0,9%" />
      </div>
      <Card>
        <h2 className="font-display text-xl text-forest">Volume per peran</h2>
        <div className="mt-4">
          <BarList
            unit="kg"
            items={[
              { label: "Produsen", value: 40520 },
              { label: "Aggregator", value: 54000 },
              { label: "Distributor", value: 88000 },
              { label: "Pembeli", value: 18400 },
            ]}
          />
        </div>
      </Card>
    </div>
  );
}

export function AdminOrganisasi() {
  return (
    <div className="space-y-6">
      <PageHeader title="Organisasi" description="Onboarding, verifikasi, langganan, jumlah user, ringkasan transaksi." />
      <DataTable
        rows={organizations}
        mobileTitle={(r) => r.name}
        mobileSubtitle={(r) => `${roleLabel[r.type]} · ${r.city}`}
        mobileBadge={(r) => r.status}
        columns={[
          { key: "name", label: "Nama" },
          { key: "type", label: "Tipe", render: (r) => roleLabel[r.type] },
          { key: "city", label: "Kota" },
          { key: "users", label: "User" },
          { key: "plan", label: "Paket" },
          { key: "status", label: "Status", render: (r) => <Badge tone={r.status}>{r.status}</Badge> },
        ]}
      />
    </div>
  );
}

export function AdminAkses() {
  return (
    <div className="space-y-6">
      <PageHeader title="Pengguna & akses" description="RBAC: user → peran → izin → menu → aksi." />
      <DataTable
        rows={demoUsers}
        mobileTitle={(r) => r.name}
        mobileSubtitle={(r) => r.email}
        columns={[
          { key: "name", label: "Nama" },
          { key: "orgName", label: "Organisasi" },
          { key: "role", label: "Peran", render: (r) => roleLabel[r.role] },
          { key: "title", label: "Jabatan" },
          { key: "email", label: "Email", hideOnMobile: true },
        ]}
      />
      <Card>
        <h2 className="font-display text-xl text-forest">Izin minimum</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {["view", "create", "update", "delete", "approve", "reject", "export", "manage"].map(
            (p) => (
              <Badge key={p}>{p}</Badge>
            ),
          )}
        </div>
      </Card>
    </div>
  );
}

export function AdminKomoditas() {
  const rows = [
    { id: "c1", category: "Buah", name: "Melon", variety: "Honeydew / Musk / Golden", unit: "kg", shelf: 18, status: "Aktif" },
    { id: "c2", category: "Buah", name: "Semangka", variety: "Inul Super", unit: "kg", shelf: 14, status: "Aktif" },
  ];
  return (
    <div className="space-y-6">
      <PageHeader title="Komoditas" description="Kategori, varietas, satuan, umur simpan dasar, status." />
      <DataTable
        rows={rows}
        mobileTitle={(r) => r.name}
        mobileSubtitle={(r) => r.variety}
        columns={[
          { key: "category", label: "Kategori" },
          { key: "name", label: "Komoditas" },
          { key: "variety", label: "Varietas" },
          { key: "unit", label: "Satuan" },
          { key: "shelf", label: "Umur simpan", render: (r) => `${r.shelf} hari` },
          { key: "status", label: "Status", render: (r) => <Badge tone={r.status}>{r.status}</Badge> },
        ]}
      />
    </div>
  );
}

export function AdminMutu() {
  return (
    <div className="space-y-6">
      <PageHeader title="Standar mutu" description="Bisa global atau spesifik pembeli." />
      <div className="grid gap-3 md:grid-cols-2">
        {qualityStandards.map((s) => (
          <Card key={s.id}>
            <div className="flex items-start justify-between">
              <h2 className="font-display text-2xl text-forest">{s.name}</h2>
              <Badge>{s.scope}</Badge>
            </div>
            <dl className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Berat</dt>
                <dd>{s.weight}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Defect</dt>
                <dd>{s.defect}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Kematangan</dt>
                <dd>{s.maturity}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Kerusakan</dt>
                <dd>{s.damage}</dd>
              </div>
            </dl>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AdminProtokol() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Protokol pascapanen"
        description="Jembatan riset Arconesia ke perlakuan batch: langkah, suhu, kemasan, umur simpan."
      />
      {protocols.map((p) => (
        <Card key={p.id}>
          <div className="flex flex-wrap justify-between gap-2">
            <div>
              <h2 className="font-display text-2xl text-forest">{p.name}</h2>
              <p className="text-sm text-muted">
                {p.commodity} · {p.temp} · umur simpan {p.shelf}
              </p>
              <p className="mt-1 text-xs text-muted">{p.source}</p>
            </div>
            <Badge tone={p.status}>{p.status}</Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function AdminPasar() {
  return (
    <div className="space-y-6">
      <PageHeader title="Marketplace" description="Pasok vs permintaan, matched, unmatched, shortage, surplus." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Kpi label="Total supply" value="12,4 t" />
        <Kpi label="Total demand" value="9,1 t" />
        <Kpi label="Matched" value="8,3 t" />
        <Kpi label="Unmatched supply" value="800 kg" tone="gold" />
        <Kpi label="Unmatched demand" value="180 kg" tone="clay" />
        <Kpi label="Listing aktif" value={String(listings.filter((l) => l.status === "Published").length)} />
      </div>
      <DataTable
        rows={rfqs}
        mobileTitle={(r) => r.id}
        mobileSubtitle={(r) => r.buyer}
        columns={[
          { key: "id", label: "RFQ" },
          { key: "buyer", label: "Pembeli" },
          { key: "commodity", label: "Komoditas" },
          { key: "quantityKg", label: "Qty", render: (r) => formatKg(r.quantityKg) },
          { key: "status", label: "Status", render: (r) => <Badge tone={r.status}>{r.status}</Badge> },
        ]}
      />
    </div>
  );
}

export function AdminTransaksi() {
  return (
    <div className="space-y-6">
      <PageHeader title="Transaksi" description="Monitor order lintas tenant: GMV, batal, pemenuhan, bayar, sengketa." />
      <DataTable
        rows={orders}
        mobileTitle={(r) => r.number}
        mobileSubtitle={(r) => `${r.buyer} ← ${r.seller}`}
        mobileBadge={(r) => r.status}
        columns={[
          { key: "number", label: "Order" },
          { key: "buyer", label: "Pembeli" },
          { key: "seller", label: "Penjual" },
          { key: "total", label: "Nilai", render: (r) => formatRp(r.total) },
          { key: "status", label: "Status", render: (r) => <Badge tone={r.status}>{r.status}</Badge> },
        ]}
      />
    </div>
  );
}

export function AdminJejak() {
  const [code, setCode] = useState("RN-MEL-20261025-001");
  const events = useMemo(
    () => traceEvents.filter((e) => e.batchCode === code),
    [code],
  );
  return (
    <div className="space-y-6">
      <PageHeader title="Lookup keterlacakan" description="Masukkan kode batch untuk melihat asal, silsilah, mutu, kepemilikan, dan pergerakan." />
      <Field label="Kode batch">
        <input className={inputClass} value={code} onChange={(e) => setCode(e.target.value)} />
      </Field>
      <Card>
        {events.length ? (
          <Timeline
            items={events.map((e) => ({
              title: e.type.replaceAll("_", " "),
              meta: `${e.org} · ${e.location}`,
              note: e.note,
            }))}
          />
        ) : (
          <p className="text-sm text-muted">Tidak ada peristiwa untuk kode ini pada data demo.</p>
        )}
        <Button href={`/jejak/${code}`} className="mt-2">
          Buka halaman publik
        </Button>
      </Card>
    </div>
  );
}

export function AdminLangganan() {
  const plans = [
    { id: "p1", name: "Starter", users: "5", tx: "50 order/bulan", analytics: "Dasar" },
    { id: "p2", name: "Business", users: "25", tx: "500 order/bulan", analytics: "Lanjut" },
    { id: "p3", name: "Enterprise", users: "Tak terbatas", tx: "Kustom", analytics: "Penuh + API" },
  ];
  return (
    <div className="space-y-6">
      <PageHeader title="Langganan" description="Batas user, fitur, penyimpanan, transaksi, analitik, siklus tagihan." />
      <div className="grid gap-3 md:grid-cols-3">
        {plans.map((p) => (
          <Card key={p.id}>
            <h2 className="font-display text-2xl text-forest">{p.name}</h2>
            <ul className="mt-3 space-y-1 text-sm text-muted">
              <li>User: {p.users}</li>
              <li>Transaksi: {p.tx}</li>
              <li>Analitik: {p.analytics}</li>
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AdminSengketa() {
  return (
    <div className="space-y-6">
      <PageHeader title="Sengketa" description="Kasus, order, batch, keluhan, bukti, linimasa, resolusi." />
      <Card>
        <div className="flex flex-wrap justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-moss">DSP-2604</p>
            <h2 className="font-display text-2xl text-forest">Mismatch mutu SO-26029</h2>
            <p className="text-sm text-muted">Batch RN-DST-20261012-003 · 24 kg</p>
          </div>
          <Badge tone="warn">Investigasi</Badge>
        </div>
      </Card>
    </div>
  );
}

export function AdminAnalitik() {
  return (
    <div className="space-y-6">
      <PageHeader title="Analitik platform" description="Produksi, mutu, inventori, pasar, dan komersial." />
      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <h2 className="font-display text-xl text-forest">Produksi</h2>
          <BarList
            unit="kg"
            items={[
              { label: "Forecast 14 hari", value: 24800 },
              { label: "Realisasi 14 hari", value: 18200 },
            ]}
          />
        </Card>
        <Card>
          <h2 className="font-display text-xl text-forest">Pasar</h2>
          <BarList
            items={[
              { label: "Harga melon A", value: 22000 },
              { label: "Harga semangka A", value: 7500 },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}

export function AdminAudit() {
  return (
    <div className="space-y-6">
      <PageHeader title="Audit" description="Login, create, update, delete, approval, penyesuaian stok, perubahan izin." />
      <DataTable
        rows={auditLog.map((a, i) => ({ ...a, id: String(i) }))}
        mobileTitle={(r) => r.action}
        mobileSubtitle={(r) => r.actor}
        columns={[
          { key: "time", label: "Waktu", render: (r) => formatDateTime(r.time) },
          { key: "actor", label: "Aktor" },
          { key: "action", label: "Aksi" },
          { key: "object", label: "Objek" },
        ]}
      />
    </div>
  );
}

export function AdminPengaturan() {
  return (
    <div className="space-y-6">
      <PageHeader title="Pengaturan" description="Identitas platform, zona waktu, notifikasi, dan tenancy." />
      <Card>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Produk</dt>
            <dd>RANUM 1.0 MVP</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Zona waktu</dt>
            <dd>Asia/Jakarta</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Multi-tenant</dt>
            <dd>Shared DB · organization_id</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Notifikasi</dt>
            <dd>In-app · Email · WhatsApp (siap)</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
