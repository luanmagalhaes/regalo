import { parseBirthday } from "@/lib/birthday";
import { serverClient } from "@/lib/supabase/server";
import { hasIcon } from "@/data/iconKeys";
import { palettes } from "@/data/palettes";
import { hashPin, isMasterPin, isPinShaped, pinMatches } from "@/lib/profiles/pin";
import type { PaletteKey, Profile, ProfileItem, Sticker } from "@/types/profile";

export class ServiceError extends Error {
  readonly status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

const maxNameLength = 32;
const maxLabelLength = 32;
const maxValueLength = 48;
const maxHintLength = 120;
const maxTags = 24;
const maxTagLength = 60;
const maxCareLength = 280;
const maxWishLength = 600;
const maxStickers = 60;
const maxPhotoLength = 300_000;
const maxItems = 60;
const maxProfiles = 40;

interface ProfileRow {
  id: string;
  name: string;
  emoji: string;
  photo: string | null;
  birthday: string | null;
  palette: string;
  stickers: unknown;
  loves: unknown;
  dislikes: unknown;
  plenty: unknown;
  wish: string | null;
  care: string | null;
  position: number;
  pin_hash: string | null;
  pin_fails: number | null;
  pin_locked_until: string | null;
}

interface ItemRow {
  id: string;
  profile_id: string;
  icon: string;
  label: string;
  value: string;
  hint: string | null;
  pending: boolean;
  position: number;
}

function text(value: unknown, field: string, limit: number, required = true): string {
  if (typeof value !== "string") {
    if (required) {
      throw new ServiceError(`${field} precisa ser texto`, 422);
    }

    return "";
  }

  const clean = value.trim().replace(/\s+/g, " ");

  if (required && clean.length === 0) {
    throw new ServiceError(`${field} não pode ficar vazio`, 422);
  }

  if (clean.length > limit) {
    throw new ServiceError(`${field} passou de ${limit} caracteres`, 422);
  }

  return clean;
}

function tagList(value: unknown, field: string): string[] {
  if (!Array.isArray(value)) {
    throw new ServiceError(`${field} precisa ser uma lista`, 422);
  }

  if (value.length > maxTags) {
    throw new ServiceError(`${field} aceita no máximo ${maxTags} itens`, 422);
  }

  return value.map((entry) => text(entry, field, maxTagLength));
}

function paletteKey(value: unknown): PaletteKey {
  if (typeof value !== "string" || !(value in palettes)) {
    throw new ServiceError("essa cor não existe", 422);
  }

  return value as PaletteKey;
}

function photoValue(value: unknown): string | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value !== "string" || !value.startsWith("data:image/")) {
    throw new ServiceError("não reconheci esse arquivo como foto", 422);
  }

  if (value.length > maxPhotoLength) {
    throw new ServiceError("essa foto ficou pesada demais", 413);
  }

  return value;
}

