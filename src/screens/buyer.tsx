"use client";

import { useMemo, useState } from "react";
import {
  AlertCard,
  Badge,
  Button,
  Card,
  Field,
  inputClass,
  Kpi,
  Modal,
  PageHeader,
  Timeline,
} from "@/components/ui";
import { DataTable } from "@/components/table";
import { invoices, listings, orders, quotations, rfqs, shipments, suppliers, traceEvents } from "@/lib/seed";
import { formatDate, formatKg, formatRp } from "@/lib/format";
import { useStore } from "@/lib/store";

export function BuyerDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Arcadia Hospitality"
        title="Pasokan dapur hotel"
        description="RFQ terbuka, pengiriman malam ini, dan pembelanjaan bulan berjalan."
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="RFQ terbuka" value="1" />
        <Kpi label="Pesanan aktif" value="2" />
        <Kpi label="Kiriman segera" value="800 kg" tone="gold" />
        <Kpi label="Belanja Oktober" value={formatRp(27520000)} />
      </div>
      <AlertCard
        title="SO-26041 tiba dini hari, 29 Oktober."
        body="800 kg Melon Musk Premium, batch RN-MEL-20261025-001. Siapkan QC penerimaan."
        actionLabel="Buka penerimaan"
        href="/buyer/penerimaan"
      />
    </div>
  );
}

export function BuyerPasar() {
  const [q, setQ] = useState("");
  const [grade, setGrade] = useState("Semua");
  const rows = useMemo(
    () =>
      listings.filter((l) => {
        const text = `${l.commodity} ${l.location} ${l.seller}`.toLowerCase();
        const okQ = text.includes(q.toLowerCase());
        const okG = grade === "Semua" || l.grade === grade;
        return okQ && okG && l.status === "Published";
      }),
    [q, grade],
  );
  const { notify } = useStore();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketplace"
        description="Cari berdasarkan komoditas, grade, lokasi, tanggal siap, volume, dan harga."
      />
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          className={inputClass}
          placeholder="Cari melon, semangka, Nganjuk..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className={inputClass} value={grade} onChange={(e) => setGrade(e.target.value)}>
          <option>Semua</option>
          <option>A</option>
          <option>B</option>
        </select>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {rows.map((item) => (
          <Card key={item.id}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-moss">{item.seller}</p>
                <h2 className="font-display text-2xl text-forest">{item.commodity}</h2>
              </div>
              <Badge>Grade {item.grade}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted">
              {formatKg(item.quantityKg)} · MOQ {formatKg(item.minOrderKg)} · {item.location}
            </p>
            <p className="mt-1 font-display text-2xl text-forest">{formatRp(item.price)}/kg</p>
            <p className="text-xs text-muted">Siap {formatDate(item.readyDate)}</p>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => notify(`Permintaan order ${item.commodity} dikirim`)}>Order</Button>
              <Button href="/buyer/rfq" variant="secondary">
                Buat RFQ
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function BuyerRfq() {
  const [open, setOpen] = useState(false);
  const { notify } = useStore();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Permintaan / RFQ"
        description="Contoh: Melon Grade A, 500 kg/minggu, 3 bulan, kirim setiap Senin."
        actions={<Button onClick={() => setOpen(true)}>Buat RFQ</Button>}
      />
      {rfqs.map((r) => (
        <Card key={r.id}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-moss">{r.id}</p>
              <h2 className="font-display text-2xl text-forest">
                {r.commodity} Grade {r.grade}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {r.duration} · {r.delivery} · target {formatRp(r.targetPrice)}/kg
              </p>
            </div>
            <Badge tone={r.status}>{r.status}</Badge>
          </div>
          <div className="mt-4 space-y-2">
            {quotations
              .filter((q) => q.rfqId === r.id)
              .map((q) => (
                <div key={q.id} className="flex items-center justify-between rounded-xl bg-cream px-3 py-2 text-sm">
                  <span>{q.seller}</span>
                  <span className="font-semibold">{formatRp(q.price)}/kg</span>
                </div>
              ))}
          </div>
        </Card>
      ))}
      <Modal open={open} title="RFQ baru" onClose={() => setOpen(false)}>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            notify("RFQ melon 500 kg/minggu dikirim ke pemasok");
            setOpen(false);
          }}
        >
          <Field label="Komoditas">
            <input className={inputClass} defaultValue="Melon" />
          </Field>
          <Field label="Volume">
            <input className={inputClass} defaultValue="500 kg / minggu" />
          </Field>
          <Button type="submit" className="w-full">
            Kirim ke pemasok
          </Button>
        </form>
      </Modal>
    </div>
  );
}

export function BuyerSupplier() {
  return (
    <div className="space-y-6">
      <PageHeader title="Pemasok" description="Rating mutu, reject, pemenuhan, dan jejak transaksi." />
      <DataTable
        rows={suppliers}
        mobileTitle={(r) => r.name}
        mobileSubtitle={(r) => `skor ${r.overall}`}
        columns={[
          { key: "name", label: "Pemasok" },
          { key: "quality", label: "Mutu", render: (r) => `${r.quality}%` },
          { key: "reject", label: "Reject", render: (r) => `${r.reject}%` },
          { key: "onTime", label: "Fulfillment", render: (r) => `${r.onTime}%` },
          { key: "overall", label: "Skor" },
        ]}
      />
    </div>
  );
}

