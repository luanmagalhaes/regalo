"use client";

import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { Wordmark } from "@/components/ui/Wordmark";

export default function ErrorScreen({ reset }: { error: Error; reset: () => void }) {
  return (
    <Screen>
      <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
        <span className="text-6xl" aria-hidden>
          🎈
        </span>
        <Wordmark size="md" />
        <p className="max-w-sm text-sm font-semibold text-ink/70">
          Alguma coisa estourou aqui do nosso lado. A lista não se perdeu.
        </p>
        <Button variant="candy" size="lg" onClick={reset}>
          Tentar de novo
        </Button>
      </div>
    </Screen>
  );
}
