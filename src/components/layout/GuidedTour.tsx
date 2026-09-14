"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { sound } from "@/lib/sound";

export interface TourStep {
  target: string;
  emoji: string;
  title: string;
  body: string;
}

interface Spot {
  left: number;
  top: number;
  width: number;
  height: number;
  tall: boolean;
}

interface GuidedTourProps {
  steps: readonly TourStep[];
  onClose: () => void;
}

const padding = 8;
const gap = 16;

function spotFor(target: string, balloonHeight: number): Spot | null {
  const node = document.querySelector(`[data-tour="${target}"]`);

  if (!node) {
    return null;
  }

  const box = node.getBoundingClientRect();
  const wanted = box.height + padding * 2;
  const room = window.innerHeight - balloonHeight - gap * 2;
  const tall = wanted > room;
  const top = tall ? gap : Math.max(gap, box.top - padding);

  return {
    left: Math.max(4, box.left - padding),
    top,
    width: Math.min(window.innerWidth - 8, box.width + padding * 2),
    height: Math.min(wanted, window.innerHeight - balloonHeight - gap * 2 - top + gap),
    tall,
  };
}

export function GuidedTour({ steps, onClose }: GuidedTourProps) {
  const [index, setIndex] = useState(0);
  const [spot, setSpot] = useState<Spot | null>(null);
  const balloonRef = useRef<HTMLDivElement>(null);

  const step = steps[index];

  const measure = useCallback(() => {
    setSpot(spotFor(steps[index].target, balloonRef.current?.offsetHeight ?? 230));
  }, [index, steps]);

  useEffect(() => {
    const node = document.querySelector(`[data-tour="${steps[index].target}"]`);
    const box = node?.getBoundingClientRect();
    const roomy = box ? box.height + padding * 2 < window.innerHeight * 0.5 : true;

    node?.scrollIntoView({ block: roomy ? "center" : "start", behavior: "smooth" });

    const settle = window.setTimeout(measure, 420);
    const again = window.setTimeout(measure, 900);

    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);

    return () => {
      window.clearTimeout(settle);
      window.clearTimeout(again);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [index, measure, steps]);

  const last = index === steps.length - 1;
  const targetMiddle = spot === null ? 0 : spot.top + spot.height / 2;
  const balloonBelow =
    spot === null || spot.tall || targetMiddle < window.innerHeight / 2;

  return (
    <div className="fixed inset-0 z-[75]" role="dialog" aria-modal="true" aria-label={step.title}>
      {spot ? (
        <div
          className="pointer-events-none fixed rounded-2xl ring-4 ring-baunilha transition-all duration-300"
          style={{
            left: spot.left,
            top: spot.top,
            width: spot.width,
            height: spot.height,
            boxShadow: "0 0 0 9999px rgba(59, 36, 80, 0.74)",
          }}
        />
      ) : (
        <div className="fixed inset-0 bg-ink/74" />
      )}

      <div
        ref={balloonRef}
        className="animate-pop-in fixed left-1/2 w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 rounded-[1.5rem] border-[3px] border-ink bg-paper p-4 shadow-[0_8px_0_var(--color-ink)]"
        style={
          balloonBelow
            ? { bottom: "calc(var(--safe-bottom) + 1rem)" }
            : { top: "calc(var(--safe-top) + 1rem)" }
        }
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>
            {step.emoji}
          </span>
          <h3 className="display text-lg leading-tight text-ink">{step.title}</h3>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-ink/75">{step.body}</p>

        <div className="mt-3 flex justify-center gap-1.5">
          {steps.map((entry, position) => (
            <span
              key={entry.target}
              className={`h-2 rounded-full border-2 border-ink ${
                position === index ? "w-5 bg-morango" : "w-2 bg-paper"
              }`}
            />
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2">
          {index > 0 ? (
            <Button
              variant="paper"
              size="md"
              onClick={() => {
                sound.tap();
                setIndex(index - 1);
              }}
            >
              ←
            </Button>
          ) : null}

          <Button
            variant={last ? "mint" : "candy"}
            size="md"
            fullWidth
            onClick={() => {
              if (last) {
                sound.party();
                onClose();

                return;
              }

              sound.pick();
              setIndex(index + 1);
            }}
          >
            {last ? "Entendi, bora" : "Próximo"}
          </Button>
        </div>

        {last ? null : (
          <button
            type="button"
            onClick={onClose}
            className="display mt-1.5 w-full rounded-xl px-3 py-1 text-xs text-ink/45 transition-colors hover:text-ink"
          >
            Pular
          </button>
        )}
      </div>
    </div>
  );
}
