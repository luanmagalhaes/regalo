import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const root = new URL("../../", import.meta.url);
const source = new URL("assets/gift-cutout.png", root).pathname;
const crop = { left: 150, top: 110, width: 1680, height: 1680 };
const clear = { r: 0, g: 0, b: 0, alpha: 0 };
const cream = { r: 255, g: 246, b: 234, alpha: 1 };

async function squared(size, background = cream) {
  const art = sharp(source).extract(crop).resize(size, size, { fit: "contain", background: clear });

  return (background === clear ? art : art.flatten({ background }))
    .png({ compressionLevel: 9, palette: true, quality: 82, effort: 9 })
    .toBuffer();
}

async function maskable(size) {
  const inner = Math.round(size * 0.78);
  const art = await sharp(source)
    .extract(crop)
    .resize(inner, inner, { fit: "contain", background: clear })
    .toBuffer();

  return sharp({
    create: { width: size, height: size, channels: 4, background: cream },
  })
    .composite([{ input: art, gravity: "center" }])
    .png({ compressionLevel: 9, palette: true, quality: 82, effort: 9 })
    .toBuffer();
}

await mkdir(new URL("public/", root), { recursive: true });

const targets = [
  { to: "public/icon-192.png", size: 192, kind: "square" },
  { to: "public/icon-512.png", size: 512, kind: "square" },
  { to: "src/app/icon.png", size: 512, kind: "square" },
  { to: "src/app/apple-icon.png", size: 180, kind: "square" },
  { to: "public/icon-maskable-512.png", size: 512, kind: "maskable" },
];

for (const target of targets) {
  const png =
    target.kind === "maskable"
      ? await maskable(target.size)
      : await squared(target.size, target.kind === "clear" ? clear : cream);

  await writeFile(new URL(target.to, root), png);
  console.log(`${target.to} — ${target.size}x${target.size} — ${(png.length / 1024).toFixed(1)} kB`);
}
