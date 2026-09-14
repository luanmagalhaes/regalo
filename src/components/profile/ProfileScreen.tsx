"use client";

import { useState } from "react";
import { BadgeShelf, LevelBar } from "@/components/profile/LevelBar";
import { ItemSheet } from "@/components/profile/ItemSheet";
import { ItemTile } from "@/components/profile/ItemTile";
import { ProfileSettingsSheet } from "@/components/profile/ProfileSettingsSheet";
import { StickerLayer } from "@/components/profile/StickerLayer";
import { StickerPicker } from "@/components/profile/StickerPicker";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Screen } from "@/components/ui/Screen";
import { TagEditor } from "@/components/ui/TagEditor";
import { brand, copy } from "@/data/copy";
import { paletteFor } from "@/data/palettes";
import { birthdayLabel, countdownLabel, currentAge, daysUntilBirthday } from "@/lib/birthday";
import { progressFor } from "@/lib/progress";
import { sound } from "@/lib/sound";
import type { ProfilePatch } from "@/lib/api";
import type { ItemDraft, Profile, ProfileItem, Sticker } from "@/types/profile";

interface ProfileScreenProps {
  profile: Profile;
  isMe: boolean;
  busy: boolean;
  error: string | null;
  onBack: () => void;
  onClaim: () => void;
  onPatch: (patch: ProfilePatch) => void;
  onDelete: () => void;
  onCreateItem: (draft: ItemDraft) => void;
  onUpdateItem: (id: string, draft: ItemDraft) => void;
  onDeleteItem: (id: string) => void;
}

