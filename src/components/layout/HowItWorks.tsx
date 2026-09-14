"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CartoonIcon } from "@/components/ui/CartoonIcon";
import { sound } from "@/lib/sound";

interface Slide {
  emoji: string;
  title: string;
  body: string;
  art: "items" | "profile" | "party" | "cake";
}

const slides: readonly Slide[] = [
  {
    emoji: "🎁",
    title: "Pra que serve",
    body: "Aqui fica o tamanho e o gosto de cada um da turma. Ninguém mais precisa perguntar o número do pé três dias antes do aniversário.",
    art: "items",
  },
  {
    emoji: "👕",
    title: "Guardar um item",
    body: "Toque no + , escolha o desenho e escreva o que quiser no campo. Roupa e calçado pedem o número; doce, livro e jogo pedem só como você gosta.",
    art: "items",
  },
  {
    emoji: "🎨",
    title: "O espaço é seu",
    body: "Troque a cor, a carinha e cole quantos adesivos quiser. Os adesivos arrastam com o dedo e ficam onde você largar.",
    art: "profile",
  },
  {
    emoji: "🎂",
    title: "Aniversário no radar",
    body: "Coloque sua data e o app avisa a turma quinze dias antes. Dá tempo de comprar sem correria.",
    art: "cake",
  },
  {
    emoji: "🔒",
    title: "Seu PIN, seu espaço",
    body: "Cada um tem um PIN de 4 números. Com ele você edita o seu espaço em qualquer celular; sem ele, o perfil dos outros aparece só para leitura.",
    art: "profile",
  },
  {
    emoji: "🏆",
    title: "Medalhas",
    body: "Cada parte preenchida acende uma medalha e sobe o nível do perfil. É só para cutucar quem ainda não respondeu.",
    art: "party",
  },
];

interface HowItWorksProps {
  onClose: () => void;
}

export function HowItWorks({ onClose }: HowItWorksProps) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const last = index === slides.length - 1;

  const go = (next: number) => {
    sound.pick();
    setIndex(next);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/70 p-0 sm:items-center sm:p-4">
      <div className="animate-sheet-up flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-[2rem] border-[3px] border-ink bg-paper shadow-[0_-8px_0_var(--color-ink)] sm:rounded-[2rem] sm:shadow-[0_10px_0_var(--color-ink)]">
        <div className="sprinkles relative shrink-0 bg-morango-soft px-5 py-6 text-center">
          <span className="animate-float-soft relative block text-6xl" aria-hidden>
            {slide.emoji}
          </span>
          <h2 className="display relative mt-2 text-2xl leading-tight text-ink">{slide.title}</h2>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <p className="text-center text-sm leading-relaxed text-ink/75">{slide.body}</p>

          {slide.art === "items" ? (
            <div className="mt-4 flex justify-center gap-2">
              {[
                { icon: "shirt", value: "M/G" },
                { icon: "sneaker", value: "43" },
                { icon: "ring", value: "17" },
              ].map((sample) => (
                <div
                  key={sample.icon}
                  className="flex w-20 flex-col items-center gap-1 rounded-2xl border-[3px] border-ink bg-cream p-2"
                >
                  <span className="text-morango">
                    <CartoonIcon name={sample.icon} className="h-9 w-9" />
                  </span>
                  <span className="display text-sm text-ink">{sample.value}</span>
                </div>
              ))}
            </div>
          ) : null}

          {slide.art === "profile" ? (
            <div className="mt-4 flex justify-center gap-2">
              {["morango", "pistache", "blueberry", "uva", "caramelo"].map((color) => (
                <span
                  key={color}
                  className="h-9 w-9 rounded-full border-[3px] border-ink"
                  style={{ backgroundColor: `var(--color-${color})` }}
                />
              ))}
            </div>
          ) : null}

          {slide.art === "cake" ? (
            <p className="mt-4 rounded-2xl border-[3px] border-ink bg-cream px-3 py-2 text-center text-sm font-semibold text-ink">
              🎂 Faltam 15 dias para o aniversário de alguém
            </p>
          ) : null}

          {slide.art === "party" ? (
            <ul className="mt-4 flex flex-wrap justify-center gap-2">
              {["🎀", "🍦", "🧁", "🎂", "💝", "🙅", "✨", "🏆"].map((emoji) => (
                <li
                  key={emoji}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-ink bg-cream text-lg"
                >
                  {emoji}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="shrink-0 border-t-[3px] border-ink/10 px-5 pb-[calc(var(--safe-bottom)+1rem)] pt-3">
          <div className="mb-3 flex justify-center gap-1.5">
            {slides.map((entry, position) => (
              <button
                key={entry.title}
                type="button"
                aria-label={`Ir para ${entry.title}`}
                onClick={() => go(position)}
                className={`h-2.5 rounded-full border-2 border-ink transition-all ${
                  position === index ? "w-6 bg-morango" : "w-2.5 bg-paper"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {index > 0 ? (
              <Button variant="paper" size="lg" onClick={() => go(index - 1)}>
                ←
              </Button>
            ) : null}

            <Button
              variant={last ? "mint" : "candy"}
              size="lg"
              fullWidth
              onClick={() => {
                if (last) {
                  sound.party();
                  onClose();

                  return;
                }

                go(index + 1);
              }}
            >
              {last ? "Bora montar a lista" : "Próximo"}
            </Button>
          </div>

          {last ? null : (
            <button
              type="button"
              onClick={onClose}
              className="display mt-2 w-full rounded-xl px-3 py-1.5 text-sm text-ink/50 transition-colors hover:text-ink"
            >
              Pular
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
