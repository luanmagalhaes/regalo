"use client";

import { copy } from "@/data/copy";
import { paletteFor } from "@/data/palettes";
import {
  birthdayLabel,
  countdownLabel,
  daysUntilBirthday,
  nearWindow,
  sortByNextBirthday,
} from "@/lib/birthday";
import type { Profile } from "@/types/profile";

interface BirthdayTrackerProps {
  profiles: readonly Profile[];
  onOpen: (profile: Profile) => void;
}

export function BirthdayTracker({ profiles, onOpen }: BirthdayTrackerProps) {
  const dated = sortByNextBirthday(profiles).filter(
    (profile) => daysUntilBirthday(profile.birthday) !== null,
  );

  return (
    <section className="scoop-sm rounded-3xl border-[3px] border-ink bg-paper p-4">
      <div className="mb-3 flex items-center gap-2">
        <span aria-hidden className="text-xl">
          🎂
        </span>
        <h2 className="display text-base text-ink">{copy.home.tracker}</h2>
      </div>

      {dated.length === 0 ? (
        <p className="text-sm text-ink/55">{copy.home.trackerEmpty}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {dated.map((profile) => {
            const distance = daysUntilBirthday(profile.birthday);
            const palette = paletteFor(profile.palette);
            const near = distance !== null && distance <= nearWindow;

            return (
              <li key={profile.id}>
                <button
                  type="button"
                  onClick={() => onOpen(profile)}
                  className="flex w-full items-center gap-3 rounded-2xl border-[3px] border-ink px-3 py-2 text-left transition-transform hover:-translate-y-[2px]"
                  style={{ backgroundColor: near ? palette.soft : "var(--color-cream)" }}
                >
                  <span aria-hidden className="text-xl">
                    {profile.emoji}
                  </span>
                  <span className="display min-w-0 flex-1 truncate text-sm text-ink">
                    {profile.name}
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-ink/60">
                    {birthdayLabel(profile.birthday)}
                  </span>
                  <span
                    className={`display shrink-0 rounded-full border-[3px] border-ink px-2 py-0.5 text-[0.65rem] text-ink ${
                      near ? "bg-baunilha" : "bg-paper"
                    }`}
                  >
                    {countdownLabel(distance)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
