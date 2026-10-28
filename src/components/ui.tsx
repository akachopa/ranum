"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { statusTone } from "@/lib/format";
import type { StatusTone } from "@/lib/types";

export function PageHeader({
  kicker,
  title,
  description,
  actions,
}: {
  kicker?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {kicker ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-moss">
            {kicker}
          </p>
        ) : null}
        <h1 className="mt-1 font-display text-3xl tracking-tight text-forest sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  type = "button",
  className = "",
  disabled,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "gold";
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
}) {
  const styles = {
    primary:
      "bg-forest text-cream hover:bg-leaf disabled:bg-forest/40",
    secondary:
      "bg-white text-forest border border-line hover:bg-mint disabled:opacity-50",
    ghost: "bg-transparent text-forest hover:bg-mint disabled:opacity-50",
    danger: "bg-clay text-white hover:bg-clay/90",
    gold: "bg-gold text-white hover:bg-gold/90",
  }[variant];
  const cls = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition ${styles} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls} disabled={disabled}>
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone,
}: {
  children: ReactNode;
  tone?: StatusTone | string;
}) {
  const resolved =
    typeof tone === "string" &&
    !["neutral", "good", "warn", "bad", "info", "gold"].includes(tone)
      ? statusTone(tone)
      : ((tone as StatusTone) ?? "neutral");
  const map: Record<StatusTone, string> = {
    neutral: "bg-cream text-ink border-line",
    good: "bg-mint text-leaf border-moss/20",
    warn: "bg-amber-50 text-amber-800 border-amber-200",
    bad: "bg-red-50 text-clay border-red-200",
    info: "bg-sky-50 text-sky border-sky-100",
    gold: "bg-yellow-50 text-gold border-yellow-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${map[resolved]}`}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-line bg-white p-4 sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function Kpi({
  label,
  value,
  hint,
  tone = "forest",
  action,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "forest" | "gold" | "clay" | "sky";
  action?: ReactNode;
}) {
  const bar = {
    forest: "bg-leaf",
    gold: "bg-gold",
    clay: "bg-clay",
    sky: "bg-sky",
  }[tone];
  return (
    <Card className="relative overflow-hidden">
      <span className={`absolute inset-y-0 left-0 w-1 ${bar}`} />
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl tracking-tight text-forest">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </Card>
  );
}

export function AlertCard({
  title,
  body,
  actionLabel,
  href,
  tone = "warn",
}: {
  title: string;
  body: string;
  actionLabel?: string;
  href?: string;
  tone?: "warn" | "bad" | "info";
}) {
  const bg = {
    warn: "bg-amber-50 border-amber-200",
    bad: "bg-red-50 border-red-200",
    info: "bg-mint border-moss/20",
  }[tone];
  return (
    <div className={`rounded-2xl border p-4 ${bg}`}>
      <p className="font-semibold text-forest">{title}</p>
      <p className="mt-1 text-sm text-ink/80">{body}</p>
      {href && actionLabel ? (
        <Link
          href={href}
          className="mt-3 inline-flex text-sm font-semibold text-leaf underline-offset-4 hover:underline"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-forest">
        {label}
      </span>
      {children}
    </label>
  );
}

export const inputClass =
  "min-h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm text-ink outline-none ring-leaf/30 placeholder:text-muted focus:border-leaf focus:ring-2";

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${inputClass} max-w-full sm:max-w-sm`}
    />
  );
}

export function Empty({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line p-10 text-center">
      <p className="font-display text-xl text-forest">{title}</p>
      <p className="mt-2 text-sm text-muted">{body}</p>
    </div>
  );
}

export function BarList({
  items,
  unit,
}: {
  items: { label: string; value: number }[];
  unit?: string;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-ink">{item.label}</span>
            <span className="font-medium text-forest">
              {item.value.toLocaleString("id-ID")}
              {unit ? ` ${unit}` : ""}
            </span>
          </div>
          <div className="h-2 rounded-full bg-cream">
            <div
              className="h-2 rounded-full bg-leaf"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Timeline({
  items,
}: {
  items: { title: string; meta: string; note: string }[];
}) {
  return (
    <ol className="space-y-0">
      {items.map((item, index) => (
        <li key={`${item.title}-${index}`} className="flex gap-4">
          <div className="flex flex-col items-center">
            <span className="mt-1 h-3 w-3 rounded-full bg-leaf" />
            {index < items.length - 1 ? (
              <span className="w-px flex-1 bg-line" />
            ) : (
              <span className="h-2" />
            )}
          </div>
          <div className="pb-6">
            <p className="font-semibold text-forest">{item.title}</p>
            <p className="text-xs text-muted">{item.meta}</p>
            <p className="mt-1 text-sm text-ink">{item.note}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        className="absolute inset-0 bg-forest/40"
        aria-label="Tutup"
        onClick={onClose}
      />
      <div className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 sm:max-w-lg sm:rounded-3xl sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl text-forest">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full px-3 py-1 text-sm text-muted hover:bg-cream"
          >
            Tutup
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Toasts({ items }: { items: { id: number; message: string }[] }) {
  if (!items.length) return null;
  return (
    <div className="pointer-events-none fixed bottom-24 left-1/2 z-50 flex w-[min(92vw,420px)] -translate-x-1/2 flex-col gap-2 md:bottom-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl bg-forest px-4 py-3 text-sm text-cream shadow-none"
        >
          {item.message}
        </div>
      ))}
    </div>
  );
}

export function QrFrame({ code }: { code: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-paper p-4">
      <div className="grid grid-cols-5 gap-1">
        {Array.from({ length: 25 }).map((_, i) => (
          <span
            key={i}
            className={`h-3 w-3 sm:h-4 sm:w-4 ${
              (code.charCodeAt(i % code.length) + i) % 3 === 0
                ? "bg-white"
                : "bg-forest"
            }`}
          />
        ))}
      </div>
      <p className="font-mono text-xs text-muted">{code}</p>
    </div>
  );
}
