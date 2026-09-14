import type { ReactNode } from "react";

export interface IconEntry {
  key: string;
  label: string;
  art: ReactNode;
}

const ink = "var(--color-ink)";

const strokes = {
  stroke: ink,
  strokeWidth: 2.6,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

const art: Record<string, ReactNode> = {
  shirt: (
    <g {...strokes}>
      <path
        d="M22 12 12 18l5 9 5-3v26h24V24l5 3 5-9-10-6-7 3h-5z"
        fill="currentColor"
      />
      <path d="M27 12c0 3 2.2 5 5 5s5-2 5-5" fill="none" />
    </g>
  ),
  dress: (
    <g {...strokes}>
      <path d="M24 10h16l-3 11 7 30H20l7-30z" fill="currentColor" />
      <path d="M27 21h10" fill="none" />
      <path d="M28 10c1.6 3.4 6.4 3.4 8 0" fill="none" />
    </g>
  ),
  skirt: (
    <g {...strokes}>
      <path d="M20 18h24l8 30H12z" fill="currentColor" />
      <path d="M20 18h24" fill="none" />
      <path d="M28 26v18M36 26v18" fill="none" opacity="0.55" />
    </g>
  ),
  pants: (
    <g {...strokes}>
      <path d="M20 10h24v10l-3 34h-8l-1-22-1 22h-8l-3-34z" fill="currentColor" />
      <path d="M20 20h24" fill="none" />
    </g>
  ),
  shorts: (
    <g {...strokes}>
      <path d="M19 12h26v8l-2 22h-9l-2-15-2 15h-9l-2-22z" fill="currentColor" />
      <path d="M19 20h26" fill="none" />
    </g>
  ),
  bikini: (
    <g {...strokes}>
      <path d="M10 16c6 0 10 4 11 9 2-3 6-3 8 0 1-5 5-9 11-9-2 8-6 12-11 13h-8c-5-1-9-5-11-13z" fill="currentColor" />
      <path d="M20 40h24l-5 12h-4l-3-6-3 6h-4z" fill="currentColor" />
    </g>
  ),
  swimsuit: (
    <g {...strokes}>
      <path d="M22 12h20l-2 12 4 10c0 10-5 18-12 18s-12-8-12-18l4-10z" fill="currentColor" />
      <path d="M26 12c2 4 10 4 12 0" fill="none" />
    </g>
  ),
  panties: (
    <g {...strokes}>
      <path d="M14 20h36c0 14-6 22-12 24-3 1-5-2-6-6-1 4-3 7-6 6-6-2-12-10-12-24z" fill="currentColor" />
      <path d="M14 20h36" fill="none" />
    </g>
  ),
  bra: (
    <g {...strokes}>
      <path d="M8 18c5 0 9 3 10 8 2-2 6-2 8 0 1-5 5-8 10-8-1 11-6 17-12 17h-4C14 35 9 29 8 18z" fill="currentColor" transform="translate(9 6)" />
      <path d="M12 28h6M46 28h6" fill="none" />
    </g>
  ),
  pajamas: (
    <g {...strokes}>
      <path d="M16 12h20l4 6-4 4v12H16V22l-4-4z" fill="currentColor" />
      <path d="M22 38h18v16h-7l-1-8-1 8h-9z" fill="currentColor" />
      <path d="M30 18c-1 2 1 4 3 3" fill="none" />
    </g>
  ),
  coat: (
    <g {...strokes}>
      <path d="M24 10 12 17v25h8v12h24V42h8V17L40 10l-8 7z" fill="currentColor" />
      <path d="M32 17v37" fill="none" />
    </g>
  ),
  hoodie: (
    <g {...strokes}>
      <path d="M24 12c0 6 16 6 16 0l12 8-4 10-6-2v20H22V28l-6 2-4-10z" fill="currentColor" />
      <path d="M28 12c2 5 6 5 8 0" fill="none" />
      <path d="M32 30v10" fill="none" />
    </g>
  ),
  shoe: (
    <g {...strokes}>
      <path d="M8 44c0-8 4-10 6-16l6 4 4-4 4 4 5-3c4 6 12 9 20 10 4 .5 5 3 5 5v4H10z" fill="currentColor" />
      <path d="M8 44h50" fill="none" />
    </g>
  ),
  sneaker: (
    <g {...strokes}>
      <path d="M8 46c0-9 3-12 5-18l8 5 3-4 4 4 4-4c3 7 11 11 21 12 4 .5 5 2 5 5v4H9z" fill="currentColor" />
      <path d="M8 46h50" fill="none" />
      <path d="M22 33l7 5M27 28l7 6" fill="none" opacity="0.6" />
    </g>
  ),
  sock: (
    <g {...strokes}>
      <path d="M22 8h14v20c0 5 3 7 8 10 6 4 6 12 0 15s-14 0-16-7c-2-6-6-8-6-16z" fill="currentColor" />
      <path d="M22 18h14" fill="none" />
    </g>
  ),
  ring: (
    <g {...strokes}>
      <path d="m32 8 10 8-10 10-10-10z" fill="currentColor" />
      <circle cx="32" cy="40" r="15" fill="none" />
    </g>
  ),
  earring: (
    <g {...strokes}>
      <path d="M32 10c-7 0-11 5-11 11v5" fill="none" />
      <circle cx="21" cy="31" r="5" fill="currentColor" />
      <path d="m21 38 6 14-6 6-6-6z" fill="currentColor" />
      <circle cx="43" cy="22" r="4" fill="currentColor" />
    </g>
  ),
  necklace: (
    <g {...strokes}>
      <path d="M14 12c0 18 8 28 18 28s18-10 18-28" fill="none" />
      <path d="m32 40 7 8-7 8-7-8z" fill="currentColor" />
    </g>
  ),
  bracelet: (
    <g {...strokes}>
      <ellipse cx="32" cy="32" rx="20" ry="16" fill="none" />
      <circle cx="32" cy="16" r="5" fill="currentColor" />
      <circle cx="12" cy="32" r="4" fill="currentColor" />
      <circle cx="52" cy="32" r="4" fill="currentColor" />
    </g>
  ),
  cap: (
    <g {...strokes}>
      <path d="M12 38c0-13 9-22 20-22s20 9 20 22z" fill="currentColor" />
      <path d="M12 38h44c0 5-4 8-10 8H22c-6 0-10-3-10-8z" fill="currentColor" />
      <path d="M32 16v22" fill="none" opacity="0.5" />
    </g>
  ),
  glasses: (
    <g {...strokes}>
      <circle cx="18" cy="34" r="10" fill="currentColor" />
      <circle cx="46" cy="34" r="10" fill="currentColor" />
      <path d="M28 32h8M8 30l-4-6M56 30l4-6" fill="none" />
    </g>
  ),
  watch: (
    <g {...strokes}>
      <path d="M24 6h16l-2 14H26zM24 58h16l-2-14H26z" fill="currentColor" />
      <circle cx="32" cy="32" r="14" fill="currentColor" />
      <path d="M32 26v7l5 3" fill="none" />
    </g>
  ),
  bag: (
    <g {...strokes}>
      <path d="M14 22h36l4 32H10z" fill="currentColor" />
      <path d="M23 22v-4c0-5 4-9 9-9s9 4 9 9v4" fill="none" />
    </g>
  ),
  perfume: (
    <g {...strokes}>
      <path d="M26 6h12v8H26z" fill="currentColor" />
      <path d="M22 22c0-5 4-8 10-8s10 3 10 8v26c0 5-3 8-10 8s-10-3-10-8z" fill="currentColor" />
      <path d="M44 16h8v10" fill="none" />
      <circle cx="52" cy="30" r="3" fill="currentColor" />
    </g>
  ),
  book: (
    <g {...strokes}>
      <path d="M12 10h34c4 0 6 2 6 6v38H18c-4 0-6-2-6-6z" fill="currentColor" />
      <path d="M12 48c0-4 3-6 6-6h34" fill="none" />
      <path d="M24 20h16M24 28h12" fill="none" opacity="0.65" />
    </g>
  ),
  game: (
    <g {...strokes}>
      <path d="M18 20h28c7 0 11 6 11 14s-4 12-9 12c-4 0-6-4-10-4H26c-4 0-6 4-10 4-5 0-9-4-9-12s4-14 11-14z" fill="currentColor" />
      <path d="M18 30v8M14 34h8" fill="none" />
      <circle cx="45" cy="30" r="2.6" fill={ink} stroke="none" />
      <circle cx="50" cy="37" r="2.6" fill={ink} stroke="none" />
    </g>
  ),
  drink: (
    <g {...strokes}>
      <path d="M14 12h36L34 34v16h8v6H22v-6h8V34z" fill="currentColor" />
      <path d="M20 20h24" fill="none" />
      <circle cx="46" cy="16" r="4" fill="currentColor" />
    </g>
  ),
  candle: (
    <g {...strokes}>
      <path d="M20 26h24v28H20z" fill="currentColor" />
      <path d="M32 8c5 5 7 8 7 11a7 7 0 0 1-14 0c0-3 2-6 7-11z" fill="currentColor" />
      <path d="M20 34h24" fill="none" opacity="0.5" />
    </g>
  ),
  flower: (
    <g {...strokes}>
      <circle cx="32" cy="12" r="8" fill="currentColor" />
      <circle cx="16" cy="24" r="8" fill="currentColor" />
      <circle cx="48" cy="24" r="8" fill="currentColor" />
      <circle cx="22" cy="40" r="8" fill="currentColor" />
      <circle cx="42" cy="40" r="8" fill="currentColor" />
      <circle cx="32" cy="28" r="7" fill="var(--color-baunilha)" />
      <path d="M32 44v14" fill="none" />
    </g>
  ),
  plant: (
    <g {...strokes}>
      <path d="M18 34h28l-4 22H22z" fill="currentColor" />
      <path d="M32 34c0-10-5-16-14-18 1 10 6 16 14 18z" fill="currentColor" />
      <path d="M32 34c0-10 5-16 14-18-1 10-6 16-14 18z" fill="currentColor" />
    </g>
  ),
  makeup: (
    <g {...strokes}>
      <path d="M24 26h16v28H24z" fill="currentColor" />
      <path d="M26 8h12v18H26z" fill="currentColor" />
      <path d="M26 12h12" fill="none" />
    </g>
  ),
  cake: (
    <g {...strokes}>
      <path d="M12 34c0-5 4-8 10-8h20c6 0 10 3 10 8v20H12z" fill="currentColor" />
      <path d="M12 42c5 0 5 4 10 4s5-4 10-4 5 4 10 4 5-4 10-4" fill="none" />
      <path d="M32 26v-8" fill="none" />
      <circle cx="32" cy="14" r="4" fill="currentColor" />
    </g>
  ),
  music: (
    <g {...strokes}>
      <path d="M26 46V14l24-6v32" fill="none" />
      <ellipse cx="20" cy="47" rx="8" ry="6" fill="currentColor" />
      <ellipse cx="44" cy="41" rx="7" ry="5.5" fill="currentColor" />
      <path d="M26 22l24-6" fill="none" />
    </g>
  ),
  home: (
    <g {...strokes}>
      <path d="M32 8 8 28h8v26h32V28h8z" fill="currentColor" />
      <path d="M26 54V38h12v16" fill="none" />
    </g>
  ),
  gift: (
    <g {...strokes}>
      <path d="M10 26h44v10H10z" fill="currentColor" />
      <path d="M14 36h36v20H14z" fill="currentColor" />
      <path d="M32 26v30" fill="none" />
      <path d="M32 26c-8 0-14-2-14-7s7-5 9-2 5 9 5 9zM32 26c8 0 14-2 14-7s-7-5-9-2-5 9-5 9z" fill="currentColor" />
    </g>
  ),
};

interface CartoonIconProps {
  name: string;
  className?: string;
  title?: string;
}

export function CartoonIcon({ name, className = "h-10 w-10", title }: CartoonIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {art[name] ?? art.gift}
    </svg>
  );
}
