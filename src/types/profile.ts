export type PaletteKey =
  | "morango"
  | "pistache"
  | "blueberry"
  | "uva"
  | "caramelo"
  | "menta"
  | "baunilha"
  | "chocolate";

export interface Sticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface ProfileItem {
  id: string;
  profileId: string;
  icon: string;
  label: string;
  value: string;
  hint: string;
  pending: boolean;
  position: number;
}

export interface Profile {
  id: string;
  name: string;
  emoji: string;
  photo: string | null;
  birthday: string | null;
  palette: PaletteKey;
  stickers: Sticker[];
  loves: string[];
  dislikes: string[];
  plenty: string[];
  wish: string;
  care: string;
  position: number;
  locked: boolean;
  items: ProfileItem[];
}

export interface ProfileDraft {
  name: string;
  emoji: string;
  photo: string | null;
  birthday: string | null;
  palette: PaletteKey;
}

export interface ItemDraft {
  icon: string;
  label: string;
  value: string;
  hint: string;
  pending: boolean;
}
