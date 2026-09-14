interface GiftArtProps {
  className?: string;
  animated?: boolean;
  idPrefix?: string;
}

export function GiftArt({ className = "w-24", animated = false, idPrefix = "gift" }: GiftArtProps) {
  const dots = `${idPrefix}-dots`;

  return (
    <svg
      viewBox="0 -70 220 292"
      className={`${animated ? "animate-gift-squish" : ""} ${className}`}
      role="img"
      aria-label="Presente"
    >
      <defs>
        <pattern id={dots} width="26" height="26" patternUnits="userSpaceOnUse">
          <circle cx="7" cy="7" r="4" fill="#241830" />
          <circle cx="20" cy="19" r="3" fill="#241830" />
        </pattern>
      </defs>

      {animated ? (
        <>
          <g className="animate-pop-out" style={{ animationDelay: "620ms" }}>
            <path
              d="M96 92c-6-9-20-7-20 4 0 9 12 16 20 22 8-6 20-13 20-22 0-11-14-13-20-4z"
              fill="#ff6fa5"
              stroke="var(--color-ink)"
              strokeWidth="6"
              strokeLinejoin="round"
            />
          </g>

          <g className="animate-pop-out" style={{ animationDelay: "780ms" }}>
            <path
              d="m146 84 6 14 15 2-11 11 3 15-13-7-13 7 3-15-11-11 15-2z"
              fill="#ffd964"
              stroke="var(--color-ink)"
              strokeWidth="6"
              strokeLinejoin="round"
            />
          </g>
        </>
      ) : null}

      <g stroke="var(--color-ink)" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round">
        <g>
          <rect x="46" y="96" width="128" height="94" rx="14" fill="#f7cf4a" />
          <rect x="46" y="96" width="128" height="94" rx="14" fill={`url(#${dots})`} stroke="none" />
          <rect x="46" y="96" width="128" height="94" rx="14" fill="none" />
        </g>

        <g>
          <path d="M46 140h128v36c0 8-6 14-14 14H60c-8 0-14-6-14-14z" fill="#ffffff" />
          <path d="M52 161h33l13 29H60c-5 0-8-4-8-9z" fill="#f7cf4a" strokeWidth="5" />
          <path d="M168 161h-33l-13 29h38c5 0 8-4 8-9z" fill="#f7cf4a" strokeWidth="5" />
          <path d="M46 158h128" fill="none" strokeWidth="5" />
        </g>

        <g className={animated ? "animate-lid-lift" : ""}>
          <rect x="34" y="66" width="152" height="36" rx="12" fill="#ffd964" />
          <rect x="34" y="66" width="152" height="36" rx="12" fill={`url(#${dots})`} stroke="none" />
          <rect x="34" y="66" width="152" height="36" rx="12" fill="none" />
        </g>

        <g className={animated ? "animate-bow-open" : ""}>
          <path d="M110 66c-26 0-46-8-46-25 0-12 10-19 20-16 12 4 21 22 26 41z" fill="#ffd964" />
          <path d="M110 66c26 0 46-8 46-25 0-12-10-19-20-16-12 4-21 22-26 41z" fill="#ffd964" />
          <circle cx="110" cy="62" r="12" fill="#f7cf4a" />
        </g>
      </g>
    </svg>
  );
}
