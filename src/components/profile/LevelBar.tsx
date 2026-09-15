import type { Palette } from "@/data/palettes";
import { maxLevel, type Progress } from "@/lib/progress";

interface LevelBarProps {
  progress: Progress;
  palette: Palette;
  compact?: boolean;
}

export function LevelBar({ progress, palette, compact = false }: LevelBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between gap-2">
        <span className="display truncate text-xs uppercase tracking-[0.14em] text-ink/60">
          Nível {progress.level}/{maxLevel} · {progress.levelTitle}
        </span>
        <span className="display shrink-0 text-xs text-ink/50">{progress.percent}%</span>
      </div>

      <div className="mt-1.5 h-3.5 w-full overflow-hidden rounded-full border-[3px] border-ink bg-paper">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${Math.max(4, progress.percent)}%`, backgroundColor: palette.scoop }}
        />
      </div>

      {compact ? null : (
        <p className="mt-1.5 text-xs text-ink/60">
          {progress.nextStep
            ? `Próximo passo: ${progress.nextStep}`
            : "Perfil completo. O Bibuaidi não tem mais desculpa."}
        </p>
      )}
    </div>
  );
}

interface BadgeShelfProps {
  progress: Progress;
  palette: Palette;
}

export function BadgeShelf({ progress, palette }: BadgeShelfProps) {
  return (
    <div>
      <p className="mb-3 text-xs text-ink/60">
        Cada medalha acende sozinha quando você preenche uma parte do perfil. São{" "}
        {progress.total} no total e você já tem {progress.filled}.
      </p>

      <ul className="flex flex-col gap-2">
        {progress.badges.map((badge) => (
          <li
            key={badge.key}
            className={`flex items-start gap-3 rounded-2xl border-[3px] border-ink px-3 py-2.5 ${
              badge.earned ? "bg-cream" : "bg-paper"
            }`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-[3px] border-ink text-lg ${
                badge.earned ? "" : "opacity-40 grayscale"
              }`}
              style={{ backgroundColor: badge.earned ? palette.soft : "transparent" }}
              aria-hidden
            >
              {badge.emoji}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="display text-sm text-ink">{badge.title}</span>
                {badge.earned ? (
                  <span className="display rounded-full border-[3px] border-ink bg-pistache px-1.5 text-[0.6rem] text-ink">
                    feito
                  </span>
                ) : null}
              </div>
              <p className={`mt-0.5 text-xs ${badge.earned ? "text-ink/60" : "text-ink/50"}`}>
                {badge.earned ? badge.hint : badge.todo}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
