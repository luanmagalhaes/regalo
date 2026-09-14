"use client";

import { useCallback, useEffect, useState } from "react";
import { NewProfileSheet } from "@/components/home/NewProfileSheet";
import { PinSheet } from "@/components/profile/PinSheet";
import { Button } from "@/components/ui/Button";
import { GiftArt } from "@/components/ui/GiftArt";
import { Screen } from "@/components/ui/Screen";
import { Wordmark } from "@/components/ui/Wordmark";
import { brand } from "@/data/copy";
import { paletteFor } from "@/data/palettes";
import { api, type RosterEntry } from "@/lib/api";
import { sound } from "@/lib/sound";

interface WelcomeScreenProps {
  onIn: (profileId: string) => void;
}

export function WelcomeScreen({ onIn }: WelcomeScreenProps) {
  const [roster, setRoster] = useState<RosterEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [picked, setPicked] = useState<RosterEntry | null>(null);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const { roster: fresh } = await api.roster();

      setRoster(fresh);
    } catch {
      setProblem("Não consegui carregar a turma. Veja sua conexão.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const first = window.setTimeout(() => void load(), 0);

    return () => window.clearTimeout(first);
  }, [load]);

  const enter = (profileId: string, pin: string) => {
    setBusy(true);
    setProblem(null);

    void api
      .claim(profileId, pin)
      .then(() => {
        sound.party();
        setPicked(null);
        onIn(profileId);
      })
      .catch(async (cause: unknown) => {
        sound.oops();
        setProblem(cause instanceof Error ? cause.message : "Não consegui entrar");

        try {
          const { roster: fresh } = await api.roster();

          setRoster(fresh);
          setPicked((current) =>
            current ? (fresh.find((entry) => entry.id === current.id) ?? current) : current,
          );
        } catch {
          return;
        }
      })
      .finally(() => setBusy(false));
  };

  const create = (draft: Parameters<typeof api.createProfile>[0]) => {
    setBusy(true);
    setProblem(null);

    void api
      .createProfile(draft)
      .then(({ profile }) => {
        sound.party();
        setCreating(false);
        onIn(profile.id);
      })
      .catch((cause: unknown) => {
        sound.oops();
        setProblem(cause instanceof Error ? cause.message : "Não consegui criar o perfil");
      })
      .finally(() => setBusy(false));
  };

  return (
    <Screen
      footer={
        <Button
          variant="mint"
          size="lg"
          fullWidth
          onClick={() => {
            sound.tap();
            setCreating(true);
          }}
        >
          Não estou na lista — criar meu espaço
        </Button>
      }
    >
      <header className="mb-5 text-center">
        <div className="animate-rise-in">
          <Wordmark size="md" />
        </div>
        <p className="mt-1.5 text-sm font-semibold text-ink/65">{brand.tagline}</p>
      </header>

      <div className="flex flex-col gap-3 pb-4">
        <div className="scoop-sm rounded-3xl border-[3px] border-ink bg-paper p-4 text-center">
          <GiftArt idPrefix="welcome" className="animate-float-soft mx-auto w-24" />
          <h2 className="display mt-1 text-xl text-ink">Quem é você?</h2>
          <p className="mt-1 text-sm text-ink/65">
            Toque no seu nome e crie um PIN de 4 números. Ele é seu: ninguém mexe no seu espaço sem
            ele.
          </p>
        </div>

        {problem ? (
          <p className="rounded-2xl border-[3px] border-ink bg-morango px-3 py-2 text-center text-sm font-semibold text-paper">
            {problem}
          </p>
        ) : null}

        {loading ? (
          <p className="rounded-2xl border-[3px] border-dashed border-ink/30 p-5 text-center text-sm text-ink/55">
            Abrindo os embrulhos...
          </p>
        ) : null}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {roster.map((person) => {
            const palette = paletteFor(person.palette);

            return (
              <button
                key={person.id}
                type="button"
                onClick={() => {
                  sound.pick();
                  setProblem(null);
                  setPicked(person);
                }}
                className="animate-pop-in scoop flex flex-col items-center gap-2 rounded-[1.5rem] border-[3px] border-ink p-3 transition-transform hover:-translate-y-[3px] active:translate-y-[2px]"
                style={{ backgroundImage: palette.stage }}
              >
                <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-[3px] border-ink bg-paper text-3xl">
                  {person.photo ? (
                    <img src={person.photo} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span aria-hidden>{person.emoji}</span>
                  )}
                </span>
                <span className="display w-full truncate text-center text-sm text-ink">
                  {person.name}
                </span>
                <span className="display rounded-full border-2 border-ink bg-paper/80 px-2 text-[0.6rem] text-ink/70">
                  {person.locked ? "🔒 tem PIN" : "criar PIN"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {picked ? (
        <PinSheet
          name={picked.name}
          emoji={picked.emoji}
          locked={picked.locked}
          palette={paletteFor(picked.palette)}
          busy={busy}
          problem={problem}
          onSubmit={(pin) => enter(picked.id, pin)}
          onClose={() => {
            setPicked(null);
            setProblem(null);
          }}
        />
      ) : null}

      {creating ? (
        <NewProfileSheet busy={busy} onCreate={create} onClose={() => setCreating(false)} />
      ) : null}
    </Screen>
  );
}
