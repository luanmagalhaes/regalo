"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

interface SheetProps {
  title: string;
  subtitle?: string;
  accent?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
}

export function Sheet({ title, subtitle, accent, children, footer, onClose }: SheetProps) {
  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", escape);

    return () => window.removeEventListener("keydown", escape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/60 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-label="Fechar"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <div className="animate-sheet-up relative flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-[2rem] border-[3px] border-ink bg-paper shadow-[0_-8px_0_var(--color-ink)] sm:rounded-[2rem] sm:shadow-[0_10px_0_var(--color-ink)]">
        <div
          className="shrink-0 px-5 py-4"
          style={{ backgroundColor: accent ?? "var(--color-morango)" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="display block text-xl leading-tight text-ink">{title}</span>
              {subtitle ? <p className="mt-0.5 text-xs text-ink/70">{subtitle}</p> : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="display shrink-0 rounded-xl border-[3px] border-ink bg-paper px-2.5 py-1 text-sm text-ink transition-transform hover:-translate-y-[2px]"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer ? (
          <div className="shrink-0 border-t-[3px] border-ink/10 px-5 pb-[calc(var(--safe-bottom)+1rem)] pt-3">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
