import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { unauthorized, notFound } from "@/lib/api";
import {
  MAX_DOCUMENT_FILES,
  removeDocumentFiles,
  storeDocumentFile,
  validateDocumentFile,
} from "@/lib/documents";

type Context = { params: Promise<{ documentId: string }> };

export async function POST(request: Request, context: Context): Promise<NextResponse> {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  const { documentId } = await context.params;
  const document = await db.document.findFirst({
    where: { id: documentId, project: { userId } },
    select: {
      id: true,
      files: { select: { position: true }, orderBy: { position: "desc" } },
    },
  });
  if (!document) return notFound("Document not found.");

  const formData = await request.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  const submitted = formData.getAll("files");
  if (submitted.length === 0 || submitted.some((value) => !(value instanceof File))) {
    return NextResponse.json({ error: "Aucun fichier valide reçu." }, { status: 400 });
  }
  const files = submitted as File[];
  if (document.files.length + files.length > MAX_DOCUMENT_FILES) {
    return NextResponse.json({ error: `Maximum ${MAX_DOCUMENT_FILES} fichiers par document.` }, { status: 400 });
  }
  let validated;
  try {
    validated = await Promise.all(files.map(validateDocumentFile));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Fichier invalide." }, { status: 400 });
  }

  const stored: string[] = [];
  try {
    const firstPosition = (document.files[0]?.position ?? -1) + 1;
    const data = [];
    for (let index = 0; index < validated.length; index += 1) {
      const file = validated[index];
      const storageKey = await storeDocumentFile(documentId, file.bytes, file.extension);
      stored.push(storageKey);
      data.push({
        documentId,
        storageKey,
        mimeType: file.mimeType,
        name: file.name,
        size: file.bytes.byteLength,
        position: firstPosition + index,
      });
    }
    await db.documentFile.createMany({ data });
  } catch (error) {
    await removeDocumentFiles(stored).catch(() => undefined);
    throw error;
  }
  const result = await db.documentFile.findMany({
    where: { documentId },
    select: { id: true, name: true, mimeType: true, size: true, position: true },
    orderBy: { position: "asc" },
  });
  return NextResponse.json({ files: result }, { status: 201 });
}
