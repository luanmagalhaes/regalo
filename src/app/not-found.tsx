import Link from "next/link";
import { Screen } from "@/components/ui/Screen";
import { Wordmark } from "@/components/ui/Wordmark";

export default function NotFound() {
  return (
    <Screen>
      <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
        <span className="text-6xl" aria-hidden>
          🔍
        </span>
        <Wordmark size="md" />
        <p className="max-w-sm text-sm font-semibold text-ink/70">
          Essa página não existe. Deve ter sido embrulhada junto com algum presente.
        </p>
        <Link
          href="/"
          className="display rounded-2xl border-[3px] border-ink bg-morango px-5 py-3 text-base text-paper shadow-[0_4px_0_var(--color-ink)] transition-transform hover:-translate-y-[2px]"
        >
          Voltar para o Bibuaidi
        </Link>
      </div>
    </Screen>
  );
}
