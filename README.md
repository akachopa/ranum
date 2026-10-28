# RANUM

**From Harvest to Market**

Platform rantai pasok pertanian yang menghubungkan panen, mutu, keterlacakan, persediaan, distribusi, dan pasar. Produk agritech Arconesia.

MVP ini adalah tampilan lengkap (desktop dan mobile) untuk lima peran:

- Produsen
- Aggregator
- Distributor
- Pembeli
- Admin RANUM

Data bersifat demo (pilot melon & semangka di Jawa Timur). Tidak ada backend; alur penting bisa dijalankan di browser.

## Menjalankan

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Akun demo

Masuk lewat `/masuk` dengan satu ketuk:

| Peran | Nama | Organisasi |
| --- | --- | --- |
| Produsen | Rina Wahyuni | Kebun Melon Sumber Rejeki |
| Aggregator | Budi Santoso | Koperasi Tani RANUM Jatim |
| Distributor | Andi Pratama | PT Nusantara Segar |
| Pembeli | Maya Kusuma | Arcadia Hospitality Group |
| Admin | Nadia Putri | RANUM / Arconesia |

Halaman jejak publik: `/jejak/RN-MEL-20261025-001`

## Stack

Next.js 16, React 19, Tailwind CSS 4, TypeScript.
