"use client";

import { countdownLabel, daysUntilBirthday } from "@/lib/birthday";
import { paletteFor } from "@/data/palettes";
import type { Profile } from "@/types/profile";

interface BirthdayBannerProps {
  profiles: readonly Profile[];
  canAskPush: boolean;
  onAskPush: () => void;
  onOpen: (profile: Profile) => void;
}

export function BirthdayBanner({ profiles, canAskPush, onAskPush, onOpen }: BirthdayBannerProps) {
  if (profiles.length === 0) {
    return null;
  }

  const first = profiles[0];
  const palette = paletteFor(first.palette);
  const distance = daysUntilBirthday(first.birthday);
  const others = profiles.slice(1);

  return (
    <section
      className="scoop animate-rise-in relative overflow-hidden rounded-[1.75rem] border-[3px] border-ink p-4"
      style={{ backgroundImage: palette.stage }}
      role="status"
    >
      <div className="sprinkles pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative flex items-center gap-3">
        <span className="animate-cake-bounce text-4xl" aria-hidden>
          🎂
        </span>

        <div className="min-w-0 flex-1">
          <p className="display text-base leading-tight text-ink">
            {distance === 0
              ? `Hoje é aniversário de ${first.name}!`
              : `Aniversário de ${first.name} ${countdownLabel(distance)?.toLowerCase()}`}
          </p>
          <p className="mt-0.5 text-xs font-semibold text-ink/65">
            {others.length === 0
              ? "Boa hora para conferir a lista antes de comprar."
              : `E mais ${others.length} ${others.length === 1 ? "pessoa" : "pessoas"} nos próximos 15 dias.`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpen(first)}
          className="display shrink-0 rounded-2xl border-[3px] border-ink bg-paper px-3 py-1.5 text-xs text-ink transition-transform hover:-translate-y-[2px]"
        >
          Ver lista
        </button>
      </div>

      {canAskPush ? (
        <button
          type="button"
          onClick={onAskPush}
          className="display relative mt-3 w-full rounded-2xl border-[3px] border-ink bg-paper/85 px-3 py-2 text-xs text-ink transition-transform hover:-translate-y-[2px]"
        >
          🔔 Quero o aviso no celular 15 dias antes
        </button>
      ) : null}
    </section>
  );
}
