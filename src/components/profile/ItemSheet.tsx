"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CartoonIcon } from "@/components/ui/CartoonIcon";
import { Sheet } from "@/components/ui/Sheet";
import { TextField } from "@/components/ui/TextField";
import { copy } from "@/data/copy";
import type { Palette } from "@/data/palettes";
import { itemPresets } from "@/data/presets";
import { sound } from "@/lib/sound";
import type { ItemDraft, ProfileItem } from "@/types/profile";

interface ItemSheetProps {
  item: ProfileItem | null;
  palette: Palette;
  busy: boolean;
  onSave: (draft: ItemDraft) => void;
  onRemove: (() => void) | null;
  onClose: () => void;
}

export function ItemSheet({ item, palette, busy, onSave, onRemove, onClose }: ItemSheetProps) {
  const [icon, setIcon] = useState(item?.icon ?? "");
  const [label, setLabel] = useState(item?.label ?? "");
  const [value, setValue] = useState(item?.value ?? "");
  const [hint, setHint] = useState(item?.hint ?? "");
  const [pending, setPending] = useState(item?.pending ?? false);
  const [problem, setProblem] = useState<string | null>(null);
  const [picking, setPicking] = useState(item === null);

  const choose = (preset: { icon: string; label: string }) => {
    sound.pick();
    setIcon(preset.icon);
    setLabel((current) => (current.length > 0 ? current : preset.label));
    setPicking(false);
  };

  const submit = () => {
    const cleanLabel = label.trim();

    if (cleanLabel.length === 0) {
      setProblem(copy.errors.labelRequired);

      return;
    }

    if (value.trim().length === 0) {
      setProblem(copy.errors.valueRequired);

      return;
    }

    sound.saved();
    onSave({
      icon: icon.length > 0 ? icon : "gift",
      label: cleanLabel,
      value: value.trim(),
      hint: hint.trim(),
      pending,
    });
  };

  if (picking) {
    return (
      <Sheet
        title={copy.item.pick}
        subtitle="Escolha o desenho. O nome e o número você escreve depois."
        accent={palette.soft}
        onClose={onClose}
      >
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
          {itemPresets.map((preset) => (
            <button
              key={`${preset.icon}-${preset.label}`}
              type="button"
              onClick={() => choose(preset)}
              className="flex flex-col items-center gap-1 rounded-2xl border-[3px] border-ink bg-paper p-2 transition-transform hover:-translate-y-[2px] active:translate-y-[1px]"
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: palette.soft, color: palette.scoop }}
              >
                <CartoonIcon name={preset.icon} className="h-10 w-10" />
              </span>
              <span className="display w-full truncate text-[0.68rem] text-ink/70">
                {preset.label}
              </span>
            </button>
          ))}
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet
      title={item ? `Editar ${item.label}` : "Guardar no perfil"}
      subtitle={copy.item.valueHint}
      accent={palette.soft}
      onClose={onClose}
      footer={
        <div className="flex flex-col gap-2">
          <Button variant="candy" size="lg" fullWidth disabled={busy} onClick={submit}>
            {busy ? "Guardando..." : copy.item.save}
          </Button>
          {onRemove ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                sound.tap();
                onRemove();
              }}
              className="display rounded-xl px-3 py-2 text-sm text-ink/50 transition-colors hover:text-morango"
            >
              {copy.item.remove}
            </button>
          ) : null}
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 rounded-3xl border-[3px] border-ink bg-cream p-3">
          <span
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-[3px] border-ink"
            style={{ backgroundColor: palette.soft, color: palette.scoop }}
          >
            <CartoonIcon name={icon.length > 0 ? icon : "gift"} className="h-12 w-12" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-ink/60">Desenho escolhido</p>
            <button
              type="button"
              onClick={() => {
                sound.tap();
                setPicking(true);
              }}
              className="display mt-1 rounded-xl border-[3px] border-ink bg-paper px-3 py-1.5 text-sm text-ink transition-transform hover:-translate-y-[2px]"
            >
              Trocar desenho
            </button>
          </div>
        </div>

        <TextField
          label={copy.item.labelHint}
          value={label}
          maxLength={32}
          placeholder="Blusa, tênis, anel..."
          autoCapitalize="sentences"
          onChange={(event) => {
            setLabel(event.target.value);
            setProblem(null);
          }}
        />

        <TextField
          label={copy.item.value}
          value={value}
          maxLength={48}
          placeholder="M, 44, 38/M, 17..."
          autoCapitalize="characters"
          autoComplete="off"
          onChange={(event) => {
            setValue(event.target.value);
            setProblem(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              submit();
            }
          }}
        />

        <TextField
          label="Observação (opcional)"
          value={hint}
          maxLength={120}
          placeholder="P se a forma for grande, colada, oversized..."
          autoCapitalize="sentences"
          onChange={(event) => setHint(event.target.value)}
        />

        <label className="flex items-center gap-3 rounded-2xl border-[3px] border-ink bg-cream px-4 py-3">
          <input
            type="checkbox"
            checked={pending}
            onChange={(event) => setPending(event.target.checked)}
            className="h-5 w-5 accent-[var(--color-morango)]"
          />
          <span className="text-sm font-semibold text-ink/75">{copy.item.pendingLabel}</span>
        </label>

        {problem ? (
          <p className="rounded-2xl border-[3px] border-ink bg-morango px-3 py-2 text-xs font-semibold text-paper">
            {problem}
          </p>
        ) : null}
      </div>
    </Sheet>
  );
}
