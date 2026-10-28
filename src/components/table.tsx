"use client";

import { type ReactNode, useMemo, useState } from "react";
import { Badge } from "./ui";

export type Column<T> = {
  key: string;
  label: string;
  hideOnMobile?: boolean;
  render?: (row: T) => ReactNode;
};

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  onRowClick,
  mobileTitle,
  mobileSubtitle,
  mobileBadge,
}: {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
  mobileTitle: (row: T) => string;
  mobileSubtitle?: (row: T) => string;
  mobileBadge?: (row: T) => string | undefined;
}) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [asc, setAsc] = useState(true);

  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    return [...rows].sort((a, b) => {
      const av = String((a as Record<string, unknown>)[sortKey] ?? "");
      const bv = String((b as Record<string, unknown>)[sortKey] ?? "");
      return asc ? av.localeCompare(bv, "id") : bv.localeCompare(av, "id");
    });
  }, [rows, sortKey, asc]);

  const cell = (row: T, col: Column<T>) => {
    if (col.render) return col.render(row);
    return String((row as Record<string, unknown>)[col.key] ?? "");
  };

  return (
    <>
      <div className="space-y-3 md:hidden">
        {sorted.map((row) => (
          <button
            key={row.id}
            type="button"
            onClick={() => onRowClick?.(row)}
            className="w-full rounded-2xl border border-line bg-white p-4 text-left"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-forest">{mobileTitle(row)}</p>
                {mobileSubtitle ? (
                  <p className="mt-1 text-sm text-muted">{mobileSubtitle(row)}</p>
                ) : null}
              </div>
              {mobileBadge?.(row) ? <Badge tone={mobileBadge(row)}>{mobileBadge(row)}</Badge> : null}
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
              {columns
                .filter((c) => !c.hideOnMobile)
                .slice(0, 4)
                .map((c) => (
                  <div key={c.key}>
                    <dt className="text-muted">{c.label}</dt>
                    <dd className="font-medium text-ink">{cell(row, c)}</dd>
                  </div>
                ))}
            </dl>
          </button>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-2xl border border-line md:block">
        <table className="min-w-full text-sm">
          <thead className="bg-cream text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-semibold">
                  <button
                    type="button"
                    className="hover:text-forest"
                    onClick={() => {
                      if (sortKey === col.key) setAsc(!asc);
                      else {
                        setSortKey(col.key);
                        setAsc(true);
                      }
                    }}
                  >
                    {col.label}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={`border-t border-line ${onRowClick ? "cursor-pointer hover:bg-mint/50" : ""}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 align-middle text-ink">
                    {cell(row, col)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
