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
import type { PaletteKey, ProfileDraft } from "@/types/profile";

interface NewProfileSheetProps {
  busy: boolean;
  onCreate: (draft: ProfileDraft & { pin: string }) => void;
  onClose: () => void;
}

export function NewProfileSheet({ busy, onCreate, onClose }: NewProfileSheetProps) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🎁");
  const [photo, setPhoto] = useState<string | null>(null);
  const [birthday, setBirthday] = useState("");
  const [palette, setPalette] = useState<PaletteKey>("morango");
  const [pin, setPin] = useState("");
  const [problem, setProblem] = useState<string | null>(null);

  const submit = () => {
    const clean = name.trim();

    if (clean.length === 0) {
      setProblem(copy.errors.nameRequired);

      return;
    }

    if (birthday.length > 0 && !parseBirthday(birthday)) {
      setProblem(copy.errors.birthdayInvalid);

      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      setProblem("Crie um PIN de 4 números para o seu espaço.");

      return;
    }

    sound.party();
    onCreate({
      pin,
      name: clean,
      emoji,
      photo,
      birthday: birthday.length > 0 ? birthday : null,
      palette,
    });
  };

  return (
    <Sheet
      title="Novo perfil na turma"
      subtitle="Depois é só entrar nele e decorar do seu jeito."
      accent={paletteFor(palette).soft}
      onClose={onClose}
      footer={
        <Button variant="candy" size="lg" fullWidth disabled={busy} onClick={submit}>
          {busy ? "Criando..." : "Criar perfil"}
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <TextField
          label="Nome"
          value={name}
          maxLength={32}
          autoCapitalize="words"
          placeholder="como a turma chama a pessoa"
          onChange={(event) => {
            setName(event.target.value);
            setProblem(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              submit();
            }
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
          label="Seu PIN de 4 números"
          value={pin}
          inputMode="numeric"
          autoComplete="off"
          maxLength={4}
          placeholder="••••"
          hint="Só quem souber esse PIN edita o seu espaço. Anote num canto."
          onChange={(event) => {
            setPin(event.target.value.replace(/\D/g, "").slice(0, 4));
            setProblem(null);
          }}
        />

        <TextField
          label="Aniversário (opcional)"
          type="date"
          value={birthday}
          min="1900-01-01"
          max="2100-12-31"
          hint="Com a data, o aviso chega 15 dias antes."
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
