export const iconKeys = [
  "shirt",
  "dress",
  "skirt",
  "pants",
  "shorts",
  "bikini",
  "swimsuit",
  "panties",
  "bra",
  "pajamas",
  "coat",
  "hoodie",
  "shoe",
  "sneaker",
  "sock",
  "ring",
  "earring",
  "necklace",
  "bracelet",
  "cap",
  "glasses",
  "watch",
  "bag",
  "perfume",
  "book",
  "game",
  "drink",
  "candle",
  "flower",
  "plant",
  "makeup",
  "cake",
  "music",
  "home",
  "gift",
] as const;

export type IconKey = (typeof iconKeys)[number];

const known = new Set<string>(iconKeys);

export function hasIcon(key: string): boolean {
  return known.has(key);
}
