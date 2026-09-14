"use client";

import { Sheet } from "@/components/ui/Sheet";
import type { Palette } from "@/data/palettes";
import { stickerEmojis } from "@/data/presets";
import { sound } from "@/lib/sound";

interface StickerPickerProps {
  palette: Palette;
  onPick: (emoji: string) => void;
  onClose: () => void;
}

export function StickerPicker({ palette, onPick, onClose }: StickerPickerProps) {
  return (
    <Sheet
      title="Colar um adesivo"
      subtitle="Depois é só arrastar para onde quiser."
      accent={palette.soft}
      onClose={onClose}
    >
      <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
        {stickerEmojis.map((emoji) => (
          <button
            key={emoji}
            type="button"
            aria-label={`Colar ${emoji}`}
            onClick={() => {
              sound.sticker();
              onPick(emoji);
            }}
            className="flex aspect-square items-center justify-center rounded-2xl border-[3px] border-ink bg-cream text-2xl transition-transform hover:-translate-y-[2px] active:translate-y-[1px]"
          >
            {emoji}
          </button>
        ))}
      </div>
    </Sheet>
  );
}
