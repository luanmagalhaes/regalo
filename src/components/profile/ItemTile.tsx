"use client";

import { useState } from "react";
import { BalloonTip } from "@/components/ui/BalloonTip";
import { Button } from "@/components/ui/Button";
import { CartoonIcon } from "@/components/ui/CartoonIcon";
import { copy } from "@/data/copy";
import type { Palette } from "@/data/palettes";
import { sound } from "@/lib/sound";
import type { ProfileItem } from "@/types/profile";

interface ItemTileProps {
  item: ProfileItem;
  palette: Palette;
  interactive: boolean;
  onOpen: () => void;
}

export function ItemTile({ item, palette, interactive, onOpen }: ItemTileProps) {
  const [showing, setShowing] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          sound.pick();
          setShowing(true);
        }}
        aria-label={`Ver ${item.label}`}
        title={`${item.label}: ${item.value}${item.hint ? ` (${item.hint})` : ""}`}
        className="animate-pop-in relative flex flex-col items-center gap-1 rounded-[1.5rem] border-[3px] border-ink bg-paper p-2.5 text-center shadow-[0_4px_0_var(--color-ink)] transition-transform duration-150 hover:-translate-y-[3px] active:translate-y-[2px]"
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
      </button>

      {showing ? (
        <BalloonTip
          title={item.label}
          color={palette.soft}
          onClose={() => setShowing(false)}
          footer={
            interactive ? (
              <Button
                variant="candy"
                size="md"
                fullWidth
                onClick={() => {
                  sound.tap();
                  setShowing(false);
                  onOpen();
                }}
              >
                ✏️ Editar
              </Button>
            ) : null
          }
        >
          <span
            className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl border-[3px] border-ink"
            style={{ backgroundColor: palette.scoop, color: palette.soft }}
          >
            <CartoonIcon name={item.icon} className="h-11 w-11" />
          </span>

          <p className="display text-2xl leading-tight break-words">
            {item.value.length > 0 ? item.value : "Ainda sem resposta"}
          </p>

          {item.hint ? (
            <p className="mt-2 text-sm leading-relaxed break-words text-ink/75">{item.hint}</p>
          ) : null}

          {item.pending ? (
            <p className="display mt-3 inline-block rounded-full border-[3px] border-ink bg-baunilha px-3 py-1 text-xs text-ink">
              ainda falta confirmar
            </p>
          ) : null}
        </BalloonTip>
      ) : null}
    </>
  );
}
