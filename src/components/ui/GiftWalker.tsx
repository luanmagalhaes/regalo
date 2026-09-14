interface GiftWalkerProps {
  className?: string;
  idPrefix?: string;
}

export function GiftWalker({ className = "w-20", idPrefix = "walker" }: GiftWalkerProps) {
  const dots = `${idPrefix}-dots`;

  return (
    <svg
      viewBox="0 0 150 190"
      className={`animate-walk-bob ${className}`}
      role="img"
      aria-label="Presente andando com um presentinho na mão"
    >
      <defs>
        <pattern id={dots} width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="2.6" fill="#241830" />
          <circle cx="14" cy="13" r="2" fill="#241830" />
        </pattern>
      </defs>

      <g stroke="var(--color-ink)" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
        <g className="animate-leg-back" style={{ transformOrigin: "58px 104px" }}>
          <path d="M58 104c-4 16-10 24-6 36 3 9 10 14 10 22" fill="none" strokeWidth="9" stroke="#f3d9bd" />
          <path d="M58 104c-4 16-10 24-6 36 3 9 10 14 10 22" fill="none" />
          <path d="M54 162h20l6 12H50c-3 0-5-3-4-6z" fill="#ff6fa5" />
        </g>

        <g className="animate-leg-front" style={{ transformOrigin: "88px 104px" }}>
          <path d="M88 104c5 15 13 22 11 34-1 10-8 16-7 24" fill="none" strokeWidth="9" stroke="#f3d9bd" />
          <path d="M88 104c5 15 13 22 11 34-1 10-8 16-7 24" fill="none" />
          <path d="M86 162h20l6 12H82c-3 0-5-3-4-6z" fill="#ff6fa5" />
        </g>

        <g>
          <rect x="34" y="42" width="80" height="62" rx="10" fill="#f7cf4a" />
          <rect x="34" y="42" width="80" height="62" rx="10" fill={`url(#${dots})`} stroke="none" />
          <rect x="34" y="42" width="80" height="62" rx="10" fill="none" />

          <path d="M34 78h80v18c0 5-4 8-9 8H43c-5 0-9-3-9-8z" fill="#ffffff" />
          <path d="M39 88h15l7 16H44c-3 0-5-2-5-5z" fill="#f7cf4a" strokeWidth="3.4" />
          <path d="M109 88H94l-7 16h14c3 0 5-2 5-5z" fill="#f7cf4a" strokeWidth="3.4" />
          <path d="M34 86h80" fill="none" strokeWidth="3.4" />
        </g>

        <g>
          <rect x="28" y="24" width="92" height="20" rx="7" fill="#ffd964" />
          <rect x="28" y="24" width="92" height="20" rx="7" fill={`url(#${dots})`} stroke="none" />
          <rect x="28" y="24" width="92" height="20" rx="7" fill="none" />
        </g>

        <g>
          <path d="M74 24c-16 0-28-5-28-15 0-7 6-11 12-9 7 2 13 13 16 24z" fill="#ffd964" />
          <path d="M74 24c16 0 28-5 28-15 0-7-6-11-12-9-7 2-13 13-16 24z" fill="#ffd964" />
          <circle cx="74" cy="21" r="7" fill="#f7cf4a" />
        </g>

        <g className="animate-parcel-sway" style={{ transformOrigin: "118px 72px" }}>
          <path d="M114 72c8 2 14 6 16 10" fill="none" strokeWidth="7" stroke="#f3d9bd" />
          <rect x="118" y="84" width="28" height="24" rx="5" fill="#ff6fa5" />
          <path d="M132 84v24M118 92h28" fill="none" strokeWidth="4" />
        </g>
      </g>
    </svg>
  );
}
