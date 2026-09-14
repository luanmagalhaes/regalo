import type { Profile } from "@/types/profile";

export interface Badge {
  key: string;
  emoji: string;
  title: string;
  hint: string;
  earned: boolean;
}

export interface Progress {
  filled: number;
  total: number;
  percent: number;
  level: number;
  levelTitle: string;
  toNextLevel: number;
  badges: Badge[];
}

const levelTitles = [
  "Embrulho vazio",
  "Laço amarrado",
  "Caixa montada",
  "Presente pronto",
  "Vitrine completa",
];

export const maxLevel = levelTitles.length;

function filledItems(profile: Profile): number {
  return profile.items.filter((item) => item.value.trim().length > 0).length;
}

export function progressFor(profile: Profile): Progress {
  const goals = [
    profile.items.length > 0,
    filledItems(profile) >= 5,
    filledItems(profile) >= 10,
    Boolean(profile.birthday),
    profile.loves.length > 0,
    profile.dislikes.length > 0 || profile.plenty.length > 0,
    profile.stickers.length > 0,
    profile.items.every((item) => !item.pending) && profile.items.length > 0,
  ];

  const total = goals.length;
  const filled = goals.filter(Boolean).length;
  const percent = Math.round((filled / total) * 100);
  const level = Math.max(1, Math.min(maxLevel, Math.ceil((filled / total) * maxLevel)));
  const perLevel = total / maxLevel;
  const toNextLevel = level >= maxLevel ? 0 : Math.max(1, Math.ceil(level * perLevel) - filled + 1);

  const badges: Badge[] = [
    {
      key: "first-item",
      emoji: "🎀",
      title: "Primeiro tamanho",
      hint: "Guardou pelo menos uma medida",
      earned: goals[0],
    },
    {
      key: "half-way",
      emoji: "🍦",
      title: "Meio sorvete",
      hint: "Cinco medidas preenchidas",
      earned: goals[1],
    },
    {
      key: "birthday",
      emoji: "🎂",
      title: "Data marcada",
      hint: "Colocou a data de aniversário",
      earned: goals[3],
    },
    {
      key: "loves",
      emoji: "💝",
      title: "Deu a dica",
      hint: "Contou o que ama ganhar",
      earned: goals[4],
    },
    {
      key: "decorated",
      emoji: "✨",
      title: "Espaço decorado",
      hint: "Colou pelo menos um adesivo no perfil",
      earned: goals[6],
    },
    {
      key: "confirmed",
      emoji: "🏆",
      title: "Tudo confirmado",
      hint: "Nenhuma medida marcada como a confirmar",
      earned: goals[7],
    },
  ];

  return {
    filled,
    total,
    percent,
    level,
    levelTitle: levelTitles[level - 1],
    toNextLevel,
    badges,
  };
}

export function pendingCount(profile: Profile): number {
  return profile.items.filter((item) => item.pending).length;
}

export function isEmptyProfile(profile: Profile): boolean {
  return (
    profile.items.length === 0 &&
    profile.loves.length === 0 &&
    profile.dislikes.length === 0 &&
    profile.plenty.length === 0
  );
}
