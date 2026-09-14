"use client";

import { useEffect, useState } from "react";
import { GiftArt } from "@/components/ui/GiftArt";
import { brand } from "@/data/copy";
import { sound, unlockSound } from "@/lib/sound";

const holdMs = 1900;
const fadeMs = 560;

interface SplashScreenProps {
  onDone: () => void;
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    unlockSound();

    const music = window.setTimeout(() => sound.opening(), 120);
    const start = window.setTimeout(() => setLeaving(true), holdMs);

    return () => {
      window.clearTimeout(music);
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

        <GiftArt animated idPrefix="splash" className="relative w-52 sm:w-64" />
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
