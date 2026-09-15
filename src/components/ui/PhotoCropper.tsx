"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { cropToDataUrl, type LoadedPhoto } from "@/lib/photo";
import { sound } from "@/lib/sound";

const frame = 260;
const maxZoom = 4;

interface PhotoCropperProps {
  photo: LoadedPhoto;
  accent: string;
  onDone: (dataUrl: string) => void;
  onCancel: () => void;
}

export function PhotoCropper({ photo, accent, onDone, onCancel }: PhotoCropperProps) {
  const cover = Math.max(frame / photo.width, frame / photo.height);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [problem, setProblem] = useState<string | null>(null);
  const dragging = useRef(false);
  const grab = useRef({ x: 0, y: 0 });

  const shownWidth = photo.width * cover * zoom;
  const shownHeight = photo.height * cover * zoom;

  const clamp = (next: { x: number; y: number }) => ({
    x: Math.min(0, Math.max(frame - shownWidth, next.x)),
    y: Math.min(0, Math.max(frame - shownHeight, next.y)),
  });

  const applyZoom = (next: number) => {
    setZoom(next);
    setOffset((current) => ({
      x: Math.min(0, Math.max(frame - photo.width * cover * next, current.x)),
      y: Math.min(0, Math.max(frame - photo.height * cover * next, current.y)),
    }));
  };

  const confirm = () => {
    const scale = cover * zoom;

    try {
      const data = cropToDataUrl(photo.image, {
        x: -offset.x / scale,
        y: -offset.y / scale,
        side: frame / scale,
      });

      sound.saved();
      onDone(data);
    } catch (cause) {
      sound.oops();
      setProblem(cause instanceof Error ? cause.message : "Não consegui cortar essa foto.");
    }
  };

  return (
    <Sheet
      title="Ajeite a sua foto"
      subtitle="Arraste para escolher o pedaço e use a barrinha para aproximar."
      accent={accent}
      onClose={onCancel}
      footer={
        <div className="flex flex-col gap-2">
          <Button variant="candy" size="lg" fullWidth onClick={confirm}>
            Usar essa foto
          </Button>
          <button
            type="button"
            onClick={onCancel}
            className="display rounded-xl px-3 py-2 text-sm text-ink/50 transition-colors hover:text-ink"
          >
            Escolher outra
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="relative overflow-hidden rounded-[1.5rem] border-[3px] border-ink bg-cream"
          style={{ width: frame, height: frame, touchAction: "none" }}
          onPointerDown={(event) => {
            dragging.current = true;
            grab.current = { x: event.clientX - offset.x, y: event.clientY - offset.y };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (!dragging.current) {
              return;
            }

            setOffset(
              clamp({ x: event.clientX - grab.current.x, y: event.clientY - grab.current.y }),
            );
          }}
          onPointerUp={(event) => {
            dragging.current = false;
            event.currentTarget.releasePointerCapture(event.pointerId);
          }}
        >
          <img
            src={photo.url}
            alt=""
            draggable={false}
            className="pointer-events-none absolute max-w-none select-none"
            style={{
              width: shownWidth,
              height: shownHeight,
              left: offset.x,
              top: offset.y,
            }}
          />

          <div className="pointer-events-none absolute inset-0 rounded-[1.25rem] ring-[3px] ring-inset ring-paper/70" />
        </div>

        <label className="flex w-full max-w-[16rem] items-center gap-3">
          <span aria-hidden className="text-sm">
            🔍
          </span>
          <input
            type="range"
            min={1}
            max={maxZoom}
            step={0.02}
            value={zoom}
            onChange={(event) => applyZoom(Number(event.target.value))}
            aria-label="Aproximar a foto"
            className="h-2 w-full cursor-pointer appearance-none rounded-full border-[3px] border-ink bg-cream accent-[var(--color-morango)]"
          />
        </label>

        <p className="text-center text-xs text-ink/55">
          O pedaço dentro do quadrado é o que o Bibuaidi vai ver.
        </p>

        {problem ? (
          <p className="rounded-2xl border-[3px] border-ink bg-morango px-3 py-2 text-xs font-semibold text-paper">
            {problem}
          </p>
        ) : null}
      </div>
    </Sheet>
  );
}
