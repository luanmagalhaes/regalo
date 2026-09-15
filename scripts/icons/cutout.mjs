import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const root = new URL("../../", import.meta.url);
const source = new URL("assets/gift-source.jpeg", root).pathname;
const target = new URL("assets/gift-cutout.png", root).pathname;

const nearWhite = 236;
const edgeSoftness = 2;

const { data, info } = await sharp(source)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const total = width * height;
const transparent = new Uint8Array(total);
const queue = [];

function whiteish(index) {
  const at = index * channels;

  return data[at] >= nearWhite && data[at + 1] >= nearWhite && data[at + 2] >= nearWhite;
}

for (let x = 0; x < width; x += 1) {
  queue.push(x, (height - 1) * width + x);
}

for (let y = 0; y < height; y += 1) {
  queue.push(y * width, y * width + width - 1);
}

while (queue.length > 0) {
  const index = queue.pop();

  if (transparent[index] || !whiteish(index)) {
    continue;
  }

  transparent[index] = 1;

  const x = index % width;
  const y = (index - x) / width;

  if (x > 0) queue.push(index - 1);
  if (x < width - 1) queue.push(index + 1);
  if (y > 0) queue.push(index - width);
  if (y < height - 1) queue.push(index + width);
}

for (let index = 0; index < total; index += 1) {
  const at = index * channels;

  if (transparent[index]) {
    data[at + 3] = 0;

    continue;
  }

  const x = index % width;
  const y = (index - x) / width;
  let vizinhos = 0;

  for (let dy = -edgeSoftness; dy <= edgeSoftness; dy += 1) {
    for (let dx = -edgeSoftness; dx <= edgeSoftness; dx += 1) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
        continue;
      }

      if (transparent[ny * width + nx]) {
        vizinhos += 1;
      }
    }
  }

  if (vizinhos > 0) {
    const area = (edgeSoftness * 2 + 1) ** 2;

    data[at + 3] = Math.max(0, Math.round(255 * (1 - vizinhos / area)));
  }
}

const png = await sharp(data, { raw: { width, height, channels } })
  .png({ compressionLevel: 9 })
  .toBuffer();

await writeFile(target, png);

const apagados = transparent.reduce((soma, valor) => soma + valor, 0);

console.log(
  `assets/gift-cutout.png — ${width}x${height} — ${(png.length / 1024 / 1024).toFixed(1)} MB — ${((apagados / total) * 100).toFixed(1)}% do fundo removido`,
);
