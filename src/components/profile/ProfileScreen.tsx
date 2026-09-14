"use client";

import { useState } from "react";
import { BadgeShelf, LevelBar } from "@/components/profile/LevelBar";
import { ItemSheet } from "@/components/profile/ItemSheet";
import { ItemTile } from "@/components/profile/ItemTile";
import { PinSheet } from "@/components/profile/PinSheet";
import { ProfileSettingsSheet } from "@/components/profile/ProfileSettingsSheet";
import { StickerLayer } from "@/components/profile/StickerLayer";
import { StickerPicker } from "@/components/profile/StickerPicker";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { GuidedTour, type TourStep } from "@/components/layout/GuidedTour";
import { Screen } from "@/components/ui/Screen";
import { TagEditor } from "@/components/ui/TagEditor";
import { brand, copy } from "@/data/copy";
import { paletteFor } from "@/data/palettes";
import { birthdayLabel, countdownLabel, currentAge, daysUntilBirthday } from "@/lib/birthday";
import { progressFor } from "@/lib/progress";
import { sound } from "@/lib/sound";
import type { ProfilePatch } from "@/lib/api";
import type { ItemDraft, Profile, ProfileItem, Sticker } from "@/types/profile";

const tourSteps: readonly TourStep[] = [
  {
    target: "header",
    emoji: "🏠",
    title: "O espaço da pessoa",
    body: "Foto, carinha, aniversário e o nível do perfil. Tudo aqui pode ser trocado por quem quiser deixar do seu jeito.",
  },
  {
    target: "customize",
    emoji: "🎨",
    title: "Cor e adesivos",
    body: "Ajustar perfil troca nome, foto, cor e data. Colar adesivo solta um emoji na tela — depois é só arrastar com o dedo.",
  },
  {
    target: "wish",
    emoji: "💌",
    title: "Dica de presente",
    body: "Campo aberto para escrever o que quiser. Não tem botão de salvar: o texto guarda sozinho quando você toca fora dele.",
  },
  {
    target: "items",
    emoji: "👕",
    title: "Tamanhos e itens",
    body: "Cada desenho é um item. Toque em um para editar ou apagar. Roupa e calçado pedem o número; doce e livro pedem só o gosto.",
  },
  {
    target: "tags",
    emoji: "💝",
    title: "Ama, não curte, já tem demais",
    body: "Escreva e toque no + para guardar cada etiqueta. Elas entram na hora, uma a uma.",
  },
  {
    target: "add",
    emoji: "➕",
    title: "Guardar um item novo",
    body: "Esse botão abre a lista de desenhos. Escolhe o desenho, escreve o número e confirma.",
  },
  {
    target: "claim",
    emoji: "🙋",
    title: "Por último: esse sou eu",
    body: "Este espaço só aceita edição de quem tem o PIN dele. Se for o seu, toque aqui e digite seus 4 números; em perfil dos outros, tudo fica em modo leitura.",
  },
];

interface ProfileScreenProps {
  profile: Profile;
  canEdit: boolean;
  master: boolean;
  claiming: boolean;
  claimProblem: string | null;
  onClaimPin: (pin: string) => void;
  onRelease: () => void;
  autoTour: boolean;
  onTourDone: () => void;
  busy: boolean;
  error: string | null;
  onBack: () => void;
  onPatch: (patch: ProfilePatch) => void;
  onDelete: () => void;
  onCreateItem: (draft: ItemDraft) => void;
  onUpdateItem: (id: string, draft: ItemDraft) => void;
  onDeleteItem: (id: string) => void;
}