export function ProfileScreen({
  profile,
  isMe,
  busy,
  error,
  onBack,
  onClaim,
  onPatch,
  onDelete,
  onCreateItem,
  onUpdateItem,
  onDeleteItem,
}: ProfileScreenProps) {
  const palette = paletteFor(profile.palette);
  const progress = progressFor(profile);
  const distance = daysUntilBirthday(profile.birthday);
  const age = currentAge(profile.birthday);
  const date = birthdayLabel(profile.birthday);

  const [decorating, setDecorating] = useState(false);
  const [pickingSticker, setPickingSticker] = useState(false);
  const [openItem, setOpenItem] = useState<ProfileItem | null>(null);
  const [creatingItem, setCreatingItem] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [confirmingProfile, setConfirmingProfile] = useState(false);
  const [confirmingItem, setConfirmingItem] = useState<ProfileItem | null>(null);
  const [localStickers, setLocalStickers] = useState<Sticker[] | null>(null);

  const stickers = localStickers ?? profile.stickers;

  const commitStickers = (next: Sticker[]) => {
    setLocalStickers(next);
    onPatch({ stickers: next });
  };

  const addSticker = (emoji: string) => {
    const next: Sticker[] = [
      ...stickers,
      {
        id: crypto.randomUUID(),
        emoji,
        x: 20 + Math.random() * 60,
        y: 22 + Math.random() * 50,
        scale: 1,
        rotation: Math.round(Math.random() * 30 - 15),
      },
    ];

    setPickingSticker(false);
    setDecorating(true);
    commitStickers(next);
  };

  return (
    <Screen
      stage={palette.stage}
      footer={
        <div className="flex items-center gap-2">
          <Button variant="paper" size="lg" onClick={onBack}>
            ← Turma
          </Button>
          <Button
            variant="candy"
            size="lg"
            fullWidth
            disabled={busy}
            onClick={() => {
              sound.tap();
              setCreatingItem(true);
            }}
          >
            + Guardar um tamanho
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 pb-4">
        <div className="flex items-center justify-between gap-2">
          <span className="display rounded-full border-[3px] border-ink bg-paper px-3 py-1.5 text-xs text-ink">
            {isMe ? brand.ownerCall : `Espaço de ${profile.name}`}
          </span>

          {isMe ? null : (
            <button
              type="button"
              onClick={() => {
                sound.pick();
                onClaim();
              }}
              className="display rounded-full border-[3px] border-ink bg-baunilha px-3 py-1.5 text-xs text-ink transition-transform hover:-translate-y-[2px]"
            >
              Esse sou eu
            </button>
          )}
        </div>

        <section className="scoop relative overflow-hidden rounded-[1.75rem] border-[3px] border-ink bg-paper p-5">
          <div className="sprinkles pointer-events-none absolute inset-0" aria-hidden />

          <StickerLayer
            stickers={stickers}
            editing={decorating}
            onChange={setLocalStickers}
            onCommit={commitStickers}
          />

          <div className="relative flex flex-col items-center gap-2 text-center">
            <span className="animate-float-soft text-6xl" aria-hidden>
              {profile.emoji}
            </span>
            <h1 className="display text-3xl leading-tight text-ink">{profile.name}</h1>

            {date ? (
              <p className="text-sm font-semibold text-ink/70">
                🎂 {date}
                {age === null ? "" : ` · ${age} anos`} · {countdownLabel(distance)}
              </p>
            ) : (
              <p className="text-sm font-semibold text-ink/55">
                Ainda sem data de aniversário. Toque em ajustar para colocar.
              </p>
            )}

            <div className="mt-2 w-full max-w-sm">
              <LevelBar progress={progress} palette={palette} />
            </div>
          </div>

          <div className="relative mt-4 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                sound.tap();
                setShowSettings(true);
              }}
              className="display rounded-2xl border-[3px] border-ink bg-cream px-3 py-1.5 text-xs text-ink transition-transform hover:-translate-y-[2px]"
            >
              🎨 Ajustar perfil
            </button>
            <button
              type="button"
              onClick={() => {
                sound.tap();
                setPickingSticker(true);
              }}
              className="display rounded-2xl border-[3px] border-ink bg-cream px-3 py-1.5 text-xs text-ink transition-transform hover:-translate-y-[2px]"
            >
              ✨ Colar adesivo
            </button>
            <button
              type="button"
              onClick={() => {
                sound.tap();
                setDecorating((current) => !current);
              }}
              className={`display rounded-2xl border-[3px] border-ink px-3 py-1.5 text-xs text-ink transition-transform hover:-translate-y-[2px] ${
                decorating ? "bg-baunilha" : "bg-cream"
              }`}
            >
              {decorating ? "✓ Terminei de arrastar" : "🖐️ Arrastar adesivos"}
            </button>
          </div>

          {decorating ? (
            <p className="relative mt-2 text-center text-xs text-ink/60">
              {copy.profile.stickersHint} Toque em um adesivo para girar, aumentar ou tirar.
            </p>
          ) : null}
        </section>

        {error ? (
          <p className="rounded-2xl border-[3px] border-ink bg-morango px-3 py-2 text-sm font-semibold text-paper">
            {error}
          </p>
        ) : null}

        <section>
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="display text-lg text-ink">{copy.profile.itemsTitle}</h2>
            <span className="text-xs font-semibold uppercase tracking-wider text-ink/45">
              {profile.items.length} {profile.items.length === 1 ? "item" : "itens"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5">
            {profile.items.map((item) => (
              <ItemTile
                key={item.id}
                item={item}
                palette={palette}
                onOpen={() => {
                  sound.tap();
                  setOpenItem(item);
                }}
              />
            ))}

            <button
              type="button"
              onClick={() => {
                sound.tap();
                setCreatingItem(true);
              }}
              aria-label="Adicionar item"
              className="flex min-h-[7.5rem] flex-col items-center justify-center gap-1 rounded-[1.5rem] border-[3px] border-dashed border-ink/45 bg-paper/70 text-ink/55 transition-transform hover:-translate-y-[3px]"
            >
              <span className="display text-3xl leading-none">+</span>
              <span className="display text-[0.68rem]">Novo item</span>
            </button>
          </div>

          {profile.items.length === 0 ? (
            <p className="mt-3 rounded-2xl border-[3px] border-dashed border-ink/30 p-4 text-center text-sm text-ink/55">
              {copy.profile.itemsEmpty}
            </p>
          ) : null}
        </section>

        <TagEditor
          title={copy.profile.lovesTitle}
          emoji="💝"
          tags={profile.loves}
          accent={palette.soft}
          placeholder="coisas cheirosas, livro, jogo..."
          busy={busy}
          onChange={(loves) => onPatch({ loves })}
        />

        <TagEditor
          title={copy.profile.dislikesTitle}
          emoji="🙅"
          tags={profile.dislikes}
          accent="#ffe1e9"
          placeholder="boné aba reta, cor muito forte..."
          busy={busy}
          onChange={(dislikes) => onPatch({ dislikes })}
        />

        <TagEditor
          title={copy.profile.plentyTitle}
          emoji="📦"
          tags={profile.plenty}
          accent="#eae4ff"
          placeholder="hidratante, perfume, roupa..."
          busy={busy}
          onChange={(plenty) => onPatch({ plenty })}
        />

        <section className="scoop-sm rounded-3xl border-[3px] border-ink bg-paper p-4">
          <div className="flex items-center gap-2">
            <span aria-hidden className="text-xl">
              ⚠️
            </span>
            <h3 className="display text-base text-ink">{copy.profile.careTitle}</h3>
          </div>

          <textarea
            key={profile.id}
            defaultValue={profile.care}
            maxLength={280}
            rows={2}
            lang="pt-BR"
            placeholder="Alergia, restrição alimentar, algo que a turma precisa saber."
            onBlur={(event) => {
              const next = event.target.value.trim();

              if (next !== profile.care) {
                onPatch({ care: next });
              }
            }}
            className="mt-2 w-full resize-none rounded-2xl border-[3px] border-ink bg-cream px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink/35 focus:ring-4 focus:ring-morango/25"
          />
        </section>

        <section className="scoop-sm rounded-3xl border-[3px] border-ink bg-paper p-4">
          <h3 className="display mb-2 text-base text-ink">Conquistas</h3>
          <BadgeShelf progress={progress} />
        </section>
      </div>

      {pickingSticker ? (
        <StickerPicker
          palette={palette}
          onPick={addSticker}
          onClose={() => setPickingSticker(false)}
        />
      ) : null}

      {showSettings ? (
        <ProfileSettingsSheet
          profile={profile}
          busy={busy}
          onSave={(patch) => {
            onPatch(patch);
            setShowSettings(false);
          }}
          onDelete={() => {
            setShowSettings(false);
            setConfirmingProfile(true);
          }}
          onClose={() => setShowSettings(false)}
        />
      ) : null}

      {creatingItem ? (
        <ItemSheet
          item={null}
          palette={palette}
          busy={busy}
          onSave={(draft) => {
            onCreateItem(draft);
            setCreatingItem(false);
          }}
          onRemove={null}
          onClose={() => setCreatingItem(false)}
        />
      ) : null}

      {openItem ? (
        <ItemSheet
          key={openItem.id}
          item={openItem}
          palette={palette}
          busy={busy}
          onSave={(draft) => {
            onUpdateItem(openItem.id, draft);
            setOpenItem(null);
          }}
          onRemove={() => {
            setConfirmingItem(openItem);
            setOpenItem(null);
          }}
          onClose={() => setOpenItem(null)}
        />
      ) : null}

      {confirmingItem ? (
        <ConfirmModal
          title={`Apagar ${confirmingItem.label}?`}
          tone="danger"
          confirmLabel="Apagar"
          cancelLabel="Deixar como está"
          busy={busy}
          body={<p>Esse item some do perfil para todo mundo da turma.</p>}
          onCancel={() => setConfirmingItem(null)}
          onConfirm={() => {
            onDeleteItem(confirmingItem.id);
            setConfirmingItem(null);
          }}
        />
      ) : null}

      {confirmingProfile ? (
        <ConfirmModal
          title={copy.profile.confirmDelete}
          tone="danger"
          confirmLabel="Apagar tudo"
          cancelLabel="Deixar como está"
          busy={busy}
          body={
            <>
              <p>
                O perfil de {profile.name} sai da lista com todos os tamanhos, adesivos e
                preferências.
              </p>
              <p className="mt-2 rounded-xl bg-cream px-3 py-2 text-xs">Isso não tem volta.</p>
            </>
          }
          onCancel={() => setConfirmingProfile(false)}
          onConfirm={() => {
            setConfirmingProfile(false);
            onDelete();
          }}
        />
      ) : null}
    </Screen>
  );
}
