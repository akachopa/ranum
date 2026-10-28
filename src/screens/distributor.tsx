"use client";

import {
  AlertCard,
  Badge,
  BarList,
  Button,
  Card,
  Kpi,
  PageHeader,
  Timeline,
} from "@/components/ui";
import { DataTable } from "@/components/table";
import { invoices, orders, quotations, shipments, suppliers, traceEvents } from "@/lib/seed";
import { formatKg, formatRp } from "@/lib/format";
import { useStore } from "@/lib/store";

export function DistributorDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Nusantara Segar"
        title="Pengadaan, gudang, dan pemenuhan"
        description="Deteksi shortage, jaga kesegaran, dan kirim tepat waktu ke buyer."
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Stok melon A" value="1,8 t" />
        <Kpi label="Shortage 7 hari" value="450 kg" tone="clay" />
        <Kpi label="OTIF 30 hari" value="94%" />
        <Kpi label="Waste" value="1,2%" tone="gold" />
      </div>
      <AlertCard
        title="450 kg melon harus didistribusikan maksimal 2 hari lagi."
        body="Gunakan FEFO ke SuperFresh atau tawarkan ke Arcadia sebagai additional drop."
        actionLabel="Buka inventori"
        href="/distributor/inventory"
      />
    </div>
  );
}

export function DistributorSupplier() {
  return (
    <div className="space-y-6">
      <PageHeader title="Pemasok" description="Aggregator dan produsen langsung yang memasok gudang Surabaya." />
      <DataTable
        rows={suppliers}
        mobileTitle={(r) => r.name}
        mobileSubtitle={(r) => r.commodity}
        columns={[
          { key: "name", label: "Organisasi" },
          { key: "type", label: "Tipe" },
          { key: "overall", label: "Skor" },
          { key: "onTime", label: "On-time", render: (r) => `${r.onTime}%` },
          { key: "reject", label: "Reject", render: (r) => `${r.reject}%` },
        ]}
      />
    </div>
  );
}

export function DistributorProcurement() {
  const { notify } = useStore();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengadaan"
        description="Permintaan buyer → cek stok → shortage → RFQ pemasok → bandingkan quotation → PO."
      />
      <Card>
        <h2 className="font-display text-xl text-forest">Shortage terdeteksi</h2>
        <p className="mt-1 text-sm text-muted">
          Permintaan Arcadia 500 kg/minggu vs stok available 320 kg. Gap 180 kg.
        </p>
        <Button className="mt-4" onClick={() => notify("RFQ ke Koperasi Tani RANUM Jatim dikirim")}>
          Kirim RFQ pemasok
        </Button>
      </Card>
      <DataTable
        rows={quotations}
        mobileTitle={(r) => r.seller}
        mobileSubtitle={(r) => formatRp(r.price)}
        columns={[
          { key: "seller", label: "Pemasok" },
          { key: "price", label: "Harga", render: (r) => formatRp(r.price) },
          { key: "quantityKg", label: "Qty", render: (r) => formatKg(r.quantityKg) },
          { key: "validity", label: "Berlaku" },
          { key: "status", label: "Status", render: (r) => <Badge tone={r.status}>{r.status}</Badge> },
        ]}
      />
    </div>
  );
}

export function DistributorReceiving() {
  return (
    <div className="space-y-6">
      <PageHeader title="Penerimaan" description="PO → kedatangan → scan batch → timbang → QC → gudang." />
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-moss">PO-26044</p>
            <h2 className="font-display text-2xl text-forest">Melon Grade A · 550 kg</h2>
            <p className="text-sm text-muted">ETA 29 Okt 03.30 · reefer L 1908 SS</p>
          </div>
          <Badge tone="warn">IN TRANSIT</Badge>
        </div>
      </Card>
    </div>
  );
}

