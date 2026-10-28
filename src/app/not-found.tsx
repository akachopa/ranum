import Link from "next/link";
import { Wordmark } from "@/components/brand";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-4 text-center">
      <Wordmark />
      <h1 className="font-display text-3xl text-forest">Halaman tidak ditemukan</h1>
      <p className="max-w-md text-muted">
        Menu atau kode batch itu tidak ada di demo MVP.
      </p>
      <Link href="/" className="font-semibold text-leaf">
        Kembali ke beranda
      </Link>
    </div>
  );
}
