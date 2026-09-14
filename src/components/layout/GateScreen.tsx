"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { TextField } from "@/components/ui/TextField";
import { Wordmark } from "@/components/ui/Wordmark";
import { brand } from "@/data/copy";
import { api } from "@/lib/api";
import { sound } from "@/lib/sound";

interface GateScreenProps {
  onOpen: () => void;
}

export function GateScreen({ onOpen }: GateScreenProps) {
  const [value, setValue] = useState("");
  const [problem, setProblem] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (value.trim().length === 0) {
      setProblem("Escreva a senha da turma.");

      return;
    }

    setBusy(true);
    setProblem(null);

    try {
      await api.unlock(value);
      sound.party();
      onOpen();
    } catch (cause) {
      sound.oops();
      setProblem(cause instanceof Error ? cause.message : "não consegui entrar");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 py-10 text-center">
        <div className="animate-float-soft text-7xl" aria-hidden>
          🎁
        </div>

        <div>
          <Wordmark size="lg" />
          <p className="mt-2 text-sm font-semibold text-ink/65">{brand.tagline}</p>
        </div>

        <div className="w-full max-w-sm rounded-3xl border-[3px] border-ink bg-paper p-5 scoop">
          <TextField
            label="Senha da turma"
            type="password"
            autoComplete="current-password"
            placeholder="a senha combinada no grupo"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setProblem(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                void submit();
              }
            }}
          />

          {problem ? (
            <p className="mt-3 rounded-2xl border-[3px] border-ink bg-morango px-3 py-2 text-xs font-semibold text-paper">
              {problem}
            </p>
          ) : null}

          <div className="mt-4">
            <Button variant="candy" size="lg" fullWidth disabled={busy} onClick={() => void submit()}>
              {busy ? "Abrindo..." : "Entrar"}
            </Button>
          </div>
        </div>

        <p className="max-w-xs text-xs text-ink/55">
          A lista tem medida de roupa da galera. A senha existe para isso não ficar aberto na
          internet.
        </p>
      </div>
    </Screen>
  );
}
