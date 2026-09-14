import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export const pinLength = 4;

export function isPinShaped(value: unknown): value is string {
  return typeof value === "string" && new RegExp(`^\\d{${pinLength}}$`).test(value);
}

export function hashPin(pin: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(pin, salt, 32).toString("hex");

  return `scrypt$${salt}$${derived}`;
}

export function pinMatches(pin: string, stored: string | null): boolean {
  if (!stored) {
    return false;
  }

  const [scheme, salt, derived] = stored.split("$");

  if (scheme !== "scrypt" || !salt || !derived) {
    return false;
  }

  const candidate = scryptSync(pin, salt, 32);
  const expected = Buffer.from(derived, "hex");

  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

export function masterPin(): string | null {
  const value = process.env.REGALO_MASTER_PIN;

  return value && value.length > 0 ? value : null;
}

export function isMasterPin(pin: string): boolean {
  const master = masterPin();

  if (!master) {
    return false;
  }

  const given = Buffer.from(pin);
  const expected = Buffer.from(master);

  return given.length === expected.length && timingSafeEqual(given, expected);
}
