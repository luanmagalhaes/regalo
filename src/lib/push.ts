export type PushState = "unsupported" | "default" | "granted" | "denied";

const listeners = new Set<() => void>();

export function subscribePush(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function pushSnapshot(): PushState {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }

  return Notification.permission as PushState;
}

export function serverPushSnapshot(): PushState {
  return "unsupported";
}

export function askPushPermission(): Promise<PushState> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return Promise.resolve("unsupported");
  }

  return Notification.requestPermission()
    .then((answer) => {
      listeners.forEach((listener) => listener());

      return answer as PushState;
    })
    .catch(() => "denied" as PushState);
}
