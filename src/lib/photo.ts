export const outputSide = 320;
export const quality = 0.85;
export const maxPhotoLength = 260_000;

export interface LoadedPhoto {
  image: HTMLImageElement;
  url: string;
  width: number;
  height: number;
}

export async function loadPhoto(file: File): Promise<LoadedPhoto> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Esse arquivo não parece uma foto.");
  }

  const url = URL.createObjectURL(file);
  const image = new Image();

  image.decoding = "async";
  image.src = url;

  try {
    if (typeof image.decode === "function") {
      await image.decode();
    } else {
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("falha ao abrir"));
      });
    }
  } catch {
    URL.revokeObjectURL(url);

    throw new Error("Não consegui abrir essa foto. Tente outra.");
  }

  const width = image.naturalWidth;
  const height = image.naturalHeight;

  if (width === 0 || height === 0) {
    URL.revokeObjectURL(url);

    throw new Error("Essa foto veio vazia. Tente outra.");
  }

  return { image, url, width, height };
}

export interface CropArea {
  x: number;
  y: number;
  side: number;
}

export function cropToDataUrl(image: HTMLImageElement, area: CropArea): string {
  const canvas = document.createElement("canvas");

  canvas.width = outputSide;
  canvas.height = outputSide;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Não consegui preparar a foto neste aparelho.");
  }

  context.fillStyle = "#fffdf8";
  context.fillRect(0, 0, outputSide, outputSide);
  context.drawImage(
    image,
    area.x,
    area.y,
    area.side,
    area.side,
    0,
    0,
    outputSide,
    outputSide,
  );

  const data = canvas.toDataURL("image/jpeg", quality);

  if (data.length < 1000) {
    throw new Error("A foto saiu em branco. Tente outra.");
  }

  if (data.length > maxPhotoLength) {
    return canvas.toDataURL("image/jpeg", 0.7);
  }

  return data;
}
