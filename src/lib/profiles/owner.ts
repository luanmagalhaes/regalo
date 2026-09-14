import { createHmac, timingSafeEqual } from "node:crypto";

export const ownerCookieName = "regalo_owner";
export const ownerCookieMaxAge = 60 * 60 * 24 * 180;

export interface OwnerClaims {
  ids: string[];
  master: boolean;
  exp: number;
}

const empty: OwnerClaims = { ids: [], master: false, exp: 0 };

function secret(): string {
  return process.env.REGALO_PASSPHRASE ?? process.env.SUPABASE_SECRET_KEY ?? "regalo-sem-segredo";
}

function encode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function packClaims(claims: OwnerClaims): string {
  const payload = encode(JSON.stringify(claims));

  return `${payload}.${sign(payload)}`;
}

export function readClaims(token: string | undefined): OwnerClaims {
  if (!token) {
    return empty;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return empty;
  }

  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);

  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return empty;
  }

  try {
    const parsed = JSON.parse(decode(payload)) as Partial<OwnerClaims>;
    const ids = Array.isArray(parsed.ids) ? parsed.ids.filter((id) => typeof id === "string") : [];
    const exp = typeof parsed.exp === "number" ? parsed.exp : 0;

    if (exp < Date.now()) {
      return empty;
    }

    return { ids, master: parsed.master === true, exp };
  } catch {
    return empty;
  }
}

export function withProfile(claims: OwnerClaims, profileId: string): OwnerClaims {
  return {
    ids: claims.ids.includes(profileId) ? claims.ids : [...claims.ids, profileId].slice(-20),
    master: claims.master,
    exp: Date.now() + ownerCookieMaxAge * 1000,
  };
}

export function withoutProfile(claims: OwnerClaims, profileId: string): OwnerClaims {
  return {
    ids: claims.ids.filter((id) => id !== profileId),
    master: claims.master,
    exp: Date.now() + ownerCookieMaxAge * 1000,
  };
}

export function asMaster(claims: OwnerClaims): OwnerClaims {
  return { ids: claims.ids, master: true, exp: Date.now() + ownerCookieMaxAge * 1000 };
}

export function ownsProfile(claims: OwnerClaims, profileId: string): boolean {
  return claims.master || claims.ids.includes(profileId);
}
