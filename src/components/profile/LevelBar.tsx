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
        <p className="mt-1.5 text-xs text-ink/55">
          {progress.percent === 100
            ? "Perfil completo. A turma não tem mais desculpa."
            : `Faltam ${progress.total - progress.filled} passos para completar o perfil.`}
        </p>
      )}
    </div>
  );
}

interface BadgeShelfProps {
  progress: Progress;
}

export function BadgeShelf({ progress }: BadgeShelfProps) {
  return (
    <ul className="flex flex-wrap gap-2">
      {progress.badges.map((badge) => (
        <li
          key={badge.key}
          title={badge.hint}
          className={`flex items-center gap-1.5 rounded-full border-[3px] border-ink px-2.5 py-1 text-xs font-semibold ${
            badge.earned ? "bg-baunilha text-ink" : "bg-paper text-ink/35 grayscale"
          }`}
        >
          <span aria-hidden>{badge.emoji}</span>
          <span>{badge.title}</span>
        </li>
      ))}
    </ul>
  );
}
