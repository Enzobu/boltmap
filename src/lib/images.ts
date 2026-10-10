import { randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { dirname, join, sep } from "node:path";

export const MAX_ENTRY_IMAGES = 10;
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

type ImageType = {
  extension: "jpg" | "png" | "webp";
  mimeType: "image/jpeg" | "image/png" | "image/webp";
};

function storageRoot(): string {
  return process.env.NODE_ENV === "production"
    ? "/app/uploads"
    : join(process.cwd(), "volume_images");
}

function storagePath(storageKey: string): string {
  const root = storageRoot();
  const fullPath = join(root, storageKey);

  if (!fullPath.startsWith(`${root}${sep}`)) {
    throw new Error("Invalid image storage key.");
  }

  return fullPath;
}

export function detectImageType(bytes: Uint8Array): ImageType | null {
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return { extension: "jpg", mimeType: "image/jpeg" };
  }

  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return { extension: "png", mimeType: "image/png" };
  }

  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return { extension: "webp", mimeType: "image/webp" };
  }

  return null;
}

export async function validateImageFile(file: File): Promise<{
  bytes: Uint8Array;
  imageType: ImageType;
}> {
  if (file.size === 0) {
    throw new Error("Une image est vide.");
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Chaque image doit faire 10 Mo maximum.");
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const imageType = detectImageType(bytes);

  if (!imageType) {
    throw new Error("Formats acceptés : JPEG, PNG ou WebP.");
  }

  return { bytes, imageType };
}

export async function storeImage(
  entryId: string,
  bytes: Uint8Array,
  extension: ImageType["extension"],
): Promise<string> {
  const storageKey = `${entryId}/${randomUUID()}.${extension}`;
  const filePath = storagePath(storageKey);

  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, bytes);

  return storageKey;
}

export async function readStoredImage(storageKey: string): Promise<Buffer> {
  return readFile(storagePath(storageKey));
}

export async function removeStoredImages(storageKeys: readonly string[]): Promise<void> {
  await Promise.all(
    storageKeys.map(async (storageKey) => {
      try {
        await unlink(storagePath(storageKey));
      } catch (error) {
        if (
          !(error instanceof Error) ||
          !("code" in error) ||
          error.code !== "ENOENT"
        ) {
          throw error;
        }
      }
    }),
  );
}
