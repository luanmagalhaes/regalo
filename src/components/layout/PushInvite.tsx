"use client";

import { useState } from "react";
import { GiftWalker } from "@/components/ui/GiftWalker";
import { Button } from "@/components/ui/Button";
import { nearWindow } from "@/lib/birthday";
import { enablePush } from "@/lib/push/client";
import { sound } from "@/lib/sound";

interface PushInviteProps {
  onDone: () => void;
}

export function PushInvite({ onDone }: PushInviteProps) {
  const [busy, setBusy] = useState(false);
  const [denied, setDenied] = useState(false);

  const ask = () => {
    setBusy(true);

    void enablePush()
      .then((answer) => {
        if (answer === "granted") {
          sound.party();
          onDone();

          return;
        }

        sound.oops();
        setDenied(true);
      })
      .finally(() => setBusy(false));
  };

  return (
    <div className="fixed inset-0 z-[85] flex items-end justify-center bg-ink/70 p-3 sm:items-center sm:p-4">
      <div className="animate-pop-in flex w-full max-w-sm flex-col overflow-hidden rounded-[1.75rem] border-[3px] border-ink bg-paper shadow-[0_10px_0_var(--color-ink)]">
        <div className="sprinkles relative bg-baunilha px-5 py-5 text-center">
          <GiftWalker className="relative mx-auto w-20" idPrefix="invite" />
          <h2 className="display relative mt-1 text-xl leading-tight text-ink">
            Posso te cutucar antes dos aniversários?
          </h2>
        </div>

        <div className="px-5 py-4 text-sm text-ink/75">
          {denied ? (
            <>
              <p>
                O celular bloqueou os avisos. Sem isso ninguém consegue te mandar notificação — nem
                eu.
              </p>
              <p className="mt-2 rounded-xl bg-cream px-3 py-2 text-xs">
                Para liberar depois: ajustes do navegador → notificações → permitir para este site.
                No iPhone, primeiro adicione o Regalo à tela de início.
              </p>
            </>
          ) : (
            <>
              <p>
                O Regalo avisa <strong>{nearWindow} dias antes</strong> do aniversário de cada um da
                turma. Chega no celular, mesmo com o app fechado.
              </p>
              <p className="mt-2 rounded-xl bg-cream px-3 py-2 text-xs">
                O celular vai perguntar se pode. É só dizer que sim — sem isso, não dá para avisar
                ninguém.
              </p>
            </>
          )}
        </div>

        <div className="px-5 pb-5">
          <div className="flex flex-col gap-2">
            <Button variant="candy" size="lg" fullWidth disabled={busy} onClick={denied ? onDone : ask}>
              {denied ? "Entendi" : busy ? "Esperando o celular..." : "Pode avisar!"}
            </Button>
            {denied ? null : (
              <button
                type="button"
                onClick={onDone}
                className="display rounded-xl px-3 py-2 text-sm text-ink/50 transition-colors hover:text-ink"
              >
                Agora não
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
