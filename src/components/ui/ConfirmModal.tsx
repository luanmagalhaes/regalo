"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

interface ConfirmModalProps {
  title: string;
  body: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "danger" | "calm";
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  title,
  body,
  confirmLabel,
  cancelLabel = "Voltar",
  tone = "calm",
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/70 p-3 sm:items-center sm:p-4">
      <div className="animate-pop-in flex w-full max-w-sm flex-col overflow-hidden rounded-[1.75rem] border-[3px] border-ink bg-paper shadow-[0_10px_0_var(--color-ink)]">
        <div className={`px-5 py-4 ${tone === "danger" ? "bg-morango" : "bg-pistache"}`}>
          <span className="display block text-xl leading-tight text-ink">{title}</span>
        </div>

        <div className="px-5 py-4 text-sm text-ink/75">{body}</div>

        <div className="px-5 pb-5">
          <div className="flex flex-col gap-2">
            <Button
              variant={tone === "danger" ? "candy" : "mint"}
              size="lg"
              fullWidth
              disabled={busy}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
            <button
              type="button"
              onClick={onCancel}
              className="display rounded-xl px-3 py-2 text-sm text-ink/55 transition-colors hover:text-ink"
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
