import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { unauthorized, notFound, validationError } from "@/lib/api";
import { documentPatchSchema } from "@/lib/validation";
import { removeDocumentFiles } from "@/lib/documents";

type Context = { params: Promise<{ documentId: string }> };

async function owned(documentId: string, userId: string) {
  return db.document.findFirst({
    where: { id: documentId, project: { userId } },
    select: { id: true },
  });
}

export async function PATCH(request: Request, context: Context): Promise<NextResponse> {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  const { documentId } = await context.params;
  if (!(await owned(documentId, userId))) return notFound("Document not found.");

  const parsed = documentPatchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);

  const document = await db.document.update({
    where: { id: documentId },
    data: {
      ...parsed.data,
      ...(parsed.data.notes !== undefined ? { notes: parsed.data.notes || null } : {}),
    },
    include: { files: { select: { id: true, name: true, mimeType: true, size: true, position: true }, orderBy: { position: "asc" } } },
  });
  return NextResponse.json({ document });
}

export async function DELETE(_request: Request, context: Context): Promise<NextResponse> {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  const { documentId } = await context.params;
  if (!(await owned(documentId, userId))) return notFound("Document not found.");

  const files = await db.documentFile.findMany({
    where: { documentId },
    select: { storageKey: true },
  });
  await db.document.delete({ where: { id: documentId } });
  await removeDocumentFiles(files.map((file) => file.storageKey));
  return NextResponse.json({ ok: true });
}
