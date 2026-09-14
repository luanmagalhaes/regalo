type WordmarkSize = "sm" | "md" | "lg";

interface WordmarkProps {
  size?: WordmarkSize;
  className?: string;
}

const sizes: Record<WordmarkSize, string> = {
  sm: "text-xl sm:text-2xl",
  md: "text-4xl sm:text-5xl",
  lg: "text-5xl sm:text-7xl",
};

export function Wordmark({ size = "md", className = "" }: WordmarkProps) {
  return (
    <span
      className={`display candy-text animate-candy-slide inline-block max-w-full leading-none ${sizes[size]} ${className}`}
      style={{ paddingBottom: "0.1em" }}
    >
      Regalo
    </span>
  );
}
