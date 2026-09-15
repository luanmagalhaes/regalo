import type { Profile } from "@/types/profile";

export interface Badge {
  key: string;
  emoji: string;
  title: string;
  hint: string;
  todo: string;
  earned: boolean;
}

export interface Progress {
  filled: number;
  total: number;
  percent: number;
  level: number;
  levelTitle: string;
  nextStep: string | null;
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
  const filled = filledItems(profile);

  const badges: Badge[] = [
    {
      key: "first-item",
      emoji: "🎀",
      title: "Primeiro tamanho",
      hint: "Você guardou pelo menos um item no perfil.",
      todo: "Toque no + e guarde o primeiro item.",
      earned: profile.items.length > 0,
    },
    {
      key: "half-way",
      emoji: "🍦",
      title: "Meio sorvete",
      hint: "Cinco itens preenchidos no perfil.",
      todo: `Preencha ${Math.max(0, 5 - filled)} item(ns) para chegar a cinco.`,
      earned: filled >= 5,
    },
    {
      key: "full-closet",
      emoji: "🧁",
      title: "Guarda-roupa inteiro",
      hint: "Dez itens preenchidos. Quem for comprar não erra.",
      todo: `Preencha ${Math.max(0, 10 - filled)} item(ns) para chegar a dez.`,
      earned: filled >= 10,
    },
    {
      key: "birthday",
      emoji: "🎂",
      title: "Data marcada",
      hint: "Seu aniversário está no tracker do Bibuaidi.",
      todo: "Toque em ajustar perfil e coloque sua data de aniversário.",
      earned: Boolean(profile.birthday),
    },
    {
      key: "loves",
      emoji: "💝",
      title: "Deu a dica",
      hint: "O Bibuaidi sabe o que você ama ganhar.",
      todo: "Escreva ao menos uma coisa em ama ganhar.",
      earned: profile.loves.length > 0,
    },
    {
      key: "honest",
      emoji: "🙅",
      title: "Sinceridade",
      hint: "Você disse o que não curte ou o que já tem demais.",
      todo: "Preencha não curte ou já tem demais.",
      earned: profile.dislikes.length > 0 || profile.plenty.length > 0,
    },
    {
      key: "decorated",
      emoji: "✨",
      title: "Espaço decorado",
      hint: "Tem adesivo colado no seu perfil.",
      todo: "Toque em colar adesivo e escolha um emoji.",
      earned: profile.stickers.length > 0,
    },
    {
      key: "confirmed",
      emoji: "🏆",
      title: "Tudo confirmado",
      hint: "Nenhum item está marcado como a confirmar.",
      todo: "Confirme os itens marcados com a etiqueta amarela.",
      earned: profile.items.length > 0 && profile.items.every((item) => !item.pending),
    },
  ];

  const total = badges.length;
  const earned = badges.filter((badge) => badge.earned).length;
  const percent = Math.round((earned / total) * 100);
  const level =
    earned >= total
      ? maxLevel
      : Math.max(1, Math.min(maxLevel - 1, Math.ceil((earned / total) * (maxLevel - 1))));
  const missing = badges.find((badge) => !badge.earned);

  return {
    filled: earned,
    total,
    percent,
    level,
    levelTitle: levelTitles[level - 1],
    nextStep: missing ? missing.todo : null,
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
