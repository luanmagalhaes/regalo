"use client";

import { useState } from "react";
import { copy } from "@/data/copy";
import { sound } from "@/lib/sound";

interface TagEditorProps {
  title: string;
  emoji: string;
  tags: readonly string[];
  accent: string;
  placeholder: string;
  busy?: boolean;
  readOnly?: boolean;
  onChange: (tags: string[]) => void;
}

export function TagEditor({
  title,
  emoji,
  tags,
  accent,
  placeholder,
  busy = false,
  readOnly = false,
  onChange,
}: TagEditorProps) {
  const [draft, setDraft] = useState("");
  const [problem, setProblem] = useState<string | null>(null);

  const add = () => {
    const clean = draft.trim().replace(/\s+/g, " ");

    if (clean.length === 0) {
      setProblem(copy.errors.tagEmpty);

      return;
    }

    if (tags.some((tag) => tag.toLowerCase() === clean.toLowerCase())) {
      setDraft("");
      setProblem(null);

      return;
    }

    sound.pop();
    onChange([...tags, clean]);
    setDraft("");
    setProblem(null);
  };

  return (
    <section className="rounded-3xl border-[3px] border-ink bg-paper p-4 scoop-sm">
      <div className="flex items-center gap-2">
        <span aria-hidden className="text-xl">
          {emoji}
        </span>
        <h3 className="display text-base text-ink">{title}</h3>
      </div>

      <ul className="mt-3 flex flex-wrap gap-2">
        {tags.length === 0 ? (
          <li className="text-xs text-ink/50">Nada aqui ainda.</li>
        ) : (
          tags.map((tag) => (
            <li
              key={tag}
              className="animate-pop-in flex items-center gap-1.5 rounded-full border-[3px] border-ink px-3 py-1.5 text-sm font-semibold text-ink"
              style={{ backgroundColor: accent }}
            >
              <span className="max-w-[12rem] truncate">{tag}</span>
              {readOnly ? null : (
              <button
                type="button"
                disabled={busy}
                aria-label={`Tirar ${tag}`}
                onClick={() => {
                  sound.tap();
                  onChange(tags.filter((entry) => entry !== tag));
                }}
                className="display text-ink/50 transition-colors hover:text-ink"
              >
                ✕
              </button>
              )}
            </li>
          ))
        )}
      </ul>

      {readOnly ? null : (
      <div className="mt-3 flex items-center gap-2">
        <input
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            setProblem(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          maxLength={60}
          lang="pt-BR"
          disabled={busy}
          className="min-w-0 flex-1 rounded-2xl border-[3px] border-ink bg-cream px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink/35 focus:ring-4 focus:ring-morango/25"
        />
        <button
          type="button"
          onClick={add}
          disabled={busy}
          aria-label={`Adicionar em ${title}`}
          className="display shrink-0 rounded-2xl border-[3px] border-ink bg-baunilha px-3.5 py-2.5 text-lg leading-none text-ink shadow-[0_4px_0_var(--color-ink)] transition-transform hover:-translate-y-[2px] active:translate-y-[2px] disabled:opacity-40"
        >
          +
        </button>
      </div>
      )}

      {problem ? (
        <p className="mt-2 rounded-2xl border-[3px] border-ink bg-morango px-3 py-2 text-xs font-semibold text-paper">
          {problem}
        </p>
      ) : null}
    </section>
  );
}