function birthdayValue(value: unknown): string | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value !== "string" || !parseBirthday(value)) {
    throw new ServiceError("essa data de nascimento não existe", 422);
  }

  const today = new Date();
  const limit = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate(),
  ).padStart(2, "0")}`;

  if (value > limit) {
    throw new ServiceError("data de nascimento não pode estar no futuro", 422);
  }

  return value;
}

function stickerList(value: unknown): Sticker[] {
  if (!Array.isArray(value)) {
    throw new ServiceError("os adesivos vieram em formato inesperado", 422);
  }

  if (value.length > maxStickers) {
    throw new ServiceError(`cabem no máximo ${maxStickers} adesivos`, 422);
  }

  return value.map((entry) => {
    const sticker = entry as Partial<Sticker>;

    if (typeof sticker.emoji !== "string" || sticker.emoji.length === 0) {
      throw new ServiceError("adesivo sem emoji", 422);
    }

    const bounded = (input: unknown, min: number, max: number, fallback: number): number => {
      const parsed = typeof input === "number" && Number.isFinite(input) ? input : fallback;

      return Math.min(max, Math.max(min, parsed));
    };

    return {
      id: typeof sticker.id === "string" && sticker.id.length > 0 ? sticker.id.slice(0, 40) : crypto.randomUUID(),
      emoji: sticker.emoji.slice(0, 8),
      x: bounded(sticker.x, 0, 100, 50),
      y: bounded(sticker.y, 0, 100, 50),
      scale: bounded(sticker.scale, 0.5, 3, 1),
      rotation: bounded(sticker.rotation, -180, 180, 0),
    };
  });
}

function toProfile(row: ProfileRow, items: ItemRow[]): Profile {
  return {
    id: row.id,
    name: row.name,
    emoji: row.emoji,
    photo: row.photo,
    birthday: row.birthday,
    palette: (row.palette in palettes ? row.palette : "morango") as PaletteKey,
    stickers: Array.isArray(row.stickers) ? (row.stickers as Sticker[]) : [],
    loves: Array.isArray(row.loves) ? (row.loves as string[]) : [],
    dislikes: Array.isArray(row.dislikes) ? (row.dislikes as string[]) : [],
    plenty: Array.isArray(row.plenty) ? (row.plenty as string[]) : [],
    wish: row.wish ?? "",
    care: row.care ?? "",
    position: row.position,
    locked: Boolean(row.pin_hash),
    items: items
      .filter((item) => item.profile_id === row.id)
      .map(
        (item): ProfileItem => ({
          id: item.id,
          profileId: item.profile_id,
          icon: hasIcon(item.icon) ? item.icon : "gift",
          label: item.label,
          value: item.value,
          hint: item.hint ?? "",
          pending: item.pending,
          position: item.position,
        }),
      ),
  };
}

function fail(message: string, error: unknown): never {
  console.error(message, error);

  throw new ServiceError("não consegui falar com o banco agora", 503);
}

export async function listProfiles(): Promise<Profile[]> {
  const db = serverClient();

  const [profiles, items] = await Promise.all([
    db.from("profiles").select("*").order("position", { ascending: true }),
    db.from("profile_items").select("*").order("position", { ascending: true }),
  ]);

  if (profiles.error) {
    fail("falha ao listar perfis", profiles.error);
  }

  if (items.error) {
    fail("falha ao listar itens", items.error);
  }

  return (profiles.data as ProfileRow[]).map((row) => toProfile(row, items.data as ItemRow[]));
}

async function assertNameFree(name: string, exceptId?: string) {
  const db = serverClient();
  const { data, error } = await db.from("profiles").select("id, name");

  if (error) {
    fail("falha ao conferir nomes", error);
  }

  const taken = (data as { id: string; name: string }[]).some(
    (row) => row.id !== exceptId && row.name.toLowerCase() === name.toLowerCase(),
  );

  if (taken) {
    throw new ServiceError("já tem alguém com esse nome na turma", 409);
  }
}

export interface RosterEntry {
  id: string;
  name: string;
  emoji: string;
  photo: string | null;
  palette: PaletteKey;
  locked: boolean;
}

export async function listRoster(): Promise<RosterEntry[]> {
  const db = serverClient();
  const { data, error } = await db
    .from("profiles")
    .select("id, name, emoji, photo, palette, pin_hash")
    .order("position", { ascending: true });

  if (error) {
    fail("falha ao listar a turma", error);
  }

  return (data as ProfileRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    emoji: row.emoji,
    photo: row.photo,
    palette: (row.palette in palettes ? row.palette : "morango") as PaletteKey,
    locked: Boolean(row.pin_hash),
  }));
}

export async function createProfile(body: unknown): Promise<Profile> {
  const input = (body ?? {}) as Record<string, unknown>;
  const name = text(input.name, "o nome", maxNameLength);

  if (!isPinShaped(input.pin)) {
    throw new ServiceError("crie um PIN de 4 números para o seu espaço", 422);
  }
  const emoji = text(input.emoji ?? "🎁", "o emoji", 8);
  const palette = paletteKey(input.palette ?? "morango");
  const birthday = birthdayValue(input.birthday ?? null);
  const photo = photoValue(input.photo ?? null);

  await assertNameFree(name);

  const db = serverClient();
  const { count, error: countError } = await db
    .from("profiles")
    .select("id", { count: "exact", head: true });

  if (countError) {
    fail("falha ao contar perfis", countError);
  }

  if ((count ?? 0) >= maxProfiles) {
    throw new ServiceError(`a turma já tem ${maxProfiles} perfis`, 409);
  }

  const { data, error } = await db
    .from("profiles")
    .insert({
      name,
      emoji,
      palette,
      birthday,
      photo,
      pin_hash: hashPin(input.pin as string),
      position: count ?? 0,
    })
    .select("*")
    .single();

  if (error) {
    fail("falha ao criar perfil", error);
  }

  return toProfile(data as ProfileRow, []);
}

export async function updateProfile(id: string, body: unknown): Promise<Profile> {
  const input = (body ?? {}) as Record<string, unknown>;
  const patch: Record<string, unknown> = {};

  if ("name" in input) {
    patch.name = text(input.name, "o nome", maxNameLength);

    await assertNameFree(patch.name as string, id);
  }

  if ("emoji" in input) {
    patch.emoji = text(input.emoji, "o emoji", 8);
  }

  if ("palette" in input) {
    patch.palette = paletteKey(input.palette);
  }

  if ("birthday" in input) {
    patch.birthday = birthdayValue(input.birthday);
  }

  if ("photo" in input) {
    patch.photo = photoValue(input.photo);
  }

  if ("stickers" in input) {
    patch.stickers = stickerList(input.stickers);
  }

  if ("loves" in input) {
    patch.loves = tagList(input.loves, "a lista do que ama ganhar");
  }

  if ("dislikes" in input) {
    patch.dislikes = tagList(input.dislikes, "a lista do que não curte");
  }

  if ("plenty" in input) {
    patch.plenty = tagList(input.plenty, "a lista do que já tem demais");
  }

  if ("wish" in input) {
    patch.wish = text(input.wish, "a dica", maxWishLength, false);
  }

  if ("care" in input) {
    patch.care = text(input.care, "a observação", maxCareLength, false);
  }

  if (Object.keys(patch).length === 0) {
    throw new ServiceError("nada para atualizar", 422);
  }

  patch.updated_at = new Date().toISOString();

  const db = serverClient();
  const { data, error } = await db
    .from("profiles")
    .update(patch)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    fail("falha ao atualizar perfil", error);
  }

  if (!data) {
    throw new ServiceError("esse perfil não existe mais", 404);
  }

  const items = await db
    .from("profile_items")
    .select("*")
    .eq("profile_id", id)
    .order("position", { ascending: true });

  if (items.error) {
    fail("falha ao ler itens do perfil", items.error);
  }

  return toProfile(data as ProfileRow, items.data as ItemRow[]);
}

export async function deleteProfile(id: string): Promise<{ id: string }> {
  const db = serverClient();
  const { error } = await db.from("profiles").delete().eq("id", id);

  if (error) {
    fail("falha ao apagar perfil", error);
  }

  return { id };
}

export async function createItem(profileId: string, body: unknown): Promise<ProfileItem> {
  const input = (body ?? {}) as Record<string, unknown>;
  const label = text(input.label, "o nome do item", maxLabelLength);
  const value = text(input.value ?? "", "o tamanho", maxValueLength, false);
  const hint = text(input.hint ?? "", "a observação", maxHintLength, false);
  const icon = typeof input.icon === "string" && hasIcon(input.icon) ? input.icon : "gift";
  const pending = input.pending === true;

  const db = serverClient();
  const { data: owner, error: ownerError } = await db
    .from("profiles")
    .select("id")
    .eq("id", profileId)
    .maybeSingle();

  if (ownerError) {
    fail("falha ao conferir o perfil", ownerError);
  }

  if (!owner) {
    throw new ServiceError("esse perfil não existe mais", 404);
  }

  const { count, error: countError } = await db
    .from("profile_items")
    .select("id", { count: "exact", head: true })
    .eq("profile_id", profileId);

  if (countError) {
    fail("falha ao contar itens", countError);
  }

  if ((count ?? 0) >= maxItems) {
    throw new ServiceError(`esse perfil já tem ${maxItems} itens`, 409);
  }

  const { data, error } = await db
    .from("profile_items")
    .insert({ profile_id: profileId, icon, label, value, hint, pending, position: count ?? 0 })
    .select("*")
    .single();

  if (error) {
    fail("falha ao criar item", error);
  }

  const row = data as ItemRow;

  return {
    id: row.id,
    profileId: row.profile_id,
    icon: row.icon,
    label: row.label,
    value: row.value,
    hint: row.hint ?? "",
    pending: row.pending,
    position: row.position,
  };
}

export async function updateItem(id: string, body: unknown): Promise<ProfileItem> {
  const input = (body ?? {}) as Record<string, unknown>;
  const patch: Record<string, unknown> = {};

  if ("label" in input) {
    patch.label = text(input.label, "o nome do item", maxLabelLength);
  }

  if ("value" in input) {
    patch.value = text(input.value, "o tamanho", maxValueLength, false);
  }

  if ("hint" in input) {
    patch.hint = text(input.hint, "a observação", maxHintLength, false);
  }

  if ("icon" in input) {
    patch.icon = typeof input.icon === "string" && hasIcon(input.icon) ? input.icon : "gift";
  }

  if ("pending" in input) {
    patch.pending = input.pending === true;
  }

  if ("position" in input && typeof input.position === "number") {
    patch.position = Math.max(0, Math.round(input.position));
  }

  if (Object.keys(patch).length === 0) {
    throw new ServiceError("nada para atualizar", 422);
  }

  const db = serverClient();
  const { data, error } = await db
    .from("profile_items")
    .update(patch)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    fail("falha ao atualizar item", error);
  }

  if (!data) {
    throw new ServiceError("esse item não existe mais", 404);
  }

  const row = data as ItemRow;

  return {
    id: row.id,
    profileId: row.profile_id,
    icon: row.icon,
    label: row.label,
    value: row.value,
    hint: row.hint ?? "",
    pending: row.pending,
    position: row.position,
  };
}

export async function deleteItem(id: string): Promise<{ id: string }> {
  const db = serverClient();
  const { error } = await db.from("profile_items").delete().eq("id", id);

  if (error) {
    fail("falha ao apagar item", error);
  }

  return { id };
}

const lockWindowMs = 60_000;
const failsBeforeLock = 5;

export type ClaimOutcome =
  | { outcome: "created" }
  | { outcome: "matched" }
  | { outcome: "master" };

export async function claimProfile(profileId: string, pin: unknown): Promise<ClaimOutcome> {
  if (!isPinShaped(pin)) {
    throw new ServiceError("o PIN tem 4 números", 422);
  }

  const db = serverClient();
  const { data, error } = await db
    .from("profiles")
    .select("id, pin_hash, pin_fails, pin_locked_until")
    .eq("id", profileId)
    .maybeSingle();

  if (error) {
    fail("falha ao ler o perfil para liberar", error);
  }

  if (!data) {
    throw new ServiceError("esse perfil não existe mais", 404);
  }

  const row = data as {
    pin_hash: string | null;
    pin_fails: number | null;
    pin_locked_until: string | null;
  };

  if (row.pin_locked_until && new Date(row.pin_locked_until).getTime() > Date.now()) {
    throw new ServiceError("muitas tentativas seguidas, espere um minuto", 429);
  }

  if (isMasterPin(pin)) {
    return { outcome: "master" };
  }

  if (!row.pin_hash) {
    const { error: setError } = await db
      .from("profiles")
      .update({ pin_hash: hashPin(pin), pin_fails: 0, pin_locked_until: null })
      .eq("id", profileId);

    if (setError) {
      fail("falha ao guardar o PIN", setError);
    }

    return { outcome: "created" };
  }

  if (!pinMatches(pin, row.pin_hash)) {
    const fails = (row.pin_fails ?? 0) + 1;
    const locked = fails >= failsBeforeLock ? new Date(Date.now() + lockWindowMs).toISOString() : null;

    await db
      .from("profiles")
      .update({ pin_fails: locked ? 0 : fails, pin_locked_until: locked })
      .eq("id", profileId);

    throw new ServiceError(locked ? "errou demais, espere um minuto" : "esse PIN não confere", 401);
  }

  if ((row.pin_fails ?? 0) > 0 || row.pin_locked_until) {
    await db.from("profiles").update({ pin_fails: 0, pin_locked_until: null }).eq("id", profileId);
  }

  return { outcome: "matched" };
}

export async function resetPin(profileId: string): Promise<{ id: string }> {
  const db = serverClient();
  const { error } = await db
    .from("profiles")
    .update({ pin_hash: null, pin_fails: 0, pin_locked_until: null })
    .eq("id", profileId);

  if (error) {
    fail("falha ao limpar o PIN", error);
  }

  return { id: profileId };
}

export async function profileIdForItem(itemId: string): Promise<string> {
  const db = serverClient();
  const { data, error } = await db
    .from("profile_items")
    .select("profile_id")
    .eq("id", itemId)
    .maybeSingle();

  if (error) {
    fail("falha ao localizar o item", error);
  }

  if (!data) {
    throw new ServiceError("esse item não existe mais", 404);
  }

  return (data as { profile_id: string }).profile_id;
}
