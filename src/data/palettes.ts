import type { PaletteKey } from "@/types/profile";

export interface Palette {
  key: PaletteKey;
  name: string;
  scoop: string;
  soft: string;
  deep: string;
  stage: string;
}

export const palettes: Record<PaletteKey, Palette> = {
  morango: {
    key: "morango",
    name: "Morango",
    scoop: "#ff6fa5",
    soft: "#ffd3e3",
    deep: "#d43f7c",
    stage: "linear-gradient(160deg, #ffd3e3 0%, #ffe9f1 52%, #ffc2dc 100%)",
  },
  pistache: {
    key: "pistache",
    name: "Pistache",
    scoop: "#7fd9a6",
    soft: "#d6f4e3",
    deep: "#3d9e6d",
    stage: "linear-gradient(160deg, #d6f4e3 0%, #ecfbf3 52%, #c2eed8 100%)",
  },
  blueberry: {
    key: "blueberry",
    name: "Blueberry",
    scoop: "#7c8cf8",
    soft: "#dbe0ff",
    deep: "#4a57c9",
    stage: "linear-gradient(160deg, #dbe0ff 0%, #eef0ff 52%, #cdd4ff 100%)",
  },
  uva: {
    key: "uva",
    name: "Uva",
    scoop: "#b07bff",
    soft: "#e8d9ff",
    deep: "#7c45cc",
    stage: "linear-gradient(160deg, #e8d9ff 0%, #f4ecff 52%, #ded0ff 100%)",
  },
  caramelo: {
    key: "caramelo",
    name: "Caramelo",
    scoop: "#f0a44d",
    soft: "#ffe6c7",
    deep: "#c0741f",
    stage: "linear-gradient(160deg, #ffe6c7 0%, #fff3e2 52%, #ffdcb0 100%)",
  },
  menta: {
    key: "menta",
    name: "Menta",
    scoop: "#6fd9d2",
    soft: "#d2f5f2",
    deep: "#2f9d96",
    stage: "linear-gradient(160deg, #d2f5f2 0%, #e9fbfa 52%, #bfefeb 100%)",
  },
  baunilha: {
    key: "baunilha",
    name: "Baunilha",
    scoop: "#f5cf6a",
    soft: "#fff0c9",
    deep: "#c79c22",
    stage: "linear-gradient(160deg, #fff0c9 0%, #fff8e6 52%, #ffe8ab 100%)",
  },
  chocolate: {
    key: "chocolate",
    name: "Chocolate",
    scoop: "#a9704f",
    soft: "#ecd6c6",
    deep: "#7b4a2d",
    stage: "linear-gradient(160deg, #ecd6c6 0%, #f7e9df 52%, #e0c1ab 100%)",
  },
};

export const paletteList = Object.values(palettes);

export function paletteFor(key: string): Palette {
  return palettes[key as PaletteKey] ?? palettes.morango;
}
