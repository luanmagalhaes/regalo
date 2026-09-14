import { describe, expect, it } from "vitest";
import { isEmptyProfile, maxLevel, pendingCount, progressFor } from "@/lib/progress";
import type { Profile, ProfileItem } from "@/types/profile";

const item = (position: number, value = "M", pending = false): ProfileItem => ({
  id: `item-${position}`,
  profileId: "p1",
  icon: "shirt",
  label: `Item ${position}`,
  value,
  hint: "",
  pending,
  position,
});

const profile = (patch: Partial<Profile> = {}): Profile => ({
  id: "p1",
  name: "Teste",
  emoji: "🎁",
  birthday: null,
  palette: "morango",
  stickers: [],
  loves: [],
  dislikes: [],
  plenty: [],
  care: "",
  position: 0,
  items: [],
  ...patch,
});

describe("perfil recém-criado", () => {
  it("fica no primeiro nível", () => {
    const progress = progressFor(profile());

    expect(progress.level).toBe(1);
    expect(progress.filled).toBe(0);
    expect(progress.percent).toBe(0);
  });

  it("é reconhecido como vazio", () => {
    expect(isEmptyProfile(profile())).toBe(true);
    expect(isEmptyProfile(profile({ loves: ["livro"] }))).toBe(false);
  });
});

describe("perfil preenchido", () => {
  it("chega a cem por cento com tudo respondido", () => {
    const progress = progressFor(
      profile({
        birthday: "1994-09-14",
        loves: ["livro"],
        dislikes: ["boné"],
        stickers: [{ id: "s1", emoji: "🎀", x: 10, y: 10, scale: 1, rotation: 0 }],
        items: Array.from({ length: 10 }, (_, index) => item(index)),
      }),
    );

    expect(progress.percent).toBe(100);
    expect(progress.level).toBe(maxLevel);
    expect(progress.badges.every((badge) => badge.earned)).toBe(true);
  });

  it("não dá a medalha de confirmado com item pendente", () => {
    const progress = progressFor({
      ...profile({ items: [item(0), item(1, "38/M", true)] }),
    });

    expect(progress.badges.find((badge) => badge.key === "confirmed")?.earned).toBe(false);
  });

  it("conta quantos itens faltam confirmar", () => {
    expect(pendingCount(profile({ items: [item(0), item(1, "M", true), item(2, "G", true)] }))).toBe(
      2,
    );
  });

  it("item sem valor não conta como preenchido", () => {
    const progress = progressFor(
      profile({ items: Array.from({ length: 6 }, (_, index) => item(index, "")) }),
    );

    expect(progress.badges.find((badge) => badge.key === "half-way")?.earned).toBe(false);
    expect(progress.badges.find((badge) => badge.key === "first-item")?.earned).toBe(true);
  });
});
