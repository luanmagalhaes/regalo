import type { CSSProperties, ReactNode } from "react";

interface ScreenProps {
  children: ReactNode;
  footer?: ReactNode;
  stage?: string;
  wide?: boolean;
}

export function Screen({ children, footer, stage, wide = false }: ScreenProps) {
  const style: CSSProperties | undefined = stage ? { backgroundImage: stage } : undefined;

  return (
    <main
      className={`flex min-h-dvh flex-col ${stage ? "" : "stage-party"}`}
      style={style}
    >
      <div className="flex flex-1 flex-col overflow-y-auto px-4 pb-6 pt-[calc(var(--safe-top)+1.25rem)] sm:px-8">
        <div className={`mx-auto flex w-full flex-1 flex-col ${wide ? "max-w-4xl" : "max-w-2xl"}`}>
          {children}
        </div>
      </div>

      {footer ? (
        <div className="shrink-0 border-t-[3px] border-ink/15 bg-paper/90 px-4 pb-[calc(var(--safe-bottom)+0.9rem)] pt-3.5 backdrop-blur-sm sm:px-8">
          <div className={`mx-auto w-full ${wide ? "max-w-4xl" : "max-w-2xl"}`}>{footer}</div>
        </div>
      ) : null}
    </main>
  );
}
