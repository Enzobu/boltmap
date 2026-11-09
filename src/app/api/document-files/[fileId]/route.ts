import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { unauthorized, notFound } from "@/lib/api";
import { readDocumentFile, removeDocumentFiles } from "@/lib/documents";

type Context = { params: Promise<{ fileId: string }> };

async function ownedFile(fileId: string, userId: string) {
  return db.documentFile.findFirst({
    where: { id: fileId, document: { project: { userId } } },
    select: { id: true, storageKey: true, mimeType: true, name: true },
  });
}

export async function GET(_request: Request, context: Context): Promise<NextResponse> {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  const { fileId } = await context.params;
  const file = await ownedFile(fileId, userId);
  if (!file) return notFound("File not found.");
  try {
    const data = await readDocumentFile(file.storageKey);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": file.mimeType,
        "Content-Disposition": "inline",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      },
    });
  } catch {
    return notFound("File unavailable.");
  }
}

export async function DELETE(_request: Request, context: Context): Promise<NextResponse> {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  const { fileId } = await context.params;
  const file = await ownedFile(fileId, userId);
  if (!file) return notFound("File not found.");
  await db.documentFile.delete({ where: { id: file.id } });
  await removeDocumentFiles([file.storageKey]);
  return NextResponse.json({ ok: true });
}
