"use client";

import { useEffect, useState } from "react";
import { brand } from "@/data/copy";
import { sound } from "@/lib/sound";

const holdMs = 1900;
const fadeMs = 560;

interface SplashScreenProps {
  onDone: () => void;
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const pop = window.setTimeout(() => sound.pop(), 700);
    const start = window.setTimeout(() => setLeaving(true), holdMs);

    return () => {
      window.clearTimeout(pop);
      window.clearTimeout(start);
    };
  }, []);

  useEffect(() => {
    if (!leaving) {
      return;
    }

    const finish = window.setTimeout(onDone, fadeMs);

    return () => window.clearTimeout(finish);
  }, [leaving, onDone]);

  return (
    <div
      className={`stage-party fixed inset-0 z-[90] flex flex-col items-center justify-center gap-6 overflow-hidden px-8 ${
        leaving ? "animate-curtain-out" : ""
      }`}
    >
      <div className="sprinkles pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative">
        <span className="animate-halo-burst absolute inset-0 rounded-full bg-morango/25" />

        <svg
          viewBox="0 -70 220 292"
          className="animate-gift-squish relative w-52 sm:w-64"
          role="img"
          aria-label="Presente sendo aberto"
        >
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
              fill="#f5cf6a"
              stroke="var(--color-ink)"
              strokeWidth="6"
              strokeLinejoin="round"
            />
          </g>

          <g
            stroke="var(--color-ink)"
            strokeWidth="7"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <rect x="46" y="96" width="128" height="94" rx="14" fill="#7c8cf8" />
            <rect x="96" y="96" width="28" height="94" fill="#ff6fa5" />

            <g className="animate-lid-lift">
              <rect x="34" y="66" width="152" height="36" rx="12" fill="#a9b4ff" />
              <rect x="96" y="66" width="28" height="36" fill="#ff8ab8" />
            </g>

            <g className="animate-bow-open">
              <path
                d="M110 66c-26 0-46-8-46-25 0-12 10-19 20-16 12 4 21 22 26 41z"
                fill="#ff6fa5"
              />
              <path
                d="M110 66c26 0 46-8 46-25 0-12-10-19-20-16-12 4-21 22-26 41z"
                fill="#ff6fa5"
              />
              <circle cx="110" cy="62" r="12" fill="#f5cf6a" />
            </g>
          </g>

          <g className="animate-confetti-pop">
            <circle cx="52" cy="52" r="7" fill="#f5cf6a" />
            <circle cx="168" cy="44" r="6" fill="#7fd9a6" />
            <circle cx="184" cy="92" r="5" fill="#b07bff" />
            <circle cx="30" cy="96" r="5" fill="#6fd9d2" />
            <rect x="140" y="20" width="10" height="10" rx="2" fill="#ff6fa5" />
            <rect x="66" y="20" width="9" height="9" rx="2" fill="#7c8cf8" />
          </g>
        </svg>
      </div>

      <div className="relative overflow-hidden text-center">
        <h1 className="display candy-text animate-candy-slide animate-word-rise text-5xl leading-none sm:text-6xl">
          Regalo
        </h1>
        <p
          className="animate-word-rise mt-2 text-sm font-semibold text-ink/65"
          style={{ animationDelay: "180ms" }}
        >
          {brand.tagline}
        </p>
      </div>
    </div>
  );
}
