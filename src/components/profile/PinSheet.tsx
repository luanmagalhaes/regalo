"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import type { Palette } from "@/data/palettes";
import { sound } from "@/lib/sound";

const size = 4;
const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "apagar"];

interface PinSheetProps {
  name: string;
  emoji: string;
  locked: boolean;
  palette: Palette;
  busy: boolean;
  problem: string | null;
  onSubmit: (pin: string) => void;
  onClose: () => void;
}

export function PinSheet({
  name,
  emoji,
  locked,
  palette,
  busy,
  problem,
  onSubmit,
  onClose,
}: PinSheetProps) {
  const [pin, setPin] = useState("");
  const [confirming, setConfirming] = useState<string | null>(null);
  const [mismatch, setMismatch] = useState(false);

  const creating = !locked;
  const asking = creating && confirming !== null;

  const finish = (value: string) => {
    if (!creating) {
      onSubmit(value);
      setPin("");

      return;
    }

    if (confirming === null) {
      sound.pick();
      setConfirming(value);
      setPin("");

      return;
    }

    if (confirming !== value) {
      sound.oops();
      setMismatch(true);
      setConfirming(null);
      setPin("");

      return;
    }

    onSubmit(value);
    setPin("");
  };

  const press = (key: string) => {
    if (busy) {
      return;
    }

    if (key === "apagar") {
      sound.tap();
      setPin((current) => current.slice(0, -1));

      return;
    }

    if (key === "" || pin.length >= size) {
      return;
    }

    sound.pop();
    setMismatch(false);

    const next = pin + key;

    setPin(next);

    if (next.length === size) {
      window.setTimeout(() => finish(next), 180);
    }
  };

  const title = creating
    ? asking
      ? "Repete o segredinho"
      : "Cria o seu segredinho"
    : "Qual é o seu segredinho?";

  const subtitle = creating
    ? asking
      ? "Repita os mesmos 4 números. Ao confirmar, esse vira o PIN definitivo deste espaço."
      : `Este espaço ainda não tem PIN. Os 4 números que você escolher agora ficam valendo.`
    : `Este espaço já tem PIN. Digite os 4 números de ${name} para editar.`;

  return (
    <Sheet title={title} subtitle={subtitle} accent={palette.soft} onClose={onClose}>
      <div className="flex flex-col items-center gap-4">
        <span
          className="animate-float-soft flex h-20 w-20 items-center justify-center rounded-3xl border-[3px] border-ink text-4xl"
          style={{ backgroundColor: palette.soft }}
          aria-hidden
        >
          {creating ? "🎀" : emoji}
        </span>

        <div className={`flex gap-2.5 ${mismatch ? "animate-wiggle" : ""}`}>
          {Array.from({ length: size }, (_, index) => (
            <span
              key={index}
              className="flex h-14 w-12 items-center justify-center rounded-2xl border-[3px] border-ink bg-cream text-2xl"
              style={{
                backgroundColor: index < pin.length ? palette.soft : undefined,
              }}
            >
              <span className="display text-ink">{index < pin.length ? "●" : ""}</span>
            </span>
          ))}
        </div>

        {mismatch ? (
          <p className="rounded-2xl border-[3px] border-ink bg-baunilha px-3 py-2 text-xs font-semibold text-ink">
            Os dois não bateram. Começa de novo, sem pressa. 🍦
          </p>
        ) : null}

        {problem ? (
          <p className="rounded-2xl border-[3px] border-ink bg-morango px-3 py-2 text-center text-xs font-semibold text-paper">
            {problem}
          </p>
        ) : null}

        <div className="grid w-full max-w-[16rem] grid-cols-3 gap-2">
          {keys.map((key, index) =>
            key === "" ? (
              <span key={`empty-${index}`} />
            ) : (
              <button
                key={key}
                type="button"
                disabled={busy}
                onClick={() => press(key)}
                aria-label={key === "apagar" ? "Apagar um número" : `Número ${key}`}
                className="display flex h-14 items-center justify-center rounded-2xl border-[3px] border-ink bg-paper text-xl text-ink shadow-[0_4px_0_var(--color-ink)] transition-transform duration-100 hover:-translate-y-[2px] active:translate-y-[2px] active:shadow-[0_2px_0_var(--color-ink)] disabled:opacity-40"
              >
                {key === "apagar" ? "⌫" : key}
              </button>
            ),
          )}
        </div>

        <p className="text-center text-xs text-ink/55">
          {busy
            ? "Conferindo..."
            : creating
              ? "Anote esse número: é ele que abre o seu espaço em qualquer celular, e ele fica gravado assim que você confirmar."
              : "Esqueceu? Chame o dono da casa para liberar com a senha mestre."}
        </p>
      </div>
    </Sheet>
  );
}
