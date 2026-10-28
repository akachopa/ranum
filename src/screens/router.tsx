"use client";

import { notFound } from "next/navigation";
import type { Role } from "@/lib/types";
import {
  ProducerBatch,
  ProducerBudidaya,
  ProducerDashboard,
  ProducerJejak,
  ProducerKebun,
  ProducerKeuangan,
  ProducerPanen,
  ProducerPasar,
  ProducerPengiriman,
  ProducerPesanan,
  ProducerRencana,
  ProducerStok,
} from "./producer";
import {
  AggregatorBatch,
  AggregatorDashboard,
  AggregatorInventory,
  AggregatorJejak,
  AggregatorKeuangan,
  AggregatorLaporan,
  AggregatorPasar,
  AggregatorPenerimaan,
  AggregatorPengiriman,
  AggregatorPesanan,
  AggregatorQc,
  AggregatorSupplier,
  AggregatorSupplyPlan,
} from "./aggregator";
import {
  DistributorAnalytics,
  DistributorBuyer,
  DistributorDashboard,
  DistributorDelivery,
  DistributorFinance,
  DistributorFulfillment,
  DistributorInventory,
  DistributorJejak,
  DistributorProcurement,
  DistributorReceiving,
  DistributorReturn,
  DistributorSales,
  DistributorSupplier,
  DistributorWarehouse,
} from "./distributor";
import {
  BuyerDashboard,
  BuyerInvoice,
  BuyerJejak,
  BuyerKontrak,
  BuyerLaporan,
  BuyerPasar,
  BuyerPenerimaan,
  BuyerPesanan,
  BuyerQc,
  BuyerRfq,
  BuyerSupplier,
} from "./buyer";
import {
  AdminAkses,
  AdminAnalitik,
  AdminAudit,
  AdminDashboard,
  AdminJejak,
  AdminKomoditas,
  AdminLangganan,
  AdminMutu,
  AdminOrganisasi,
  AdminPasar,
  AdminPengaturan,
  AdminProtokol,
  AdminSengketa,
  AdminTransaksi,
} from "./admin";

const roles: Role[] = [
  "producer",
  "aggregator",
  "distributor",
  "buyer",
  "admin",
];

export function ScreenRouter({
  role,
  slug,
  query,
}: {
  role: string;
  slug: string[];
  query?: string;
}) {
  if (!roles.includes(role as Role)) notFound();
  const [section, id] = slug;

  if (role === "producer") {
    if (!section) return <ProducerDashboard />;
    if (section === "kebun") return <ProducerKebun id={id} />;
    if (section === "budidaya") return <ProducerBudidaya />;
    if (section === "rencana-panen") return <ProducerRencana />;
    if (section === "panen") return <ProducerPanen />;
    if (section === "batch") return <ProducerBatch id={id} />;
    if (section === "stok") return <ProducerStok />;
    if (section === "pasar") return <ProducerPasar />;
    if (section === "pesanan") return <ProducerPesanan id={id} />;
    if (section === "pengiriman") return <ProducerPengiriman />;
    if (section === "keuangan") return <ProducerKeuangan />;
    if (section === "jejak") return <ProducerJejak q={query} />;
  }

  if (role === "aggregator") {
    if (!section) return <AggregatorDashboard />;
    if (section === "supplier") return <AggregatorSupplier />;
    if (section === "supply-plan") return <AggregatorSupplyPlan />;
    if (section === "penerimaan") return <AggregatorPenerimaan />;
    if (section === "qc") return <AggregatorQc />;
    if (section === "batch") return <AggregatorBatch />;
    if (section === "inventory") return <AggregatorInventory />;
    if (section === "pasar") return <AggregatorPasar />;
    if (section === "pesanan") return <AggregatorPesanan />;
    if (section === "pengiriman") return <AggregatorPengiriman />;
    if (section === "keuangan") return <AggregatorKeuangan />;
    if (section === "jejak") return <AggregatorJejak />;
    if (section === "laporan") return <AggregatorLaporan />;
  }

  if (role === "distributor") {
    if (!section) return <DistributorDashboard />;
    if (section === "supplier") return <DistributorSupplier />;
    if (section === "procurement") return <DistributorProcurement />;
    if (section === "receiving") return <DistributorReceiving />;
    if (section === "warehouse") return <DistributorWarehouse />;
    if (section === "inventory") return <DistributorInventory />;
    if (section === "sales") return <DistributorSales />;
    if (section === "buyer") return <DistributorBuyer />;
    if (section === "fulfillment") return <DistributorFulfillment />;
    if (section === "delivery") return <DistributorDelivery />;
    if (section === "return") return <DistributorReturn />;
    if (section === "finance") return <DistributorFinance />;
    if (section === "jejak") return <DistributorJejak />;
    if (section === "analytics") return <DistributorAnalytics />;
  }

  if (role === "buyer") {
    if (!section) return <BuyerDashboard />;
    if (section === "pasar") return <BuyerPasar />;
    if (section === "rfq") return <BuyerRfq />;
    if (section === "supplier") return <BuyerSupplier />;
    if (section === "pesanan") return <BuyerPesanan />;
    if (section === "kontrak") return <BuyerKontrak />;
    if (section === "penerimaan") return <BuyerPenerimaan />;
    if (section === "qc") return <BuyerQc />;
    if (section === "jejak") return <BuyerJejak />;
    if (section === "invoice") return <BuyerInvoice />;
    if (section === "laporan") return <BuyerLaporan />;
  }

  if (role === "admin") {
    if (!section) return <AdminDashboard />;
    if (section === "organisasi") return <AdminOrganisasi />;
    if (section === "akses") return <AdminAkses />;
    if (section === "komoditas") return <AdminKomoditas />;
    if (section === "mutu") return <AdminMutu />;
    if (section === "protokol") return <AdminProtokol />;
    if (section === "pasar") return <AdminPasar />;
    if (section === "transaksi") return <AdminTransaksi />;
    if (section === "jejak") return <AdminJejak />;
    if (section === "langganan") return <AdminLangganan />;
    if (section === "sengketa") return <AdminSengketa />;
    if (section === "analitik") return <AdminAnalitik />;
    if (section === "audit") return <AdminAudit />;
    if (section === "pengaturan") return <AdminPengaturan />;
  }

  notFound();
}
