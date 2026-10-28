import Link from "next/link";
import { Wordmark } from "@/components/brand";
import { Badge, Card, QrFrame, Timeline } from "@/components/ui";
import { batches, farms, traceEvents } from "@/lib/seed";
import { formatDate } from "@/lib/format";

export default async function PublicTracePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const batch =
    batches.find((b) => b.code === decodeURIComponent(code)) ?? batches[0];
  const events = traceEvents.filter((e) => e.batchCode === batch.code);
  const farm = farms[2];

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Wordmark compact />
          <Link href="/" className="text-sm font-semibold text-leaf">
            Beranda
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-moss">
            Keterlacakan publik
          </p>
          <h1 className="mt-2 font-display text-4xl text-forest">{batch.code}</h1>
          <p className="mt-2 text-muted">
            {batch.commodity} {batch.variety} · data harga dan kontrak disembunyikan.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
          <Card>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted">Komoditas</dt>
                <dd className="font-medium">{batch.commodity}</dd>
              </div>
              <div>
                <dt className="text-muted">Varietas</dt>
                <dd className="font-medium">{batch.variety}</dd>
              </div>
              <div>
                <dt className="text-muted">Produsen</dt>
                <dd className="font-medium">{batch.source}</dd>
              </div>
              <div>
                <dt className="text-muted">Wilayah panen</dt>
                <dd className="font-medium">
                  {farm.city}, {farm.province}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Tanggal panen</dt>
                <dd className="font-medium">{formatDate(batch.harvestDate)}</dd>
              </div>
              <div>
                <dt className="text-muted">Grade</dt>
                <dd>
                  <Badge tone="good">{batch.grade}</Badge>
                </dd>
              </div>
            </dl>
          </Card>
          <QrFrame code={batch.code} />
        </div>
        <Card>
          <h2 className="font-display text-2xl text-forest">Perjalanan</h2>
          <div className="mt-4">
            <Timeline
              items={(events.length ? events : traceEvents).map((e) => ({
                title: e.type.replaceAll("_", " "),
                meta: e.location,
                note: e.note,
              }))}
            />
          </div>
        </Card>
      </main>
    </div>
  );
}
