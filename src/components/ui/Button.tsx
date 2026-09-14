import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "candy" | "mint" | "grape" | "paper" | "ink";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  candy: "bg-morango text-paper hover:bg-[#ff86b6]",
  mint: "bg-pistache text-ink hover:bg-[#9ae5bd]",
  grape: "bg-uva text-paper hover:bg-[#c193ff]",
  paper: "bg-paper text-ink hover:bg-cream",
  ink: "bg-ink text-paper hover:bg-[#523369]",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3.5 text-base",
};

export function Button({
  children,
  variant = "candy",
  size = "md",
  fullWidth = false,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`display rounded-2xl border-[3px] border-ink shadow-[0_4px_0_var(--color-ink)] transition-all duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_var(--color-ink)] active:translate-y-[2px] active:shadow-[0_2px_0_var(--color-ink)] disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-[0_4px_0_var(--color-ink)] ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
