"use client";

import { useRef, useState } from "react";
import { shrinkPhoto } from "@/lib/photo";
import { sound } from "@/lib/sound";

interface PhotoPickerProps {
  photo: string | null;
  emoji: string;
  accent: string;
  onPick: (photo: string | null) => void;
}

export function PhotoPicker({ photo, emoji, accent, onPick }: PhotoPickerProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [working, setWorking] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  const choose = async (file: File | undefined) => {
    if (!file) {
      return;
    }

    setWorking(true);
    setProblem(null);

    try {
      const shrunk = await shrinkPhoto(file);

      sound.pop();
      onPick(shrunk);
    } catch (cause) {
      sound.oops();
      setProblem(cause instanceof Error ? cause.message : "Não consegui usar essa foto.");
    } finally {
      setWorking(false);

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  };

  return (
    <div>
      <span className="display block text-xs uppercase tracking-[0.16em] text-ink/55">
        Foto (opcional)
      </span>

      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={working}
          aria-label={photo ? "Trocar a foto" : "Escolher uma foto"}
          className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-[3px] border-ink text-3xl transition-transform hover:-translate-y-[2px]"
          style={{ backgroundColor: accent }}
        >
          {photo ? (
            <img src={photo} alt="" className="h-full w-full object-cover" />
          ) : (
            <span aria-hidden>{emoji}</span>
          )}
          <span className="display absolute -bottom-0.5 right-0 rounded-lg border-2 border-ink bg-baunilha px-1 text-[0.55rem] text-ink">
            {photo ? "trocar" : "foto"}
          </span>
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-xs text-ink/60">
            {working
              ? "Preparando a foto..."
              : "A foto fica pequena e quadrada, do tamanho de um adesivo."}
          </p>

          {photo ? (
            <button
              type="button"
              disabled={working}
              onClick={() => {
                sound.tap();
                onPick(null);
              }}
              className="display mt-1.5 rounded-xl border-[3px] border-ink bg-paper px-2.5 py-1 text-xs text-ink/70 transition-transform hover:-translate-y-[2px] hover:text-morango"
            >
              Tirar a foto
            </button>
          ) : null}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => void choose(event.target.files?.[0])}
      />

      {problem ? (
        <p className="mt-2 rounded-2xl border-[3px] border-ink bg-morango px-3 py-2 text-xs font-semibold text-paper">
          {problem}
        </p>
      ) : null}
    </div>
  );
}
