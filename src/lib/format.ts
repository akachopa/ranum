export function formatKg(value: number) {
  return `${value.toLocaleString("id-ID")} kg`;
}

export function formatRp(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

export function formatDateTime(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

export function statusTone(status: string) {
  const value = status.toLowerCase();
  if (
    [
      "aktif",
      "available",
      "diterima",
      "accepted",
      "completed",
      "selesai",
      "lunas",
      "confirmed",
      "terverifikasi",
      "published",
      "growing",
      "good",
      "on time",
    ].some((k) => value.includes(k))
  ) {
    return "good" as const;
  }
  if (
    [
      "pending",
      "menunggu",
      "negotiation",
      "qc_pending",
      "preparing",
      "reserved",
      "in_transit",
      "under review",
      "draft",
      "planned",
    ].some((k) => value.includes(k))
  ) {
    return "warn" as const;
  }
  if (
    [
      "reject",
      "ditolak",
      "cancelled",
      "expired",
      "damaged",
      "wasted",
      "dispute",
      "overdue",
    ].some((k) => value.includes(k))
  ) {
    return "bad" as const;
  }
  if (["shipped", "listed", "info", "enterprise"].some((k) => value.includes(k))) {
    return "info" as const;
  }
  if (["grade a", "starter", "gold"].some((k) => value.includes(k))) {
    return "gold" as const;
  }
  return "neutral" as const;
}
