import { mkdir, writeFile } from "node:fs/promises";

const rate = 22050;
const root = new URL("../../", import.meta.url);

const notes = [
  { hz: 523.25, at: 0, seconds: 0.16, wave: "triangle", gain: 0.22 },
  { hz: 659.25, at: 0.13, seconds: 0.16, wave: "triangle", gain: 0.22 },
  { hz: 783.99, at: 0.26, seconds: 0.16, wave: "triangle", gain: 0.22 },
  { hz: 1046.5, at: 0.39, seconds: 0.2, wave: "triangle", gain: 0.24 },
  { hz: 1318.51, at: 0.58, seconds: 0.26, wave: "sine", gain: 0.2 },
  { hz: 1567.98, at: 0.58, seconds: 0.26, wave: "sine", gain: 0.13 },
  { hz: 987.77, at: 0.86, seconds: 0.14, wave: "triangle", gain: 0.2 },
  { hz: 1174.66, at: 1, seconds: 0.14, wave: "triangle", gain: 0.2 },
  { hz: 1567.98, at: 1.14, seconds: 0.5, wave: "triangle", gain: 0.26 },
  { hz: 2093, at: 1.18, seconds: 0.44, wave: "sine", gain: 0.11 },
  { hz: 2637.02, at: 1.3, seconds: 0.32, wave: "sine", gain: 0.07 },
];

function shape(wave, phase) {
  if (wave === "sine") {
    return Math.sin(phase);
  }

  const cycle = phase / (Math.PI * 2) - Math.floor(phase / (Math.PI * 2));

  if (wave === "triangle") {
    return 4 * Math.abs(cycle - 0.5) - 1;
  }

  return cycle < 0.5 ? 1 : -1;
}

const seconds = Math.max(...notes.map((note) => note.at + note.seconds)) + 0.25;
const frames = Math.ceil(seconds * rate);
const samples = new Float32Array(frames);

for (const note of notes) {
  const from = Math.floor(note.at * rate);
  const length = Math.floor(note.seconds * rate);
  const attack = Math.max(1, Math.floor(0.012 * rate));

  for (let index = 0; index < length; index += 1) {
    const position = from + index;

    if (position >= frames) {
      break;
    }

    const phase = (2 * Math.PI * note.hz * index) / rate;
    const rise = Math.min(1, index / attack);
    const fall = Math.pow(1 - index / length, 1.8);

    samples[position] += shape(note.wave, phase) * note.gain * rise * fall;
  }
}

let peak = 0;

for (const value of samples) {
  peak = Math.max(peak, Math.abs(value));
}

const normal = peak > 0 ? 0.82 / peak : 1;
const body = Buffer.alloc(frames * 2);

for (let index = 0; index < frames; index += 1) {
  const clamped = Math.max(-1, Math.min(1, samples[index] * normal));

  body.writeInt16LE(Math.round(clamped * 32767), index * 2);
}

const header = Buffer.alloc(44);

header.write("RIFF", 0);
header.writeUInt32LE(36 + body.length, 4);
header.write("WAVE", 8);
header.write("fmt ", 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(1, 22);
header.writeUInt32LE(rate, 24);
header.writeUInt32LE(rate * 2, 28);
header.writeUInt16LE(2, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(body.length, 40);

await mkdir(new URL("public/sounds/", root), { recursive: true });
await writeFile(new URL("public/sounds/opening.wav", root), Buffer.concat([header, body]));

console.log(
  `public/sounds/opening.wav — ${seconds.toFixed(2)}s — ${((header.length + body.length) / 1024).toFixed(1)} kB`,
);
