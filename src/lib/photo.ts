const maxSide = 320;
const quality = 0.82;

export const maxPhotoLength = 260_000;

export async function shrinkPhoto(file: File): Promise<string> {
  const source = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(source.width, source.height));
  const width = Math.round(source.width * scale);
  const height = Math.round(source.height * scale);
  const side = Math.min(width, height);
  const canvas = document.createElement("canvas");

  canvas.width = side;
  canvas.height = side;

  const context = canvas.getContext("2d");

  if (!context) {
    source.close();

    throw new Error("Não consegui preparar a foto neste aparelho.");
  }

  context.drawImage(
    source,
    (width - side) / 2 / scale,
    (height - side) / 2 / scale,
    side / scale,
    side / scale,
    0,
    0,
    side,
    side,
  );

  source.close();

  const data = canvas.toDataURL("image/jpeg", quality);

  if (data.length > maxPhotoLength) {
    throw new Error("Essa foto ficou pesada demais. Tente outra.");
  }

  return data;
}
