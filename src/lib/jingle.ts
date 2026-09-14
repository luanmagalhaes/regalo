const source = "/sounds/opening.wav";
const waitingWindowMs = 12_000;

let element: HTMLAudioElement | null = null;
let armedAt = 0;
let listening = false;

function audioFor(): HTMLAudioElement | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (!element) {
    element = new Audio(source);
    element.preload = "auto";
    element.volume = 0.65;
  }

  return element;
}

function armFirstGesture() {
  if (listening || typeof window === "undefined") {
    return;
  }

  listening = true;

  const wake = () => {
    listening = false;
    window.removeEventListener("pointerdown", wake);
    window.removeEventListener("keydown", wake);

    if (Date.now() - armedAt > waitingWindowMs) {
      return;
    }

    const audio = audioFor();

    if (audio) {
      void audio.play().catch(() => undefined);
    }
  };

  window.addEventListener("pointerdown", wake, { once: true });
  window.addEventListener("keydown", wake, { once: true });
}

export function playJingle(muted: boolean) {
  if (muted) {
    return;
  }

  const audio = audioFor();

  if (!audio) {
    return;
  }

  audio.currentTime = 0;
  armedAt = Date.now();

  void audio.play().catch(() => armFirstGesture());
}

export function primeJingle() {
  const audio = audioFor();

  audio?.load();
}
