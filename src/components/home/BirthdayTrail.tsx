"use client";

import { GiftWalker } from "@/components/ui/GiftWalker";
import { paletteFor } from "@/data/palettes";
import { daysUntilBirthday, sortByNextBirthday } from "@/lib/birthday";
import type { Profile } from "@/types/profile";

const trailWindow = 90;

interface BirthdayTrailProps {
  profiles: readonly Profile[];
  onOpen: (profile: Profile) => void;
}

export function BirthdayTrail({ profiles, onOpen }: BirthdayTrailProps) {
  const dated = sortByNextBirthday(profiles).filter(
    (profile) => daysUntilBirthday(profile.birthday) !== null,
  );

  if (dated.length === 0) {
    return null;
  }

  const next = dated[0];
  const distance = daysUntilBirthday(next.birthday) ?? 0;
  const palette = paletteFor(next.palette);
  const walked = Math.min(84, Math.max(4, ((trailWindow - distance) / trailWindow) * 100));

  return (
    <section
      className="scoop relative overflow-hidden rounded-[1.75rem] border-[3px] border-ink p-4"
      style={{ backgroundImage: palette.stage }}
    >
      <p className="display relative text-center text-base leading-tight text-ink">
        {distance === 0
          ? `Hoje é o aniversário de ${next.name}!`
          : distance === 1
            ? `Falta 1 dia para o aniversário de ${next.name}`
            : `Faltam ${distance} dias para o aniversário de ${next.name}`}
      </p>

      <div className="relative mt-3 h-[5.5rem]">
        <div
          className="animate-trail-march absolute inset-x-0 bottom-3 h-2 rounded-full border-[3px] border-ink bg-paper"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, var(--color-ink) 0 12px, transparent 12px 36px)",
            backgroundSize: "36px 100%",
          }}
        />

        <span
          className="absolute bottom-2 right-0 text-3xl"
          aria-hidden
          title={`Aniversário de ${next.name}`}
        >
          🎂
        </span>

        <div
          className="absolute bottom-[0.6rem] transition-[left] duration-700"
          style={{ left: `calc(${walked}% - 2rem)` }}
        >
          <GiftWalker className="w-16" idPrefix={`walker-${next.id}`} />
        </div>
      </div>

      <ul className="relative mt-1 flex flex-col gap-1.5">
        {dated.map((profile) => {
          const days = daysUntilBirthday(profile.birthday) ?? 0;

          return (
            <li key={profile.id}>
              <button
                type="button"
                onClick={() => onOpen(profile)}
                className="flex w-full items-center gap-2 rounded-2xl border-[3px] border-ink bg-paper/85 px-3 py-1.5 text-left transition-transform hover:-translate-y-[2px]"
              >
                <span aria-hidden className="text-base">
                  {profile.emoji}
                </span>
                <span className="display min-w-0 flex-1 truncate text-sm text-ink">
                  {profile.name}
                </span>
                <span className="display shrink-0 text-xs text-ink/60">
                  {days === 0 ? "é hoje!" : days === 1 ? "amanhã" : `${days} dias`}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
