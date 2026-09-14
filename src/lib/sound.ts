interface Note {
  hz: number;
  at: number;
  seconds: number;
  wave?: OscillatorType;
  gain?: number;
  slideTo?: number;
}

let context: AudioContext | null = null;
let muted = false;

function constructorFor(): typeof AudioContext | null {
  if (typeof window === "undefined") {
    return null;
  }

  const scoped = window as Window & { webkitAudioContext?: typeof AudioContext };

  return window.AudioContext ?? scoped.webkitAudioContext ?? null;
}

function contextFor(): AudioContext | null {
  if (context) {
    return context;
  }

  const Ctor = constructorFor();

  if (!Ctor) {
    return null;
  }

  try {
    context = new Ctor();
  } catch {
    return null;
  }

  return context;
}

export function applyMuted(next: boolean) {
  muted = next;
}

export function unlockSound() {
  const audio = contextFor();

  if (audio && audio.state === "suspended") {
    void audio.resume().catch(() => undefined);
  }
}

function play(notes: readonly Note[]) {
  if (muted) {
    return;
  }

  const audio = contextFor();

  if (!audio) {
    return;
  }

  if (audio.state === "suspended") {
    void audio.resume().catch(() => undefined);
  }

  try {
    const start = audio.currentTime + 0.01;

    for (const note of notes) {
      const tone = audio.createOscillator();
      const level = audio.createGain();
      const from = start + note.at;
      const peak = note.gain ?? 0.12;

      tone.type = note.wave ?? "sine";
      tone.frequency.setValueAtTime(note.hz, from);

      if (note.slideTo) {
        tone.frequency.exponentialRampToValueAtTime(note.slideTo, from + note.seconds);
      }

      level.gain.setValueAtTime(0.0001, from);
      level.gain.exponentialRampToValueAtTime(peak, from + 0.014);
      level.gain.exponentialRampToValueAtTime(0.0001, from + note.seconds);

      tone.connect(level);
      level.connect(audio.destination);
      tone.start(from);
      tone.stop(from + note.seconds + 0.02);
    }
  } catch {
    return;
  }
}

export const sound = {
  tap: () => play([{ hz: 720, at: 0, seconds: 0.05, wave: "triangle", gain: 0.05 }]),

  pick: () => play([{ hz: 940, at: 0, seconds: 0.07, wave: "sine", gain: 0.07 }]),

  pop: () =>
    play([
      { hz: 520, at: 0, seconds: 0.06, wave: "sine", gain: 0.09, slideTo: 1040 },
      { hz: 1320, at: 0.06, seconds: 0.09, wave: "triangle", gain: 0.07 },
    ]),

  saved: () =>
    play([
      { hz: 659.25, at: 0, seconds: 0.09, wave: "triangle", gain: 0.1 },
      { hz: 880, at: 0.08, seconds: 0.1, wave: "triangle", gain: 0.1 },
      { hz: 1174.66, at: 0.17, seconds: 0.18, wave: "sine", gain: 0.09 },
    ]),

  sticker: () =>
    play([{ hz: 1180, at: 0, seconds: 0.06, wave: "square", gain: 0.045, slideTo: 1560 }]),

  party: () =>
    play([
      { hz: 523.25, at: 0, seconds: 0.12, wave: "triangle", gain: 0.11 },
      { hz: 659.25, at: 0.12, seconds: 0.12, wave: "triangle", gain: 0.11 },
      { hz: 783.99, at: 0.24, seconds: 0.12, wave: "triangle", gain: 0.11 },
      { hz: 1046.5, at: 0.36, seconds: 0.34, wave: "triangle", gain: 0.13 },
      { hz: 1318.51, at: 0.42, seconds: 0.3, wave: "sine", gain: 0.08 },
    ]),

  opening: () =>
    play([
      { hz: 523.25, at: 0, seconds: 0.16, wave: "triangle", gain: 0.1 },
      { hz: 659.25, at: 0.13, seconds: 0.16, wave: "triangle", gain: 0.1 },
      { hz: 783.99, at: 0.26, seconds: 0.16, wave: "triangle", gain: 0.1 },
      { hz: 1046.5, at: 0.39, seconds: 0.2, wave: "triangle", gain: 0.11 },

      { hz: 1318.51, at: 0.58, seconds: 0.26, wave: "sine", gain: 0.09 },
      { hz: 1567.98, at: 0.58, seconds: 0.26, wave: "sine", gain: 0.06 },

      { hz: 987.77, at: 0.86, seconds: 0.14, wave: "triangle", gain: 0.09 },
      { hz: 1174.66, at: 1, seconds: 0.14, wave: "triangle", gain: 0.09 },
      { hz: 1567.98, at: 1.14, seconds: 0.44, wave: "triangle", gain: 0.12 },
      { hz: 2093, at: 1.18, seconds: 0.4, wave: "sine", gain: 0.05 },

      { hz: 2637.02, at: 1.3, seconds: 0.3, wave: "sine", gain: 0.035 },
    ]),

  oops: () =>
    play([
      { hz: 330, at: 0, seconds: 0.14, wave: "sawtooth", gain: 0.07, slideTo: 220 },
    ]),
};
