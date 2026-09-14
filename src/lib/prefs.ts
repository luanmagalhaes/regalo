const meKey = "regalo.me";
const mutedKey = "regalo.muted";
const noticedKey = "regalo.noticed";

const listeners = new Set<() => void>();

export interface Prefs {
  me: string | null;
  muted: boolean;
  noticed: string[];
}

const serverValue: Prefs = { me: null, muted: false, noticed: [] };

let cached: Prefs = serverValue;
let cachedRaw = "";

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    return;
  }

  announce();
}

function announce() {
  listeners.forEach((listener) => listener());
}

export function subscribePrefs(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function prefsSnapshot(): Prefs {
  const me = read(meKey);
  const muted = read(mutedKey) === "1";
  const noticedRaw = read(noticedKey) ?? "[]";
  const raw = `${me ?? ""}|${muted ? "1" : "0"}|${noticedRaw}`;

  if (raw !== cachedRaw) {
    let noticed: string[] = [];

    try {
      const parsed = JSON.parse(noticedRaw) as unknown;

      noticed = Array.isArray(parsed) ? parsed.filter((entry) => typeof entry === "string") : [];
    } catch {
      noticed = [];
    }

    cachedRaw = raw;
    cached = { me, muted, noticed };
  }

  return cached;
}

export function serverPrefsSnapshot(): Prefs {
  return serverValue;
}

export function rememberMe(profileId: string | null) {
  if (profileId === null) {
    try {
      window.localStorage.removeItem(meKey);
    } catch {
      return;
    }

    announce();

    return;
  }

  write(meKey, profileId);
}

export function rememberMuted(muted: boolean) {
  write(mutedKey, muted ? "1" : "0");
}

export function rememberNoticed(tokens: readonly string[]) {
  write(noticedKey, JSON.stringify(tokens.slice(-40)));
}
