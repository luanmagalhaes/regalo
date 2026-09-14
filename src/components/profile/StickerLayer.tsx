"use client";

import { useRef, useState } from "react";
import { sound } from "@/lib/sound";
import type { Sticker } from "@/types/profile";

interface StickerLayerProps {
  stickers: readonly Sticker[];
  editing: boolean;
  onChange: (stickers: Sticker[]) => void;
  onCommit: (stickers: Sticker[]) => void;
}

const minScale = 0.6;
const maxScale = 2.6;

export function StickerLayer({ stickers, editing, onChange, onCommit }: StickerLayerProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const draggingId = useRef<string | null>(null);
  const moved = useRef(false);
  const [selected, setSelected] = useState<string | null>(null);

  const place = (id: string, clientX: number, clientY: number) => {
    const area = areaRef.current;

    if (!area) {
      return;
    }

    const rect = area.getBoundingClientRect();
    const x = Math.min(98, Math.max(2, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.min(96, Math.max(4, ((clientY - rect.top) / rect.height) * 100));

    onChange(stickers.map((sticker) => (sticker.id === id ? { ...sticker, x, y } : sticker)));
  };

  const patch = (id: string, change: Partial<Sticker>) => {
    const next = stickers.map((sticker) =>
      sticker.id === id ? { ...sticker, ...change } : sticker,
    );

    onChange(next);
    onCommit(next);
  };

  return (
    <div
      ref={areaRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden rounded-[1.75rem] ${
        editing ? "pointer-events-auto ring-[3px] ring-dashed ring-ink/35" : ""
      }`}
    >
      {stickers.map((sticker) => (
        <div
          key={sticker.id}
          className="absolute"
          style={{ left: `${sticker.x}%`, top: `${sticker.y}%` }}
        >
          <button
            type="button"
            disabled={!editing}
            aria-label={`Adesivo ${sticker.emoji}`}
            onPointerDown={(event) => {
              if (!editing) {
                return;
              }

              draggingId.current = sticker.id;
              moved.current = false;
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (draggingId.current !== sticker.id) {
                return;
              }

              moved.current = true;
              place(sticker.id, event.clientX, event.clientY);
            }}
            onPointerUp={(event) => {
              if (draggingId.current !== sticker.id) {
                return;
              }

              draggingId.current = null;
              event.currentTarget.releasePointerCapture(event.pointerId);

              if (moved.current) {
                onCommit([...stickers]);
              } else {
                sound.tap();
                setSelected((current) => (current === sticker.id ? null : sticker.id));
              }
            }}
            className={`animate-sticker-drop block -translate-x-1/2 -translate-y-1/2 select-none text-4xl leading-none ${
              editing ? "cursor-grab active:cursor-grabbing" : "cursor-default"
            }`}
            style={{
              transform: `translate(-50%, -50%) scale(${sticker.scale}) rotate(${sticker.rotation}deg)`,
              touchAction: "none",
            }}
          >
            {sticker.emoji}
          </button>

          {editing && selected === sticker.id ? (
            <div
              className="absolute z-10 flex -translate-x-1/2 items-center gap-1 rounded-2xl border-[3px] border-ink bg-paper px-1.5 py-1 shadow-[0_4px_0_var(--color-ink)]"
              style={{ left: "50%", top: "calc(50% + 2.4rem)" }}
            >
              <button
                type="button"
                aria-label="Diminuir adesivo"
                onClick={() =>
                  patch(sticker.id, { scale: Math.max(minScale, sticker.scale - 0.2) })
                }
                className="display px-1.5 text-base text-ink"
              >
                −
              </button>
              <button
                type="button"
                aria-label="Aumentar adesivo"
                onClick={() =>
                  patch(sticker.id, { scale: Math.min(maxScale, sticker.scale + 0.2) })
                }
                className="display px-1.5 text-base text-ink"
              >
                +
              </button>
              <button
                type="button"
                aria-label="Girar adesivo"
                onClick={() =>
                  patch(sticker.id, { rotation: ((sticker.rotation + 195) % 360) - 180 })
                }
                className="display px-1.5 text-base text-ink"
              >
                ↻
              </button>
              <button
                type="button"
                aria-label="Tirar adesivo"
                onClick={() => {
                  sound.tap();
                  setSelected(null);

                  const next = stickers.filter((entry) => entry.id !== sticker.id);

                  onChange(next);
                  onCommit(next);
                }}
                className="display px-1.5 text-base text-morango"
              >
                ✕
              </button>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
