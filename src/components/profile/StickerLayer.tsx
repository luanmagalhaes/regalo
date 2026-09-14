"use client";

import { useEffect, useRef, useState } from "react";
import { sound } from "@/lib/sound";
import type { Sticker } from "@/types/profile";

interface StickerLayerProps {
  stickers: readonly Sticker[];
  onChange: (stickers: Sticker[]) => void;
  onCommit: (stickers: Sticker[]) => void;
}

const minScale = 0.6;
const maxScale = 2.6;

export function StickerLayer({ stickers, onChange, onCommit }: StickerLayerProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const draggingId = useRef<string | null>(null);
  const moved = useRef(false);
  const latest = useRef<Sticker[]>([...stickers]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    latest.current = [...stickers];
  }, [stickers]);

  const place = (id: string, clientX: number, clientY: number) => {
    const area = areaRef.current;

    if (!area) {
      return;
    }

    const rect = area.getBoundingClientRect();
    const x = Math.min(97, Math.max(3, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.min(95, Math.max(5, ((clientY - rect.top) / rect.height) * 100));
    const next = latest.current.map((sticker) =>
      sticker.id === id ? { ...sticker, x, y } : sticker,
    );

    latest.current = next;
    onChange(next);
  };

  const patch = (id: string, change: Partial<Sticker>) => {
    const next = latest.current.map((sticker) =>
      sticker.id === id ? { ...sticker, ...change } : sticker,
    );

    latest.current = next;
    onChange(next);
    onCommit(next);
  };

  return (
    <div ref={areaRef} className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.75rem]">
      {stickers.map((sticker) => (
        <div
          key={sticker.id}
          className="pointer-events-none absolute"
          style={{ left: `${sticker.x}%`, top: `${sticker.y}%` }}
        >
          <button
            type="button"
            aria-label={`Adesivo ${sticker.emoji}. Arraste para mover, toque para ajustar.`}
            onPointerDown={(event) => {
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
                sound.sticker();
                onCommit(latest.current);
              } else {
                sound.tap();
                setSelected((current) => (current === sticker.id ? null : sticker.id));
              }
            }}
            className="pointer-events-auto block cursor-grab select-none text-4xl leading-none active:cursor-grabbing"
            style={{
              transform: `translate(-50%, -50%) scale(${sticker.scale}) rotate(${sticker.rotation}deg)`,
              touchAction: "none",
            }}
          >
            {sticker.emoji}
          </button>

          {selected === sticker.id ? (
            <div
              className="pointer-events-auto absolute z-10 flex -translate-x-1/2 items-center gap-0.5 rounded-2xl border-[3px] border-ink bg-paper px-1.5 py-1 shadow-[0_4px_0_var(--color-ink)]"
              style={{ left: "50%", top: "calc(50% + 2.2rem)" }}
            >
              <button
                type="button"
                aria-label="Diminuir adesivo"
                onClick={() => patch(sticker.id, { scale: Math.max(minScale, sticker.scale - 0.2) })}
                className="display px-2 text-base text-ink"
              >
                −
              </button>
              <button
                type="button"
                aria-label="Aumentar adesivo"
                onClick={() => patch(sticker.id, { scale: Math.min(maxScale, sticker.scale + 0.2) })}
                className="display px-2 text-base text-ink"
              >
                +
              </button>
              <button
                type="button"
                aria-label="Girar adesivo"
                onClick={() => patch(sticker.id, { rotation: ((sticker.rotation + 195) % 360) - 180 })}
                className="display px-2 text-base text-ink"
              >
                ↻
              </button>
              <button
                type="button"
                aria-label="Tirar adesivo"
                onClick={() => {
                  sound.tap();
                  setSelected(null);

                  const next = latest.current.filter((entry) => entry.id !== sticker.id);

                  latest.current = next;
                  onChange(next);
                  onCommit(next);
                }}
                className="display px-2 text-base text-morango"
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
