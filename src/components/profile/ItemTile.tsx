"use client";

import { CartoonIcon } from "@/components/ui/CartoonIcon";
import { copy } from "@/data/copy";
import type { Palette } from "@/data/palettes";
import type { ProfileItem } from "@/types/profile";

interface ItemTileProps {
  item: ProfileItem;
  palette: Palette;
  interactive: boolean;
  onOpen: () => void;
}

export function ItemTile({ item, palette, interactive, onOpen }: ItemTileProps) {
  const Tag = interactive ? "button" : "div";

  return (
    <Tag
      {...(interactive
        ? { type: "button" as const, onClick: onOpen, "aria-label": `Editar ${item.label}` }
        : {})}
      className={`animate-pop-in relative flex flex-col items-center gap-1 rounded-[1.5rem] border-[3px] border-ink bg-paper p-2.5 text-center shadow-[0_4px_0_var(--color-ink)] ${
        interactive
          ? "transition-transform duration-150 hover:-translate-y-[3px] active:translate-y-[2px]"
          : ""
      }`}
    >
      <span className="display w-full truncate text-[0.68rem] uppercase tracking-[0.1em] text-ink/55">
        {item.label}
      </span>

      <span
        className="flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{ backgroundColor: palette.soft, color: palette.scoop }}
      >
        <CartoonIcon name={item.icon} className="h-11 w-11" />
      </span>

      <span className="display w-full truncate text-lg leading-tight text-ink">
        {item.value.length > 0 ? item.value : "—"}
      </span>

      {item.pending ? (
        <span className="display absolute -right-1.5 -top-2 rounded-full border-[3px] border-ink bg-baunilha px-1.5 py-0.5 text-[0.6rem] text-ink">
          {copy.profile.pendingTag}
        </span>
      ) : null}
    </Tag>
  );
}