export function ProfileScreen({
  profile,
  canEdit,
  master,
  claiming,
  claimProblem,
  onClaimPin,
  onRelease,
  autoTour,
  onTourDone,
  busy,
  error,
  onBack,
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

  const [pickingSticker, setPickingSticker] = useState(false);
  const [openItem, setOpenItem] = useState<ProfileItem | null>(null);
  const [creatingItem, setCreatingItem] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [confirmingProfile, setConfirmingProfile] = useState(false);
  const [confirmingItem, setConfirmingItem] = useState<ProfileItem | null>(null);
  const [localStickers, setLocalStickers] = useState<Sticker[] | null>(null);
  const [touring, setTouring] = useState(autoTour);
  const [askingPin, setAskingPin] = useState(false);

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
        y: 62 + Math.random() * 24,
        scale: 1,
        rotation: Math.round(Math.random() * 30 - 15),
      },
    ];

    setPickingSticker(false);
    setLocalStickers(next);
    commitStickers(next);
  };

  return (
    <Screen
      stage={palette.stage}
      footer={
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Button variant="paper" size="lg" onClick={onBack}>
              ← Turma
            </Button>
            <span data-tour="add" className="flex-1">
              <Button
                variant="candy"
                size="lg"
                fullWidth
                disabled={busy || !canEdit}
                onClick={() => {
                  sound.tap();
                  setCreatingItem(true);
                }}
              >
                {canEdit ? "+ Guardar um item" : "🔒 Só o dono edita"}
              </Button>
            </span>
          </div>

          <div data-tour="claim">
            {canEdit ? (
              <div className="flex items-center justify-center gap-2">
                <p className="display text-xs text-ink/55">
                  {master ? "🔑 Modo dono da casa: você edita todos" : "✓ Esse espaço é seu"}
                </p>
                {master ? null : (
                  <button
                    type="button"
                    onClick={() => {
                      sound.tap();
                      onRelease();
                    }}
                    className="display rounded-xl border-[3px] border-ink bg-paper px-2 py-0.5 text-[0.65rem] text-ink/60 transition-transform hover:-translate-y-[1px]"
                  >
                    sair
                  </button>
                )}
              </div>
            ) : (
              <Button
                variant="mint"
                size="md"
                fullWidth
                onClick={() => {
                  sound.pick();
                  setAskingPin(true);
                }}
              >
                {profile.locked ? "🔒 Esse sou eu (tenho o PIN)" : "🙋 Esse sou eu"}
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4 pb-4">
        <div className="flex items-center justify-center gap-2">
          <span className="display rounded-full border-[3px] border-ink bg-paper px-3 py-1.5 text-center text-xs text-ink">
            {canEdit ? brand.ownerCall : `Espaço de ${profile.name} · só leitura`}
          </span>
          <button
            type="button"
            onClick={() => {
              sound.tap();
              setTouring(true);
            }}
            className="display shrink-0 rounded-full border-[3px] border-ink bg-baunilha px-2.5 py-1.5 text-xs text-ink transition-transform hover:-translate-y-[2px]"
          >
            ❓ Me guia
          </button>
        </div>

        <section
          data-tour="header"
          className="scoop relative overflow-hidden rounded-[1.75rem] border-[3px] border-ink bg-paper p-5"
        >
          <div className="sprinkles pointer-events-none absolute inset-0" aria-hidden />

          <div className="relative flex flex-col items-center gap-2 text-center">
            {profile.photo ? (
              <span className="h-24 w-24 overflow-hidden rounded-3xl border-[3px] border-ink">
                <img src={profile.photo} alt={profile.name} className="h-full w-full object-cover" />
              </span>
            ) : (
              <span className="animate-float-soft text-6xl" aria-hidden>
                {profile.emoji}
              </span>
            )}

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

          {canEdit ? (
          <div data-tour="customize" className="relative mt-4 flex flex-wrap justify-center gap-2">
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
          </div>
          ) : (
            <div data-tour="customize" />
          )}

          {canEdit ? (
            <p className="relative mt-2 text-center text-xs text-ink/55">
              {copy.profile.stickersHint}
            </p>
          ) : null}

          <StickerLayer
            stickers={stickers}
            draggable={canEdit}
            onChange={setLocalStickers}
            onCommit={commitStickers}
          />
        </section>

        {error ? (
          <p className="rounded-2xl border-[3px] border-ink bg-morango px-3 py-2 text-sm font-semibold text-paper">
            {error}
          </p>
        ) : null}

        <section data-tour="wish" className="scoop-sm rounded-3xl border-[3px] border-ink bg-paper p-4">
          <div className="flex items-center gap-2">
            <span aria-hidden className="text-xl">
              💌
            </span>
            <h3 className="display text-base text-ink">{copy.profile.wishTitle}</h3>
          </div>

          <p className="mt-1 text-xs text-ink/55">{copy.profile.wishHint}</p>

          <textarea
            key={`wish-${profile.id}`}
            defaultValue={profile.wish}
            maxLength={600}
            rows={4}
            readOnly={!canEdit}
            lang="pt-BR"
            placeholder="Escreva solto: marca, cor, tamanho da caneca, aquele jogo que você quer, o que já tem repetido..."
            onBlur={(event) => {
              const next = event.target.value.trim();

              if (next !== profile.wish) {
                sound.saved();
                onPatch({ wish: next });
              }
            }}
            className="mt-2 w-full resize-none rounded-2xl border-[3px] border-ink bg-cream px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink/35 focus:ring-4 focus:ring-morango/25"
          />
        </section>

        <section data-tour="items">
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
                interactive={canEdit}
                onOpen={() => {
                  sound.tap();
                  setOpenItem(item);
                }}
              />
            ))}

            {canEdit ? (
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
            ) : null}
          </div>

          {profile.items.length === 0 ? (
            <p className="mt-3 rounded-2xl border-[3px] border-dashed border-ink/30 p-4 text-center text-sm text-ink/55">
              {copy.profile.itemsEmpty}
            </p>
          ) : null}
        </section>

        <div data-tour="tags" className="flex flex-col gap-4">
        <TagEditor
          title={copy.profile.lovesTitle}
          emoji="💝"
          tags={profile.loves}
          accent={palette.soft}
          placeholder="coisas cheirosas, livro, jogo..."
          busy={busy}
          readOnly={!canEdit}
          onChange={(loves) => onPatch({ loves })}
        />

        <TagEditor
          title={copy.profile.dislikesTitle}
          emoji="🙅"
          tags={profile.dislikes}
          accent="#ffe1e9"
          placeholder="boné aba reta, cor muito forte..."
          busy={busy}
          readOnly={!canEdit}
          onChange={(dislikes) => onPatch({ dislikes })}
        />

        <TagEditor
          title={copy.profile.plentyTitle}
          emoji="📦"
          tags={profile.plenty}
          accent="#eae4ff"
          placeholder="hidratante, perfume, roupa..."
          busy={busy}
          readOnly={!canEdit}
          onChange={(plenty) => onPatch({ plenty })}
        />
        </div>

        <section className="scoop-sm rounded-3xl border-[3px] border-ink bg-paper p-4">
          <div className="flex items-center gap-2">
            <span aria-hidden className="text-xl">
              ⚠️
            </span>
            <h3 className="display text-base text-ink">{copy.profile.careTitle}</h3>
          </div>

          <textarea
            key={`care-${profile.id}`}
            defaultValue={profile.care}
            maxLength={280}
            rows={2}
            readOnly={!canEdit}
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
          <h3 className="display mb-1 text-base text-ink">Medalhas do perfil</h3>
          <BadgeShelf progress={progress} palette={palette} />
        </section>
      </div>

      {askingPin ? (
        <PinSheet
          name={profile.name}
          emoji={profile.emoji}
          locked={profile.locked}
          palette={palette}
          busy={claiming}
          problem={claimProblem}
          onSubmit={(pin) => {
            onClaimPin(pin);
            setAskingPin(false);
          }}
          onClose={() => setAskingPin(false)}
        />
      ) : null}

      {touring ? (
        <GuidedTour
          steps={tourSteps}
          onClose={() => {
            setTouring(false);
            onTourDone();
          }}
        />
      ) : null}

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