export function DistributorWarehouse() {
  const zones = [
    { id: "z1", name: "Cold A", temp: "8°C", cap: "12 t", used: "7,4 t" },
    { id: "z2", name: "Cold B", temp: "10°C", cap: "8 t", used: "3,1 t" },
    { id: "z3", name: "Staging", temp: "18°C", cap: "4 t", used: "0,6 t" },
  ];
  return (
    <div className="space-y-6">
      <PageHeader title="Gudang Surabaya" description="Zona, rak, cold storage, dan kapasitas." />
      <div className="grid gap-3 sm:grid-cols-3">
        {zones.map((z) => (
          <Card key={z.id}>
            <p className="text-xs uppercase tracking-wide text-moss">{z.temp}</p>
            <h2 className="font-display text-2xl text-forest">{z.name}</h2>
            <p className="mt-2 text-sm text-muted">
              Terpakai {z.used} dari {z.cap}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function DistributorInventory() {
  return (
    <div className="space-y-6">
      <PageHeader title="Inventori" description="Per komoditas, batch, grade, kesegaran, dan reserved." />
      <AlertCard
        tone="warn"
        title="450 kg melon harus didistribusikan maksimal 2 hari lagi."
        body="Aging 12 hari, sisa umur simpan 2 hari. Jangan campur dengan lot baru."
      />
      <BarList
        unit="kg"
        items={[
          { label: "Melon A", value: 1800 },
          { label: "Melon B", value: 240 },
          { label: "Semangka A", value: 900 },
          { label: "Reserved", value: 620 },
        ]}
      />
    </div>
  );
}

export function DistributorSales() {
  return (
    <div className="space-y-6">
      <PageHeader title="Penjualan" description="Quotation, sales order, daftar harga, dan pesanan berulang." />
      <DataTable
        rows={orders.filter((o) => o.seller.includes("Nusantara") || o.buyer.includes("Nusantara"))}
        mobileTitle={(r) => r.number}
        mobileSubtitle={(r) => r.buyer}
        columns={[
          { key: "number", label: "SO / PO" },
          { key: "buyer", label: "Pembeli" },
          { key: "commodity", label: "Komoditas" },
          { key: "total", label: "Nilai", render: (r) => formatRp(r.total) },
          { key: "status", label: "Status", render: (r) => <Badge tone={r.status}>{r.status}</Badge> },
        ]}
      />
    </div>
  );
}

export function DistributorBuyer() {
  const buyers = [
    { id: "b1", name: "Arcadia Hospitality Group", cat: "Hotel", sla: "Sebelum 05.00", spend: 8320000 },
    { id: "b2", name: "SuperFresh Retail", cat: "Retail", sla: "DC Sidoarjo 22.00", spend: 21400000 },
    { id: "b3", name: "Dapur MBG Jawa Timur", cat: "MBG", sla: "3x seminggu", spend: 9800000 },
  ];
  return (
    <div className="space-y-6">
      <PageHeader title="Pembeli" description="Kategori, kebutuhan berulang, SLA, dan perjanjian harga." />
      <div className="grid gap-3 md:grid-cols-2">
        {buyers.map((b) => (
          <Card key={b.id}>
            <p className="text-xs uppercase tracking-wide text-moss">{b.cat}</p>
            <h2 className="font-display text-2xl text-forest">{b.name}</h2>
            <p className="mt-2 text-sm text-muted">SLA {b.sla}</p>
            <p className="mt-1 text-sm">Belanja 30 hari {formatRp(b.spend)}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function DistributorFulfillment() {
  const steps = ["Sales Order", "Reserve", "Picking", "Packing", "QC", "Dispatch"];
  return (
    <div className="space-y-6">
      <PageHeader title="Pemenuhan" description="SO-26036 sudah selesai. SO-26041 menunggu dispatch malam ini." />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
        {steps.map((s, i) => (
          <div key={s} className={`rounded-xl p-3 text-center text-xs font-semibold ${i < 4 ? "bg-mint text-leaf" : "bg-cream text-muted"}`}>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DistributorDelivery() {
  return (
    <div className="space-y-6">
      <PageHeader title="Pengiriman" description="Rute Surabaya–hotel/retail. Optimasi rute menyusul di fase berikutnya." />
      {shipments.map((s) => (
        <Card key={s.id}>
          <div className="flex flex-wrap justify-between gap-3">
            <div>
              <h2 className="font-display text-xl text-forest">{s.number}</h2>
              <p className="text-sm text-muted">
                {s.vehicle} · {s.driver}
              </p>
            </div>
            <Badge tone={s.status}>{s.status.replaceAll("_", " ")}</Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function DistributorReturn() {
  const rows = [
    {
      id: "rt-1",
      order: "SO-26029",
      reason: "quality mismatch",
      batch: "RN-DST-20261012-003",
      qty: 24,
      status: "QC",
    },
  ];
  return (
    <div className="space-y-6">
      <PageHeader title="Retur" description="Setiap retur wajib mengacu ke batch: rusak, mismatch, salah qty, telat, salah produk." />
      <DataTable
        rows={rows}
        mobileTitle={(r) => r.order}
        mobileSubtitle={(r) => r.reason}
        columns={[
          { key: "order", label: "Order" },
          { key: "batch", label: "Batch" },
          { key: "reason", label: "Alasan" },
          { key: "qty", label: "Qty", render: (r) => formatKg(r.qty) },
          { key: "status", label: "Status", render: (r) => <Badge>{r.status}</Badge> },
        ]}
      />
    </div>
  );
}

export function DistributorFinance() {
  return (
    <div className="space-y-6">
      <PageHeader title="Keuangan" description="Invoice, piutang, hutang, pembayaran, outstanding." />
      <div className="grid grid-cols-2 gap-3">
        <Kpi label="Piutang" value={formatRp(21400000)} />
        <Kpi label="Hutang pemasok" value={formatRp(11825000)} tone="clay" />
      </div>
      <DataTable
        rows={invoices}
        mobileTitle={(r) => r.number}
        mobileSubtitle={(r) => formatRp(r.amount)}
        columns={[
          { key: "number", label: "Invoice" },
          { key: "counterparty", label: "Pihak" },
          { key: "amount", label: "Nilai", render: (r) => formatRp(r.amount) },
          { key: "status", label: "Status", render: (r) => <Badge tone={r.status}>{r.status}</Badge> },
        ]}
      />
    </div>
  );
}

export function DistributorJejak() {
  return (
    <div className="space-y-6">
      <PageHeader title="Keterlacakan" description="Produsen → aggregator → receiving → gudang → shipment → buyer." />
      <Card>
        <Timeline
          items={traceEvents.map((e) => ({
            title: e.type.replaceAll("_", " "),
            meta: e.location,
            note: e.note,
          }))}
        />
      </Card>
    </div>
  );
}

export function DistributorAnalytics() {
  return (
    <div className="space-y-6">
      <PageHeader title="Analitik" description="Turnover, waste, fill rate, OTIF, kinerja pemasok, profitabilitas buyer." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Kpi label="Inventory turnover" value="14x" />
        <Kpi label="Fill rate" value="96%" />
        <Kpi label="OTIF" value="94%" />
        <Kpi label="Waste rate" value="1,2%" tone="gold" />
        <Kpi label="Lead time rata-rata" value="18 jam" />
        <Kpi label="GMV 30 hari" value={formatRp(186000000)} />
      </div>
    </div>
  );
}
