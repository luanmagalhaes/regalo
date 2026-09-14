"use client";

import { LevelBar } from "@/components/profile/LevelBar";
import { CartoonIcon } from "@/components/ui/CartoonIcon";
import { copy } from "@/data/copy";
import { paletteFor } from "@/data/palettes";
import { birthdayLabel, countdownLabel, daysUntilBirthday, isNear } from "@/lib/birthday";
import { isEmptyProfile, pendingCount, progressFor } from "@/lib/progress";
import type { Profile } from "@/types/profile";

interface ProfileCardProps {
  profile: Profile;
  isMe: boolean;
  onOpen: () => void;
}

export function ProfileCard({ profile, isMe, onOpen }: ProfileCardProps) {
  const palette = paletteFor(profile.palette);
  const progress = progressFor(profile);
  const distance = daysUntilBirthday(profile.birthday);
  const date = birthdayLabel(profile.birthday);
  const near = isNear(profile.birthday);
  const preview = profile.items.filter((item) => item.value.length > 0).slice(0, 4);
  const toConfirm = pendingCount(profile);

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Abrir o perfil de ${profile.name}`}
      className="animate-pop-in scoop relative flex w-full flex-col gap-3 overflow-hidden rounded-[1.75rem] border-[3px] border-ink p-4 text-left transition-transform duration-150 hover:-translate-y-[3px] active:translate-y-[2px]"
      style={{ backgroundImage: palette.stage }}
    >
      {near ? (
        <span className="display animate-cake-bounce absolute right-3 top-3 rounded-full border-[3px] border-ink bg-baunilha px-2 py-0.5 text-[0.65rem] text-ink">
          🎂 {countdownLabel(distance)}
        </span>
      ) : null}

      <div className="flex items-center gap-3">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-[3px] border-ink bg-paper text-3xl"
          aria-hidden
        >
          {profile.emoji}
        </span>

        <div className="min-w-0 flex-1">
          <span className="display block truncate text-xl leading-tight text-ink">
            {profile.name}
            {isMe ? <span className="ml-1.5 text-xs text-ink/50">(você)</span> : null}
          </span>
          <span className="block truncate text-xs font-semibold text-ink/60">
            {date ? `🎂 ${date}` : "sem data de aniversário"}
          </span>
        </div>
      </div>

      {preview.length > 0 ? (
        <ul className="flex gap-1.5">
          {preview.map((item) => (
            <li
              key={item.id}
              className="flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl border-[3px] border-ink bg-paper/85 px-1 py-1.5"
            >
              <span style={{ color: palette.scoop }}>
                <CartoonIcon name={item.icon} className="h-7 w-7" />
              </span>
              <span className="display w-full truncate text-center text-[0.68rem] text-ink">
                {item.value}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border-[3px] border-dashed border-ink/30 bg-paper/60 px-3 py-2 text-xs font-semibold text-ink/55">
          {isEmptyProfile(profile) ? copy.home.pendingProfile : "Nenhum tamanho preenchido ainda"}
        </p>
      )}

      <div className="rounded-2xl bg-paper/70 px-3 py-2">
        <LevelBar progress={progress} palette={palette} compact />
      </div>

      {toConfirm > 0 ? (
        <span className="display text-[0.68rem] text-ink/55">
          {toConfirm} {toConfirm === 1 ? "item para confirmar" : "itens para confirmar"}
        </span>
      ) : null}
    </button>
  );
}
