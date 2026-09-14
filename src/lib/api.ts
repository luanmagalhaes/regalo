import { messageForStatus, networkMessage, unreadableMessage } from "@/lib/messages";
import type { ItemDraft, Profile, ProfileDraft, ProfileItem, Sticker } from "@/types/profile";

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status = 0) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(path, {
      ...init,
      cache: "no-store",
      headers: { "Content-Type": "application/json", ...init.headers },
    });
  } catch {
    throw new ApiError(
      networkMessage(typeof navigator === "undefined" || navigator.onLine !== false),
    );
  }

  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const given = (payload as { error?: string } | null)?.error;

    throw new ApiError(given ?? messageForStatus(response.status), response.status);
  }

  if (payload === null) {
    throw new ApiError(unreadableMessage, response.status);
  }

  return payload as T;
}

export interface SessionState {
  required: boolean;
  unlocked: boolean;
}

export type ProfilePatch = Partial<{
  name: string;
  emoji: string;
  photo: string | null;
  birthday: string | null;
  palette: string;
  stickers: Sticker[];
  loves: string[];
  dislikes: string[];
  plenty: string[];
  wish: string;
  care: string;
}>;

export const api = {
  session: () => request<SessionState>("/api/session"),

  unlock: (value: string) =>
    request<SessionState>("/api/session", {
      method: "POST",
      body: JSON.stringify({ passphrase: value }),
    }),

  lock: () => request<SessionState>("/api/session", { method: "DELETE" }),

  profiles: () => request<{ profiles: Profile[] }>("/api/profiles"),

  createProfile: (draft: ProfileDraft) =>
    request<{ profile: Profile }>("/api/profiles", {
      method: "POST",
      body: JSON.stringify(draft),
    }),

  updateProfile: (id: string, patch: ProfilePatch) =>
    request<{ profile: Profile }>(`/api/profiles/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    }),

  deleteProfile: (id: string) => request<{ id: string }>(`/api/profiles/${id}`, { method: "DELETE" }),

  createItem: (profileId: string, draft: ItemDraft) =>
    request<{ item: ProfileItem }>(`/api/profiles/${profileId}/items`, {
      method: "POST",
      body: JSON.stringify(draft),
    }),

  updateItem: (id: string, patch: Partial<ItemDraft>) =>
    request<{ item: ProfileItem }>(`/api/items/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    }),

  deleteItem: (id: string) => request<{ id: string }>(`/api/items/${id}`, { method: "DELETE" }),
};
