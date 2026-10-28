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
import {
  batches,
  genealogy,
  harvestPlans,
  inventory,
  invoices,
  listings,
  orders,
  quotations,
  rfqs,
  shipments,
  suppliers,
  traceEvents,
} from "@/lib/seed";
import { formatDate, formatKg, formatRp } from "@/lib/format";
import { useStore } from "@/lib/store";

export function AggregatorDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Collection center"
        title="Pasok masuk dan mutu hari ini"
        description="Pantau pemasok, penerimaan, waste, dan pesanan buyer dalam satu layar tindakan."
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Pemasok aktif" value="8" />
        <Kpi label="Pasok 14 hari" value="24,8 t" hint="Termasuk future harvest" />
        <Kpi label="Penerimaan hari ini" value="1,2 t" />
        <Kpi label="Reject 7 hari" value="2,1%" tone="clay" />
      </div>
      <AlertCard
        title="1.000 kg batch gabungan Grade A siap dijual."
        body="450 kg masih available. Cocokkan dengan RFQ Arcadia 500 kg/minggu."
        actionLabel="Buka marketplace"
        href="/aggregator/pasar"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-xl text-forest">Stok per grade</h2>
          <div className="mt-4">
            <BarList
              unit="kg"
              items={[
                { label: "Grade A", value: 1090 },
                { label: "Grade B", value: 210 },
                { label: "Reject/waste", value: 58 },
              ]}
            />
          </div>
        </Card>
        <Card>
          <h2 className="font-display text-xl text-forest">Kinerja pemasok</h2>
          <ul className="mt-3 space-y-3">
            {suppliers.map((s) => (
              <li key={s.id} className="flex items-center justify-between text-sm">
                <span>{s.name}</span>
                <Badge tone="good">{s.overall}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

export function AggregatorSupplier() {
  return (
    <div className="space-y-6">
      <PageHeader title="Pemasok" description="Profil produsen, volume historis, mutu, dan skor." />
      <div className="grid gap-3 md:grid-cols-2">
        {suppliers.map((s) => (
          <Card key={s.id}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-moss">{s.type}</p>
                <h2 className="font-display text-2xl text-forest">{s.name}</h2>
                <p className="text-sm text-muted">{s.commodity}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-3xl text-leaf">{s.overall}</p>
                <p className="text-xs text-muted">skor</p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-xl bg-cream py-2">
                <dt className="text-muted">Mutu</dt>
                <dd className="font-semibold">{s.quality}%</dd>
              </div>
              <div className="rounded-xl bg-cream py-2">
                <dt className="text-muted">On-time</dt>
                <dd className="font-semibold">{s.onTime}%</dd>
              </div>
              <div className="rounded-xl bg-cream py-2">
                <dt className="text-muted">Reject</dt>
                <dd className="font-semibold">{s.reject}%</dd>
              </div>
            </dl>
            <p className="mt-3 text-sm text-muted">Volume 30 hari: {formatKg(s.volumeKg)}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AggregatorSupplyPlan() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Rencana pasok"
        description="Ambil data rencana panen produsen, lalu cocokkan dengan permintaan buyer."
      />
      <AlertCard
        tone="info"
        title="800 kg Honeydew Bagor belum terpasangkan."
        body="Tidak ada RFQ yang menutupi volume ini pada 31 Oktober."
        actionLabel="Lihat RFQ"
        href="/aggregator/pasar"
      />
      <DataTable
        rows={harvestPlans.map((p) => ({ ...p }))}
        mobileTitle={(r) => r.commodity}
        mobileSubtitle={(r) => `${r.farm} · ${formatKg(r.volumeKg)}`}
        columns={[
          { key: "date", label: "Tanggal", render: (r) => formatDate(r.date) },
          { key: "farm", label: "Pemasok" },
          { key: "commodity", label: "Komoditas" },
          { key: "volumeKg", label: "Forecast", render: (r) => formatKg(r.volumeKg) },
          { key: "grade", label: "Grade" },
          {
            key: "published",
            label: "Status",
            render: (r) => (
              <Badge tone={r.published ? "good" : "warn"}>
                {r.published ? "Visible" : "Internal"}
              </Badge>
            ),
          },
        ]}
      />
    </div>
  );
}

export function AggregatorPenerimaan() {
  const { notify } = useStore();
  const rows = [
    {
      id: "rcv-14",
      supplier: "Kebun Melon Sumber Rejeki",
      batch: "RN-SMK-20261018-008",
      shipped: 1800,
      received: 1760,
      variance: -40,
      result: "PARTIAL",
    },
    {
      id: "rcv-15",
      supplier: "Poktan Melon Magetan",
      batch: "RN-MEL-20261024-B",
      shipped: 400,
      received: 400,
      variance: 0,
      result: "ACCEPTED",
    },
  ];
  return (
    <div className="space-y-6">
      <PageHeader
        title="Penerimaan"
        description="Scan batch, timbang, verifikasi kuantitas, QC awal, lalu terima / parsial / tolak."
      />
      <DataTable
        rows={rows}
        mobileTitle={(r) => r.supplier}
        mobileSubtitle={(r) => r.batch}
        mobileBadge={(r) => r.result}
        columns={[
          { key: "supplier", label: "Pemasok" },
          { key: "batch", label: "Batch sumber" },
          { key: "shipped", label: "Dikirim", render: (r) => formatKg(r.shipped) },
          { key: "received", label: "Diterima", render: (r) => formatKg(r.received) },
          { key: "variance", label: "Selisih", render: (r) => `${r.variance} kg` },
          {
            key: "result",
            label: "Hasil",
            render: (r) => <Badge tone={r.result}>{r.result}</Badge>,
          },
        ]}
      />
      <Button onClick={() => notify("Penerimaan RCV-16 dicatat: 300 kg ACCEPTED")}>
        Catat penerimaan baru
      </Button>
    </div>
  );
}

export function AggregatorQc() {
  const { notify } = useStore();
  return (
    <div className="space-y-6">
      <PageHeader title="QC & grading" description="Grade, ukuran, kematangan, warna, cacat, dan keputusan lot." />
      <Card>
        <h2 className="font-display text-2xl text-forest">Lot hari ini · 1.000 kg</h2>
        <p className="text-sm text-muted">Gabungan 3 produsen, menunggu keputusan akhir.</p>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted">Grade</dt>
            <dd className="font-display text-2xl">A</dd>
          </div>
          <div>
            <dt className="text-muted">Maturity</dt>
            <dd>84%</dd>
          </div>
          <div>
            <dt className="text-muted">Defect</dt>
            <dd>1,9%</dd>
          </div>
          <div>
            <dt className="text-muted">Diterima</dt>
            <dd>982 kg</dd>
          </div>
          <div>
            <dt className="text-muted">Ditolak</dt>
            <dd>18 kg</dd>
          </div>
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => notify("QC ACCEPTED untuk RN-AGG-20261026-014")}>Accepted</Button>
          <Button variant="secondary" onClick={() => notify("QC CONDITIONAL")}>
            Conditional
          </Button>
          <Button variant="danger" onClick={() => notify("QC REJECTED")}>
            Rejected
          </Button>
        </div>
      </Card>
    </div>
  );
}

export function AggregatorBatch() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Batch aggregator"
        description="Gabung atau pecah batch tanpa kehilangan silsilah. Contoh: 300+400+300 → 1.000 kg."
      />
      <Card>
        <h2 className="font-display text-2xl text-forest">RN-AGG-20261026-014</h2>
        <p className="text-sm text-muted">Hasil MERGE · {formatKg(1000)} · Grade A</p>
        <ul className="mt-4 space-y-2 text-sm">
          {genealogy.map((g) => (
            <li key={g.parent} className="flex justify-between rounded-xl bg-cream px-3 py-2">
              <span>
                {g.parent} · {g.producer}
              </span>
              <span className="font-medium">{formatKg(g.quantity)}</span>
            </li>
          ))}
        </ul>
      </Card>
      <DataTable
        rows={batches.filter((b) => b.owner.includes("Koperasi"))}
        mobileTitle={(r) => r.code}
        mobileSubtitle={(r) => r.variety}
        columns={[
          { key: "code", label: "Batch" },
          { key: "grade", label: "Grade" },
          { key: "availableKg", label: "Tersedia", render: (r) => formatKg(r.availableKg) },
          { key: "status", label: "Status", render: (r) => <Badge tone={r.status}>{r.status}</Badge> },
        ]}
      />
    </div>
  );
}

export function AggregatorInventory() {
  return (
    <div className="space-y-6">
      <PageHeader title="Inventori" description="Gudang collection center, lokasi, aging, dan waste." />
      <DataTable
        rows={inventory.filter((i) => i.warehouse.includes("CC"))}
        mobileTitle={(r) => r.batchCode}
        mobileSubtitle={(r) => r.warehouse}
        columns={[
          { key: "batchCode", label: "Batch" },
          { key: "warehouse", label: "Lokasi" },
          { key: "available", label: "Available", render: (r) => formatKg(r.available) },
          { key: "reserved", label: "Reserved", render: (r) => formatKg(r.reserved) },
          { key: "agingDays", label: "Aging", render: (r) => `${r.agingDays} hari` },
        ]}
      />
    </div>
  );
}

export function AggregatorPasar() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketplace dua sisi"
        description="Beli dari produsen, jual ke distributor dan buyer."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-xl text-forest">Beli dari produsen</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {listings
              .filter((l) => l.seller.includes("Sumber"))
              .map((l) => (
                <li key={l.id} className="rounded-xl border border-line p-3">
                  {l.commodity} · {formatKg(l.quantityKg)} · {formatRp(l.price)}/kg
                </li>
              ))}
          </ul>
        </Card>
        <Card>
          <h2 className="font-display text-xl text-forest">RFQ buyer</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {rfqs.map((r) => (
              <li key={r.id} className="rounded-xl border border-line p-3">
                <p className="font-medium">{r.id} · {r.buyer}</p>
                <p className="text-muted">
                  {r.commodity} {formatKg(r.quantityKg)} · target {formatRp(r.targetPrice)}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Card>
        <h2 className="font-display text-xl text-forest">Quotation terkirim</h2>
        <DataTable
          rows={quotations}
          mobileTitle={(r) => r.id}
          mobileSubtitle={(r) => r.seller}
          columns={[
            { key: "id", label: "ID" },
            { key: "rfqId", label: "RFQ" },
            { key: "seller", label: "Penjual" },
            { key: "price", label: "Harga", render: (r) => formatRp(r.price) },
            { key: "status", label: "Status", render: (r) => <Badge tone={r.status}>{r.status}</Badge> },
          ]}
        />
      </Card>
    </div>
  );
}

export function AggregatorPesanan() {
  const mine = orders.filter((o) => o.seller.includes("Koperasi") || o.buyer.includes("Koperasi"));
  return (
    <div className="space-y-6">
      <PageHeader title="Pesanan" description="Cek stok, reservasi, picking, packing, pengiriman." />
      <DataTable
        rows={mine}
        mobileTitle={(r) => r.number}
        mobileSubtitle={(r) => `${r.buyer} → ${r.seller}`}
        mobileBadge={(r) => r.status}
        columns={[
          { key: "number", label: "Nomor" },
          { key: "buyer", label: "Pembeli" },
          { key: "seller", label: "Penjual" },
          { key: "quantityKg", label: "Qty", render: (r) => formatKg(r.quantityKg) },
          { key: "status", label: "Status", render: (r) => <Badge tone={r.status}>{r.status}</Badge> },
        ]}
      />
    </div>
  );
}

export function AggregatorPengiriman() {
  return (
    <div className="space-y-6">
      <PageHeader title="Pengiriman" description="Armada koperasi dan tracking ke gudang distributor." />
      {shipments.map((s) => (
        <Card key={s.id} className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <div>
            <p className="font-display text-xl text-forest">{s.number}</p>
            <p className="text-sm text-muted">
              {s.destination} · {s.driver}
            </p>
          </div>
          <Badge tone={s.status}>{s.status.replaceAll("_", " ")}</Badge>
        </Card>
      ))}
    </div>
  );
}

export function AggregatorKeuangan() {
  return (
    <div className="space-y-6">
      <PageHeader title="Keuangan" description="Hutang beli ke produsen dan piutang jual ke buyer." />
      <div className="grid grid-cols-2 gap-3">
        <Kpi label="Payable" value={formatRp(12600000)} tone="clay" />
        <Kpi label="Receivable" value={formatRp(11825000)} tone="gold" />
      </div>
      <DataTable
        rows={invoices}
        mobileTitle={(r) => r.number}
        mobileSubtitle={(r) => r.counterparty}
        columns={[
          { key: "number", label: "Dokumen" },
          { key: "counterparty", label: "Mitra" },
          { key: "amount", label: "Nilai", render: (r) => formatRp(r.amount) },
          { key: "status", label: "Status", render: (r) => <Badge tone={r.status}>{r.status}</Badge> },
        ]}
      />
    </div>
  );
}

export function AggregatorJejak() {
  return (
    <div className="space-y-6">
      <PageHeader title="Keterlacakan" description="Produsen → batch sumber → batch aggregator → distributor/buyer." />
      <Card>
        <Timeline
          items={traceEvents.slice(0, 6).map((e) => ({
            title: e.type.replaceAll("_", " "),
            meta: e.org,
            note: e.note,
          }))}
        />
      </Card>
    </div>
  );
}

export function AggregatorLaporan() {
  return (
    <div className="space-y-6">
      <PageHeader title="Laporan" description="Pasok, pembelian, QC, reject, waste, penjualan, margin, kinerja pemasok." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["Pasok masuk", "54 t"],
          ["Pembelian", formatRp(186000000)],
          ["Reject", "2,1%"],
          ["Waste", "0,8%"],
          ["Penjualan", formatRp(214000000)],
          ["Margin", "13,1%"],
        ].map(([k, v]) => (
          <Kpi key={k} label={k} value={v} />
        ))}
      </div>
    </div>
  );
}
