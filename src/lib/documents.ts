import { randomInt, randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { dirname, join, sep } from "node:path";
import { detectImageType } from "@/lib/images";

export const MAX_DOCUMENT_FILES = 10;
export const MAX_DOCUMENT_FILE_BYTES = 15 * 1024 * 1024;

export function generateDocumentCode(): string {
  return Array.from({ length: 3 }, () => String.fromCharCode(65 + randomInt(26))).join("");
}

export function isDocumentCode(value: string): boolean {
  return /^[A-Z]{3}$/.test(value);
}

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"] as const;
type FileType = (typeof allowedTypes)[number];

export async function validateDocumentFile(file: File): Promise<{
  bytes: Uint8Array;
  mimeType: FileType;
  extension: string;
  name: string;
}> {
  if (file.size === 0 || file.size > MAX_DOCUMENT_FILE_BYTES) {
    throw new Error("Chaque fichier doit faire entre 1 octet et 15 Mo.");
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const image = detectImageType(bytes);
  const pdf = bytes.length >= 5 && bytes[0] === 0x25 && bytes[1] === 0x50 &&
    bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2d;
  if (!image && !pdf) {
    throw new Error("Formats acceptés : PDF, JPEG, PNG ou WebP.");
  }
  const mimeType: FileType = image?.mimeType ?? "application/pdf";
  const extension = image?.extension ?? "pdf";
  const name = file.name.trim().slice(0, 255) || `document.${extension}`;
  return { bytes, mimeType, extension, name };
}

function storageRoot(): string {
  return process.env.NODE_ENV === "production"
    ? "/app/uploads"
    : join(process.cwd(), "volume_images");
}

function storagePath(key: string): string {
  const root = storageRoot();
  const full = join(root, key);
  if (!full.startsWith(`${root}${sep}`)) throw new Error("Invalid document key.");
  return full;
}

export async function storeDocumentFile(documentId: string, bytes: Uint8Array, extension: string): Promise<string> {
  const key = `documents/${documentId}/${randomUUID()}.${extension}`;
  const full = storagePath(key);
  await mkdir(dirname(full), { recursive: true });
  await writeFile(full, bytes);
  return key;
}

export function readDocumentFile(key: string): Promise<Buffer> {
  return readFile(storagePath(key));
}

export async function removeDocumentFiles(keys: readonly string[]): Promise<void> {
  await Promise.all(keys.map(async (key) => {
    try {
      await unlink(storagePath(key));
    } catch (error) {
      if (!(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") throw error;
    }
  }));
}
