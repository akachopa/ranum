"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCard,
  Badge,
  BarList,
  Button,
  Card,
  Field,
  inputClass,
  Kpi,
  Modal,
  PageHeader,
  QrFrame,
  SearchInput,
  Timeline,
} from "@/components/ui";
import { DataTable } from "@/components/table";
import { useStore } from "@/lib/store";
import {
  batches,
  cycles,
  genealogy,
  harvestPlans,
  inventory,
  invoices,
  shipments,
  traceEvents,
} from "@/lib/seed";
import { formatDate, formatKg, formatRp } from "@/lib/format";
import type { Farm } from "@/lib/types";

export function ProducerDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Produsen"
        title="Kondisi kebun hari ini"
        description="Fokus pada panen yang segera siap, stok tanpa pembeli, dan pesanan yang perlu disiapkan."
        actions={
          <Button href="/producer/panen">Catat panen</Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Kebun aktif" value="3" hint="8,7 ha total" />
        <Kpi label="Siklus berjalan" value="4" hint="2 siap panen" />
        <Kpi label="Panen 7 hari" value="9.100 kg" hint="Honeydew + Musk" tone="gold" />
        <Kpi label="Belum ada pembeli" value="800 kg" hint="Honeydew Bagor" tone="clay" />
      </div>
      <AlertCard
        tone="warn"
        title="800 kg melon akan siap panen dalam 3 hari dan belum memiliki pembeli."
        body="Publikasikan perkiraan pasok ke marketplace agar aggregator dan hotel bisa mengunci volume."
        actionLabel="Buka rencana panen"
        href="/producer/rencana-panen"
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="font-display text-xl text-forest">Tindakan hari ini</h2>
          <div className="mt-4 space-y-3">
            {[
              ["SO-26041", "Siapkan 800 kg Melon Musk untuk Arcadia", "/producer/pesanan/SO-26041"],
              ["QC pending", "Batch RN-MEL-20261027-002 belum difoto ulang", "/producer/batch/RN-MEL-20261027-002"],
              ["Stok lambat", "210 kg semangka Inul sisa 5 hari umur simpan", "/producer/stok"],
            ].map(([code, text, href]) => (
              <Link
                key={code}
                href={href}
                className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3 hover:bg-mint/60"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-moss">
                    {code}
                  </p>
                  <p className="text-sm text-ink">{text}</p>
                </div>
                <span className="text-sm text-leaf">Buka</span>
              </Link>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-display text-xl text-forest">Stok vs pesanan</h2>
          <div className="mt-4">
            <BarList
              unit="kg"
              items={[
                { label: "Tersedia", value: 1230 },
                { label: "Reserved", value: 800 },
                { label: "Tanpa listing", value: 800 },
                { label: "Mendekati kedaluwarsa", value: 210 },
              ]}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

export function ProducerKebun({ id }: { id?: string }) {
  const { farms, addFarm } = useStore();
  const router = useRouter();
  const [open, setOpen] = useState(id === "baru");
  const [q, setQ] = useState("");

  if (id && id !== "baru") {
    const farm = farms.find((f) => f.id === id);
    if (!farm) return <p>Kebun tidak ditemukan.</p>;
    return <FarmDetail farm={farm} />;
  }

  const rows = farms.filter((f) =>
    `${f.name} ${f.city} ${f.commodity}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Lahan"
        title="Kebun & lahan"
        description="Kelola lokasi GPS, luas, blok, dan sertifikasi. Setiap kebun menjadi sumber batch."
        actions={<Button onClick={() => setOpen(true)}>Tambah kebun</Button>}
      />
      <SearchInput value={q} onChange={setQ} placeholder="Cari kebun atau komoditas" />
      <DataTable
        rows={rows}
        onRowClick={(row) => router.push(`/producer/kebun/${row.id}`)}
        mobileTitle={(r) => r.name}
        mobileSubtitle={(r) => `${r.city} · ${r.commodity}`}
        mobileBadge={(r) => r.status}
        columns={[
          { key: "name", label: "Kebun" },
          { key: "city", label: "Lokasi", render: (r) => `${r.city}, ${r.province}` },
          { key: "areaHa", label: "Luas", render: (r) => `${r.areaHa} ha` },
          { key: "blocks", label: "Blok" },
          { key: "commodity", label: "Komoditas" },
          {
            key: "status",
            label: "Status",
            render: (r) => <Badge tone={r.status}>{r.status}</Badge>,
          },
        ]}
      />
      <FarmForm
        open={open}
        onClose={() => setOpen(false)}
        onSave={(farm) => {
          addFarm(farm);
          setOpen(false);
        }}
      />
    </div>
  );
}

function FarmDetail({ farm }: { farm: Farm }) {
  const related = cycles.filter((c) => c.farmId === farm.id);
  return (
    <div className="space-y-6">
      <PageHeader
        kicker={farm.city}
        title={farm.name}
        description={`${farm.location} · ${farm.areaHa} ha · ${farm.certification}`}
        actions={<Button href="/producer/budidaya">Buat siklus</Button>}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex h-48 items-end rounded-xl bg-forest p-4 text-cream">
            <div>
              <p className="text-xs uppercase tracking-widest text-cream/60">
                Peta lahan
              </p>
              <p className="font-display text-2xl">{farm.name}</p>
              <p className="text-sm text-cream/80">
                {farm.lat}, {farm.lng}
              </p>
            </div>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted">Komoditas</dt>
              <dd className="font-medium">{farm.commodity}</dd>
            </div>
            <div>
              <dt className="text-muted">Blok</dt>
              <dd className="font-medium">{farm.blocks}</dd>
            </div>
            <div>
              <dt className="text-muted">Sertifikasi</dt>
              <dd className="font-medium">{farm.certification}</dd>
            </div>
            <div>
              <dt className="text-muted">Status</dt>
              <dd>
                <Badge tone={farm.status}>{farm.status}</Badge>
              </dd>
            </div>
          </dl>
        </Card>
        <Card>
          <h2 className="font-display text-xl text-forest">Siklus di kebun ini</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {related.map((c) => (
              <li key={c.id} className="rounded-xl bg-cream px-3 py-2">
                <p className="font-medium">{c.variety}</p>
                <p className="text-muted">
                  {formatKg(c.estimatedKg)} · {c.status}
                </p>
              </li>
            ))}
            {!related.length ? <p className="text-muted">Belum ada siklus.</p> : null}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function FarmForm({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (farm: Omit<Farm, "id">) => void;
}) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("Nganjuk");
  const [area, setArea] = useState("1.0");
  const [commodity, setCommodity] = useState("Melon");
  return (
    <Modal open={open} title="Tambah kebun" onClose={onClose}>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSave({
            name,
            location: "Blok baru",
            city,
            province: "Jawa Timur",
            areaHa: Number(area),
            blocks: 1,
            commodity,
            status: "Aktif",
            certification: "Belum",
            lat: -7.6,
            lng: 111.9,
            photo: "melon",
          });
        }}
      >
        <Field label="Nama kebun">
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
        </Field>
        <Field label="Kota">
          <input className={inputClass} value={city} onChange={(e) => setCity(e.target.value)} />
        </Field>
        <Field label="Luas (ha)">
          <input className={inputClass} value={area} onChange={(e) => setArea(e.target.value)} />
        </Field>
        <Field label="Komoditas">
          <select className={inputClass} value={commodity} onChange={(e) => setCommodity(e.target.value)}>
            <option>Melon</option>
            <option>Semangka</option>
            <option>Melon Golden</option>
          </select>
        </Field>
        <Button type="submit" className="w-full">
          Simpan kebun
        </Button>
      </form>
    </Modal>
  );
}

export function ProducerBudidaya() {
  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Siklus"
        title="Budidaya"
        description="RANUM tidak menggantikan farm management lengkap. Di sini Anda mencatat komoditas, tanam, dan estimasi panen."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {cycles.map((c) => (
          <Card key={c.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-moss">{c.farm}</p>
                <h2 className="font-display text-2xl text-forest">{c.variety}</h2>
              </div>
              <Badge tone={c.status}>{c.status.replaceAll("_", " ")}</Badge>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div>
                <dt className="text-muted">Tanam</dt>
                <dd>{formatDate(c.plantedAt)}</dd>
              </div>
              <div>
                <dt className="text-muted">Estimasi panen</dt>
                <dd>{formatDate(c.harvestEta)}</dd>
              </div>
              <div>
                <dt className="text-muted">Luas</dt>
                <dd>{c.areaHa} ha</dd>
              </div>
              <div>
                <dt className="text-muted">Estimasi volume</dt>
                <dd>{formatKg(c.estimatedKg)}</dd>
              </div>
            </dl>
            <Button href="/producer/rencana-panen" variant="secondary" className="mt-4 w-full">
              Buat rencana panen
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ProducerRencana() {
  const { publishListing, notify } = useStore();
  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Pasok masa depan"
        title="Rencana panen"
        description="Ubah estimasi siklus menjadi pasokan yang bisa dilihat pembeli sebelum buah dipetik."
      />
      {harvestPlans.map((plan) => (
        <Card key={plan.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-moss">{plan.farm}</p>
            <h2 className="font-display text-2xl text-forest">{plan.commodity}</h2>
            <p className="mt-1 text-sm text-muted">
              {formatDate(plan.date)} · {formatKg(plan.volumeKg)} · Grade {plan.grade} · target {formatRp(plan.targetPrice)}/kg
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge tone="warn">{plan.readiness}</Badge>
              <Badge tone={plan.published ? "good" : "neutral"}>
                {plan.published ? "Published" : "Belum tayang"}
              </Badge>
            </div>
          </div>
          <Button
            onClick={() => {
              if (plan.id === "plan-01") publishListing("lst-03");
              else notify("Pasok ini sudah tayang");
            }}
          >
            Publikasikan ke pasar
          </Button>
        </Card>
      ))}
    </div>
  );
}

export function ProducerPanen() {
  const { harvests, addHarvest } = useStore();
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState("500");
  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Realisasi"
        title="Panen"
        description="Catat volume aktual. Sistem otomatis membuat kode batch."
        actions={<Button onClick={() => setOpen(true)}>Catat panen</Button>}
      />
      <DataTable
        rows={harvests}
        mobileTitle={(r) => r.batchCode}
        mobileSubtitle={(r) => `${r.farm} · ${formatKg(r.volumeKg)}`}
        columns={[
          { key: "date", label: "Tanggal", render: (r) => formatDate(r.date) },
          { key: "farm", label: "Sumber lahan" },
          { key: "variety", label: "Varietas" },
          { key: "volumeKg", label: "Volume", render: (r) => formatKg(r.volumeKg) },
          { key: "batchCode", label: "Batch" },
        ]}
      />
      <Modal open={open} title="Realisasi panen" onClose={() => setOpen(false)}>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            addHarvest({
              planId: "plan-01",
              farm: "Kebun Bagor Utara",
              date: "2026-10-28",
              volumeKg: Number(volume),
              variety: "Honeydew Sky Rocket",
              notes: "Dicatat dari lapangan",
            });
            setOpen(false);
          }}
        >
          <Field label="Volume aktual (kg)">
            <input className={inputClass} value={volume} onChange={(e) => setVolume(e.target.value)} />
          </Field>
          <p className="text-sm text-muted">
            Batch code akan digenerate, contoh RN-MEL-20261028-003.
          </p>
          <Button type="submit" className="w-full">
            Simpan & buat batch
          </Button>
        </form>
      </Modal>
    </div>
  );
}

export function ProducerBatch({ id }: { id?: string }) {
  const router = useRouter();
  if (id) {
    const batch = batches.find((b) => b.code === id) ?? batches[0];
    const events = traceEvents.filter((e) => e.batchCode === batch.code);
    return (
      <div className="space-y-6">
        <PageHeader
          kicker={batch.farm}
          title={batch.code}
          description={`${batch.variety} · panen ${formatDate(batch.harvestDate)} · FEFO ${formatDate(batch.expiry)}`}
          actions={<Button href={`/jejak/${batch.code}`}>Halaman publik</Button>}
        />
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              <div>
                <p className="text-muted">Grade</p>
                <p className="font-display text-3xl text-forest">{batch.grade}</p>
              </div>
              <div>
                <p className="text-muted">Kematangan</p>
                <p className="font-display text-3xl text-forest">{batch.maturity}</p>
              </div>
              <div>
                <p className="text-muted">Cacat</p>
                <p className="font-display text-3xl text-forest">{batch.defectPct}%</p>
              </div>
              <div>
                <p className="text-muted">Tersedia</p>
                <p className="font-medium">{formatKg(batch.availableKg)}</p>
              </div>
              <div>
                <p className="text-muted">Reserved</p>
                <p className="font-medium">{formatKg(batch.reservedKg)}</p>
              </div>
              <div>
                <p className="text-muted">Status</p>
                <Badge tone={batch.status}>{batch.status.replaceAll("_", " ")}</Badge>
              </div>
            </div>
            <div className="mt-6">
              <h2 className="font-display text-xl text-forest">Riwayat mutu</h2>
              <Timeline
                items={events.map((e) => ({
                  title: e.type.replaceAll("_", " "),
                  meta: `${e.org} · ${e.location}`,
                  note: e.note,
                }))}
              />
            </div>
          </Card>
          <div className="space-y-4">
            <QrFrame code={batch.code} />
            <Card>
              <h2 className="font-display text-xl text-forest">Silsilah</h2>
              <p className="mt-2 text-sm text-muted">
                Batch ini masih batch sumber. Belum dipecah atau digabung.
              </p>
              <ul className="mt-3 text-sm">
                {genealogy
                  .filter((g) => g.parent.startsWith("RN-MEL-20261024"))
                  .map((g) => (
                    <li key={g.parent} className="border-t border-line py-2">
                      {g.parent} → {g.child} ({g.type})
                    </li>
                  ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Objek utama"
        title="Batch & mutu"
        description="Setiap panen menjadi batch. Mutu, umur simpan, dan stok mengikuti batch, bukan hanya komoditas."
      />
      <DataTable
        rows={batches.filter((b) => b.source.includes("Sumber Rejeki"))}
        onRowClick={(r) => router.push(`/producer/batch/${r.code}`)}
        mobileTitle={(r) => r.code}
        mobileSubtitle={(r) => `${r.variety} · ${formatKg(r.availableKg)}`}
        mobileBadge={(r) => r.grade}
        columns={[
          { key: "code", label: "Batch" },
          { key: "variety", label: "Varietas" },
          { key: "grade", label: "Grade" },
          { key: "availableKg", label: "Tersedia", render: (r) => formatKg(r.availableKg) },
          { key: "shelfDays", label: "Sisa umur", render: (r) => `${r.shelfDays} hari` },
          {
            key: "status",
            label: "Status",
            render: (r) => <Badge tone={r.status}>{r.status.replaceAll("_", " ")}</Badge>,
          },
        ]}
      />
    </div>
  );
}

export function ProducerStok() {
  const mine = inventory.filter((i) => i.warehouse.includes("Packhouse") || i.warehouse.includes("Pace"));
  return (
    <div className="space-y-6">
      <PageHeader
        kicker="FEFO"
        title="Stok"
        description="Keluar berdasarkan yang paling dulu kedaluwarsa. Waspadai stok lambat dan rusak."
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Tersedia" value={formatKg(1230)} />
        <Kpi label="Reserved" value={formatKg(800)} />
        <Kpi label="Rusak" value="52 kg" tone="clay" />
        <Kpi label="Mendekati expired" value="210 kg" tone="gold" />
      </div>
      <AlertCard
        title="210 kg semangka Inul sisa 5 hari."
        body="Prioritaskan FEFO atau turunkan harga listing sebelum menjadi waste."
        actionLabel="Buat listing"
        href="/producer/pasar"
      />
      <DataTable
        rows={mine}
        mobileTitle={(r) => r.batchCode}
        mobileSubtitle={(r) => r.commodity}
        columns={[
          { key: "batchCode", label: "Batch" },
          { key: "warehouse", label: "Lokasi" },
          { key: "available", label: "Available", render: (r) => formatKg(r.available) },
          { key: "reserved", label: "Reserved", render: (r) => formatKg(r.reserved) },
          { key: "shelfDays", label: "Sisa umur", render: (r) => `${r.shelfDays} hari` },
        ]}
      />
    </div>
  );
}

export function ProducerPasar() {
  const { listings, addListing } = useStore();
  const [open, setOpen] = useState(false);
  const mine = listings.filter((l) => l.seller.includes("Sumber Rejeki"));
  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Supply"
        title="Pasar"
        description="Tayangkan batch ke aggregator, distributor, dan pembeli. Atur MOQ, harga, dan tanggal siap."
        actions={<Button onClick={() => setOpen(true)}>Buat listing</Button>}
      />
      <div className="grid gap-3">
        {mine.map((item) => (
          <Card key={item.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-2xl text-forest">{item.commodity}</h2>
                <Badge tone={item.status}>{item.status}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted">
                {item.batchCode} · {formatKg(item.quantityKg)} · MOQ {formatKg(item.minOrderKg)} · {formatRp(item.price)}/kg
              </p>
            </div>
            <p className="text-sm text-muted">Siap {formatDate(item.readyDate)}</p>
          </Card>
        ))}
      </div>
      <Modal open={open} title="Listing baru" onClose={() => setOpen(false)}>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            addListing({
              batchCode: "RN-MEL-20261027-002",
              seller: "Kebun Melon Sumber Rejeki",
              commodity: "Melon Musk Premium",
              grade: "A",
              quantityKg: 200,
              minOrderKg: 50,
              price: 23500,
              readyDate: "2026-10-29",
              location: "Nganjuk, Jawa Timur",
            });
            setOpen(false);
          }}
        >
          <p className="text-sm text-muted">
            Batch RN-MEL-20261027-002 · 200 kg @ Rp 23.500
          </p>
          <Button type="submit" className="w-full">
            Tayangkan
          </Button>
        </form>
      </Modal>
    </div>
  );
}

export function ProducerPesanan({ id }: { id?: string }) {
  const router = useRouter();
  const { orders, setOrderStatus } = useStore();
  const mine = orders.filter((o) => o.seller.includes("Sumber Rejeki"));
  const selected = mine.find((o) => o.number === id);
  if (selected) {
    return (
      <div className="space-y-6">
        <PageHeader
          kicker={selected.buyer}
          title={selected.number}
          description={`${selected.commodity} · ${formatKg(selected.quantityKg)} · ${formatRp(selected.total)}`}
        />
        <Card>
          <p className="text-sm text-muted">Batch {selected.batchCode} sudah direservasi saat konfirmasi.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => setOrderStatus(selected.id, "CONFIRMED")}>Terima</Button>
            <Button variant="secondary" onClick={() => setOrderStatus(selected.id, "NEGOTIATION")}>
              Negosiasi
            </Button>
            <Button variant="danger" onClick={() => setOrderStatus(selected.id, "CANCELLED")}>
              Tolak
            </Button>
            <Button href="/producer/pengiriman" variant="gold">
              Siapkan pengiriman
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <PageHeader title="Pesanan masuk" description="Terima, negosiasi, atau tolak. Stok direservasi saat dikonfirmasi." />
      <DataTable
        rows={mine}
        onRowClick={(r) => router.push(`/producer/pesanan/${r.number}`)}
        mobileTitle={(r) => r.number}
        mobileSubtitle={(r) => `${r.buyer} · ${formatRp(r.total)}`}
        mobileBadge={(r) => r.status}
        columns={[
          { key: "number", label: "Nomor" },
          { key: "buyer", label: "Pembeli" },
          { key: "commodity", label: "Komoditas" },
          { key: "quantityKg", label: "Qty", render: (r) => formatKg(r.quantityKg) },
          { key: "total", label: "Total", render: (r) => formatRp(r.total) },
          {
            key: "status",
            label: "Status",
            render: (r) => <Badge tone={r.status}>{r.status}</Badge>,
          },
        ]}
      />
    </div>
  );
}

export function ProducerPengiriman() {
  return (
    <div className="space-y-6">
      <PageHeader title="Pengiriman" description="Surat jalan, armada, dan bukti serah terima terikat ke batch." />
      {shipments.map((s) => (
        <Card key={s.id}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-moss">{s.number}</p>
              <h2 className="font-display text-2xl text-forest">{s.destination}</h2>
              <p className="mt-1 text-sm text-muted">
                {s.vehicle} · {s.driver} · {formatKg(s.quantityKg)}
              </p>
            </div>
            <Badge tone={s.status}>{s.status.replaceAll("_", " ")}</Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function ProducerKeuangan() {
  const mine = invoices.filter((i) => i.number !== "INV-26036");
  const outstanding = mine
    .filter((i) => i.status !== "Lunas")
    .reduce((s, i) => s + i.amount, 0);
  return (
    <div className="space-y-6">
      <PageHeader title="Keuangan" description="MVP hanya invoice, status bayar, dan piutang." />
      <div className="grid grid-cols-2 gap-3">
        <Kpi label="Piutang" value={formatRp(outstanding)} tone="gold" />
        <Kpi label="Penjualan tercatat" value={formatRp(31800000)} />
      </div>
      <DataTable
        rows={mine}
        mobileTitle={(r) => r.number}
        mobileSubtitle={(r) => r.counterparty}
        mobileBadge={(r) => r.status}
        columns={[
          { key: "number", label: "Invoice" },
          { key: "counterparty", label: "Pembeli" },
          { key: "amount", label: "Nilai", render: (r) => formatRp(r.amount) },
          { key: "due", label: "Jatuh tempo", render: (r) => formatDate(r.due) },
          {
            key: "status",
            label: "Status",
            render: (r) => <Badge tone={r.status}>{r.status}</Badge>,
          },
        ]}
      />
    </div>
  );
}

export function ProducerJejak({ q }: { q?: string }) {
  const code = q || "RN-MEL-20261025-001";
  const events = useMemo(
    () => traceEvents.filter((e) => e.batchCode === code),
    [code],
  );
  return (
    <div className="space-y-6">
      <PageHeader
        title="Keterlacakan"
        description="Lihat perjalanan batch dari kebun sampai pembeli."
      />
      <Card>
        <p className="font-mono text-sm text-moss">{code}</p>
        <div className="mt-4">
          <Timeline
            items={(events.length ? events : traceEvents.slice(0, 3)).map((e) => ({
              title: e.type.replaceAll("_", " "),
              meta: `${e.location} · ${e.org}`,
              note: e.note,
            }))}
          />
        </div>
      </Card>
    </div>
  );
}
