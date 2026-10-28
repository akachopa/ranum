export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect width="40" height="40" rx="10" fill="#16382b" />
      <path
        d="M12 27c6-1 9-6 9-12 4 1 8 5 9 11-5 2-12 3-18 1Z"
        fill="#7cb392"
      />
      <path
        d="M14 14c3-5 9-6 13-3-1 5-5 8-10 9-2-1-3-3-3-6Z"
        fill="#f3eee5"
      />
      <circle cx="20" cy="16" r="2.2" fill="#16382b" />
    </svg>
  );
}

export function Wordmark({
  light = false,
  compact = false,
}: {
  light?: boolean;
  compact?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark className={compact ? "h-8 w-8" : "h-9 w-9"} />
      <div className="leading-none">
        <div
          className={`font-display text-[1.35rem] tracking-tight ${
            light ? "text-cream" : "text-forest"
          }`}
        >
          RANUM
        </div>
        {!compact ? (
          <div
            className={`mt-0.5 text-[10px] uppercase tracking-[0.18em] ${
              light ? "text-cream/70" : "text-muted"
            }`}
          >
            From Harvest to Market
          </div>
        ) : null}
      </div>
    </div>
  );
}
