"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { sound } from "@/lib/sound";

interface BalloonTipProps {
  title: string;
  color: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
}

const extras = [
  { emoji: "🎈", className: "left-2 top-10 text-3xl", delay: "0ms" },
  { emoji: "🎈", className: "right-3 top-24 text-2xl", delay: "700ms" },
  { emoji: "✨", className: "left-6 bottom-24 text-xl", delay: "1200ms" },
];

export function BalloonTip({ title, color, children, footer, onClose }: BalloonTipProps) {
  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", escape);

    return () => window.removeEventListener("keydown", escape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[68] flex items-center justify-center p-5"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-label="Fechar"
        onClick={() => {
          sound.tap();
          onClose();
        }}
        className="absolute inset-0 cursor-default bg-ink/55"
      />

      {extras.map((extra, index) => (
        <span
          key={index}
          aria-hidden
          className={`animate-balloon-drift pointer-events-none absolute ${extra.className}`}
          style={{ animationDelay: extra.delay }}
        >
          {extra.emoji}
        </span>
      ))}

      <div className="animate-balloon-fly relative flex w-full max-w-xs flex-col items-center">
        <div
          className="relative w-full rounded-[50%_50%_46%_46%/42%_42%_58%_58%] border-[5px] border-ink px-7 py-8 text-center shadow-[0_12px_0_var(--color-ink),inset_-10px_-14px_0_rgba(59,36,80,0.12)]"
          style={{ backgroundColor: color }}
        >
          <span
            className="pointer-events-none absolute left-[20%] top-[16%] h-10 w-6 -rotate-[18deg] rounded-full bg-paper/60 blur-[1px]"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute left-[32%] top-[14%] h-4 w-2.5 -rotate-[18deg] rounded-full bg-paper/70"
            aria-hidden
          />

          <h3 className="display relative text-base uppercase tracking-[0.12em] text-ink/70">
            {title}
          </h3>

          <div className="relative mt-2 max-h-[44dvh] overflow-y-auto text-ink">{children}</div>

          {footer ? <div className="relative mt-4">{footer}</div> : null}
        </div>

        <svg viewBox="0 0 44 110" className="-mt-[6px] h-28 w-11" aria-hidden>
          <path
            d="M22 4l9 13H13z"
            fill={color}
            stroke="var(--color-ink)"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            className="animate-string-sway"
            d="M22 18c10 12-10 18 0 30s-10 18 0 30 -6 16 -1 26"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="4"
            strokeLinecap="round"
            style={{ transformOrigin: "22px 18px" }}
          />
        </svg>
      </div>
    </div>
  );
}
