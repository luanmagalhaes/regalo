export type PushState = "unsupported" | "default" | "granted" | "denied";

const listeners = new Set<() => void>();

export function subscribePush(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function announce() {
  listeners.forEach((listener) => listener());
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

export function pushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}

function toUint8(base64: string): Uint8Array {
  const padded = `${base64}${"=".repeat((4 - (base64.length % 4)) % 4)}`
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const raw = window.atob(padded);
  const bytes = new Uint8Array(raw.length);

  for (let index = 0; index < raw.length; index += 1) {
    bytes[index] = raw.charCodeAt(index);
  }

  return bytes;
}

async function saveSubscription(): Promise<boolean> {
  const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  if (!key) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js");

    await navigator.serviceWorker.ready;

    const existing = await registration.pushManager.getSubscription();
    const subscription =
      existing ??
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: toUint8(key) as BufferSource,
      }));

    const response = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription.toJSON()),
    });

    return response.ok;
  } catch (cause) {
    console.error("não consegui assinar os avisos", cause);

    return false;
  }
}

export async function enablePush(): Promise<PushState> {
  if (!pushSupported()) {
    return "unsupported";
  }

  const answer =
    Notification.permission === "default"
      ? ((await Notification.requestPermission()) as PushState)
      : (Notification.permission as PushState);

  announce();

  if (answer === "granted") {
    await saveSubscription();
  }

  return answer;
}

export async function refreshPush(): Promise<void> {
  if (!pushSupported() || Notification.permission !== "granted") {
    return;
  }

  await saveSubscription();
}
