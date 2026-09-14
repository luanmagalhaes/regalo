import type { InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export function TextField({ label, hint, className = "", id, ...rest }: TextFieldProps) {
  const fieldId = id ?? `field-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <label htmlFor={fieldId} className="block">
      <span className="display block text-xs uppercase tracking-[0.16em] text-ink/55">{label}</span>
      <input
        id={fieldId}
        lang="pt-BR"
        className={`mt-1.5 w-full rounded-2xl border-[3px] border-ink bg-cream px-4 py-3 text-base text-ink outline-none placeholder:text-ink/35 focus:ring-4 focus:ring-morango/30 ${className}`}
        {...rest}
      />
      {hint ? <span className="mt-1.5 block text-xs text-ink/55">{hint}</span> : null}
    </label>
  );
}