export function BuyerPesanan() {
  const mine = orders.filter((o) => o.buyer.includes("Arcadia"));
  return (
    <div className="space-y-6">
      <PageHeader title="Pesanan" description="Marketplace / RFQ → PO → konfirmasi → kirim → terima → penerimaan." />
      <DataTable
        rows={mine}
        mobileTitle={(r) => r.number}
        mobileSubtitle={(r) => r.seller}
        mobileBadge={(r) => r.status}
        columns={[
          { key: "number", label: "Nomor" },
          { key: "seller", label: "Penjual" },
          { key: "commodity", label: "Komoditas" },
          { key: "quantityKg", label: "Qty", render: (r) => formatKg(r.quantityKg) },
          { key: "status", label: "Status", render: (r) => <Badge tone={r.status}>{r.status}</Badge> },
        ]}
      />
    </div>
  );
}

export function BuyerKontrak() {
  return (
    <div className="space-y-6">
      <PageHeader title="Kontrak pasok" description="Pengadaan berulang: volume, frekuensi, harga, jadwal, pemasok." />
      <Card>
        <p className="text-xs uppercase tracking-wide text-moss">CTR-2601</p>
        <h2 className="font-display text-2xl text-forest">Melon Grade A · 500 kg/minggu</h2>
        <p className="mt-2 text-sm text-muted">
          3 bulan · setiap Senin · Rp 22.000/kg · Koperasi Tani RANUM Jatim
        </p>
        <Badge tone="good">Aktif</Badge>
      </Card>
    </div>
  );
}

export function BuyerPenerimaan() {
  const { notify } = useStore();
  return (
    <div className="space-y-6">
      <PageHeader title="Penerimaan" description="Scan QR, verifikasi batch, timbang, cek qty, QC, terima/parsial/tolak." />
      {shipments
        .filter((s) => s.orderNumber === "SO-26041" || s.destination.includes("Arcadia"))
        .map((s) => (
          <Card key={s.id}>
            <h2 className="font-display text-2xl text-forest">{s.number}</h2>
            <p className="text-sm text-muted">
              {formatKg(s.quantityKg)} · {s.status.replaceAll("_", " ")}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => notify("Penerimaan ACCEPTED 800 kg")}>Terima</Button>
              <Button variant="secondary" onClick={() => notify("Penerimaan PARTIAL")}>
                Parsial
              </Button>
              <Button variant="danger" onClick={() => notify("Penerimaan REJECTED — alasan wajib")}>
                Tolak
              </Button>
            </div>
          </Card>
        ))}
    </div>
  );
}

export function BuyerQc() {
  return (
    <div className="space-y-6">
      <PageHeader title="QC pembeli" description="ACCEPTED, PARTIAL_ACCEPTED, atau REJECTED. Penolakan wajib beralasan." />
      <Card>
        <h2 className="font-display text-xl text-forest">RN-MEL-20261025-001</h2>
        <p className="text-sm text-muted">Menunggu inspeksi saat barang tiba 29 Oktober.</p>
        <p className="mt-3 text-sm">Spesifikasi Arcadia: 1,6–2,2 kg, defect ≤ 1,5%, maturity 84–88%.</p>
      </Card>
    </div>
  );
}

export function BuyerJejak() {
  return (
    <div className="space-y-6">
      <PageHeader title="Keterlacakan" description="Scan QR untuk melihat kebun, panen, mutu, dan perjalanan batch." />
      <Card>
        <Timeline
          items={traceEvents.map((e) => ({
            title: e.type.replaceAll("_", " "),
            meta: e.location,
            note: e.note,
          }))}
        />
        <Button href="/jejak/RN-MEL-20261025-001" className="mt-2">
          Buka halaman publik
        </Button>
      </Card>
    </div>
  );
}

export function BuyerInvoice() {
  const mine = invoices.filter((i) => i.counterparty.includes("Arcadia") || i.number === "INV-26036");
  return (
    <div className="space-y-6">
      <PageHeader title="Invoice" description="Jatuh tempo, nilai, status, dan unduh." />
      <DataTable
        rows={mine}
        mobileTitle={(r) => r.number}
        mobileSubtitle={(r) => formatRp(r.amount)}
        mobileBadge={(r) => r.status}
        columns={[
          { key: "number", label: "Nomor" },
          { key: "orderNumber", label: "Order" },
          { key: "amount", label: "Nilai", render: (r) => formatRp(r.amount) },
          { key: "due", label: "Jatuh tempo", render: (r) => formatDate(r.due) },
          { key: "status", label: "Status", render: (r) => <Badge tone={r.status}>{r.status}</Badge> },
        ]}
      />
    </div>
  );
}

export function BuyerLaporan() {
  return (
    <div className="space-y-6">
      <PageHeader title="Laporan" description="Pembelian, pemasok, mutu, reject, komoditas, dan belanja." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Kpi label="Pembelian Oktober" value={formatRp(27520000)} />
        <Kpi label="Reject" value="0,4%" />
        <Kpi label="Pemasok aktif" value="3" />
      </div>
    </div>
  );
}
