"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PhotoPicker } from "@/components/ui/PhotoPicker";
import { Sheet } from "@/components/ui/Sheet";
import { TextField } from "@/components/ui/TextField";
import { copy } from "@/data/copy";
import { paletteFor, paletteList } from "@/data/palettes";
import { profileEmojis } from "@/data/presets";
import { parseBirthday } from "@/lib/birthday";
import { sound } from "@/lib/sound";
import type { Profile } from "@/types/profile";

interface ProfileSettingsSheetProps {
  profile: Profile;
  busy: boolean;
  onSave: (patch: {
    name: string;
    emoji: string;
    photo: string | null;
    birthday: string | null;
    palette: string;
  }) => void;
  onDelete: () => void;
  onClose: () => void;
}

export function ProfileSettingsSheet({
  profile,
  busy,
  onSave,
  onDelete,
  onClose,
}: ProfileSettingsSheetProps) {
  const [name, setName] = useState(profile.name);
  const [emoji, setEmoji] = useState(profile.emoji);
  const [photo, setPhoto] = useState<string | null>(profile.photo);
  const [birthday, setBirthday] = useState(profile.birthday ?? "");
  const [palette, setPalette] = useState<string>(profile.palette);
  const [problem, setProblem] = useState<string | null>(null);

  const submit = () => {
    const cleanName = name.trim();

    if (cleanName.length === 0) {
      setProblem(copy.errors.nameRequired);

      return;
    }

    if (birthday.length > 0 && !parseBirthday(birthday)) {
      setProblem(copy.errors.birthdayInvalid);

      return;
    }

    sound.saved();
    onSave({
      name: cleanName,
      emoji,
      photo,
      birthday: birthday.length > 0 ? birthday : null,
      palette,
    });
  };

  return (
    <Sheet
      title="Ajustar o perfil"
      subtitle="Nome, carinha, cor e data de aniversário."
      accent={paletteFor(palette).soft}
      onClose={onClose}
      footer={
        <div className="flex flex-col gap-2">
          <Button variant="candy" size="lg" fullWidth disabled={busy} onClick={submit}>
            {busy ? "Guardando..." : "Guardar"}
          </Button>
          <button
            type="button"
            disabled={busy}
            onClick={onDelete}
            className="display rounded-xl px-3 py-2 text-sm text-ink/45 transition-colors hover:text-morango"
          >
            Apagar este perfil
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <TextField
          label="Nome"
          value={name}
          maxLength={32}
          autoCapitalize="words"
          onChange={(event) => {
            setName(event.target.value);
            setProblem(null);
          }}
        />

        <PhotoPicker
          photo={photo}
          emoji={emoji}
          accent={paletteFor(palette).soft}
          onPick={setPhoto}
        />

        <div>
          <span className="display block text-xs uppercase tracking-[0.16em] text-ink/55">
            Carinha {photo ? "(aparece se não tiver foto)" : ""}
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {profileEmojis.map((option) => (
              <button
                key={option}
                type="button"
                aria-label={`Usar ${option}`}
                onClick={() => {
                  sound.pick();
                  setEmoji(option);
                }}
                className={`flex h-11 w-11 items-center justify-center rounded-2xl border-[3px] text-xl transition-transform hover:-translate-y-[2px] ${
                  emoji === option ? "border-ink bg-baunilha" : "border-ink/25 bg-cream"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="display block text-xs uppercase tracking-[0.16em] text-ink/55">
            Sabor do perfil
          </span>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {paletteList.map((option) => (
              <button
                key={option.key}
                type="button"
                aria-label={`Cor ${option.name}`}
                onClick={() => {
                  sound.pick();
                  setPalette(option.key);
                }}
                className={`flex flex-col items-center gap-1 rounded-2xl border-[3px] p-2 transition-transform hover:-translate-y-[2px] ${
                  palette === option.key ? "border-ink bg-cream" : "border-ink/20 bg-paper"
                }`}
              >
                <span
                  className="h-7 w-7 rounded-full border-[3px] border-ink"
                  style={{ backgroundColor: option.scoop }}
                />
                <span className="display text-[0.62rem] text-ink/70">{option.name}</span>
              </button>
            ))}
          </div>
        </div>

        <TextField
          label="Data de nascimento"
          type="date"
          value={birthday}
          min="1900-01-01"
          max={new Date().toISOString().slice(0, 10)}
          hint="Dia, mês e ano em que você nasceu. É daqui que sai o aviso 15 dias antes."
          onChange={(event) => {
            setBirthday(event.target.value);
            setProblem(null);
          }}
        />

        {problem ? (
          <p className="rounded-2xl border-[3px] border-ink bg-morango px-3 py-2 text-xs font-semibold text-paper">
            {problem}
          </p>
        ) : null}
      </div>
    </Sheet>
  );
}
