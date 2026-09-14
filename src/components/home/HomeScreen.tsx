"use client";

import { BirthdayTrail } from "@/components/home/BirthdayTrail";
import { ProfileCard } from "@/components/home/ProfileCard";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { Wordmark } from "@/components/ui/Wordmark";
import { brand, copy } from "@/data/copy";
import { sound } from "@/lib/sound";
import type { Profile } from "@/types/profile";

interface HomeScreenProps {
  profiles: readonly Profile[];
  meId: string | null;
  loading: boolean;
  error: string | null;
  muted: boolean;
  onToggleSound: () => void;
  onOpen: (profile: Profile) => void;
  onCreate: () => void;
  onHelp: () => void;
}

export function HomeScreen({
  profiles,
  meId,
  loading,
  error,
  muted,
  onToggleSound,
  onOpen,
  onCreate,
  onHelp,
}: HomeScreenProps) {
  return (
    <Screen
      wide
      footer={
        <div className="flex items-center gap-2">
          <Button
            variant="candy"
            size="lg"
            fullWidth
            onClick={() => {
              sound.tap();
              onCreate();
            }}
          >
            + {copy.home.addProfile}
          </Button>
        </div>
      }
    >
      <header className="mb-5 text-center">
        <div className="animate-rise-in">
          <Wordmark size="md" />
        </div>
        <p className="mt-1.5 text-sm font-semibold text-ink/65">{brand.tagline}</p>

        <div className="mt-3 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              sound.tap();
              onHelp();
            }}
            className="display rounded-full border-[3px] border-ink bg-paper px-3 py-1 text-xs text-ink transition-transform hover:-translate-y-[2px]"
          >
            ❓ Como funciona
          </button>
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={muted ? "Ligar os sons" : "Desligar os sons"}
            className="display rounded-full border-[3px] border-ink bg-paper px-3 py-1 text-xs text-ink transition-transform hover:-translate-y-[2px]"
          >
            {muted ? "🔇 Som off" : "🔊 Som on"}
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-4 pb-4">
        {profiles.length > 0 ? <BirthdayTrail profiles={profiles} onOpen={onOpen} /> : null}

        {error ? (
          <p className="rounded-2xl border-[3px] border-ink bg-morango px-3 py-2 text-sm font-semibold text-paper">
            {error}
          </p>
        ) : null}

        <section>
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="display text-lg text-ink">{copy.home.title}</h2>
            <span className="text-xs font-semibold uppercase tracking-wider text-ink/45">
              {profiles.length} {profiles.length === 1 ? "pessoa" : "pessoas"}
            </span>
          </div>

          {loading && profiles.length === 0 ? (
            <p className="rounded-2xl border-[3px] border-dashed border-ink/30 p-5 text-center text-sm text-ink/55">
              Abrindo os embrulhos...
            </p>
          ) : null}

          {!loading && profiles.length === 0 ? (
            <p className="rounded-2xl border-[3px] border-dashed border-ink/30 p-5 text-center text-sm text-ink/55">
              {copy.home.empty}
            </p>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                isMe={profile.id === meId}
                onOpen={() => {
                  sound.pick();
                  onOpen(profile);
                }}
              />
            ))}
          </div>
        </section>

      </div>
    </Screen>
  );
}
