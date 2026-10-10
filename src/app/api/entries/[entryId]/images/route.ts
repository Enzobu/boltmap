import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  MAX_ENTRY_IMAGES,
  removeStoredImages,
  storeImage,
  validateImageFile,
} from "@/lib/images";
import { notFound, unauthorized } from "@/lib/api";

type Context = {
  params: Promise<{ entryId: string }>;
};

export async function POST(
  request: Request,
  context: Context,
): Promise<NextResponse> {
  const userId = await requireUserId();

  if (!userId) {
    return unauthorized();
  }

  const { entryId } = await context.params;
  const entry = await db.entry.findFirst({
    where: { id: entryId, project: { userId } },
    select: {
      id: true,
      images: {
        select: { position: true },
        orderBy: { position: "desc" },
      },
    },
  });

  if (!entry) {
    return notFound("Entry not found.");
  }

  const formData = await request.formData().catch(() => null);

  if (!formData) {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const files = formData
    .getAll("images")
    .filter((value): value is File => value instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "Aucune image reçue." }, { status: 400 });
  }

  if (entry.images.length + files.length > MAX_ENTRY_IMAGES) {
    return NextResponse.json(
      { error: `Maximum ${MAX_ENTRY_IMAGES} images par entrée.` },
      { status: 400 },
    );
  }

  let validated;

  try {
    validated = await Promise.all(files.map(validateImageFile));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Image invalide." },
      { status: 400 },
    );
  }

  const firstPosition = (entry.images[0]?.position ?? -1) + 1;
  const storedKeys: string[] = [];

  try {
    const data = [];

    for (let index = 0; index < validated.length; index += 1) {
      const { bytes, imageType } = validated[index];
      const storageKey = await storeImage(entryId, bytes, imageType.extension);
      storedKeys.push(storageKey);
      data.push({
        entryId,
        storageKey,
        mimeType: imageType.mimeType,
        size: bytes.byteLength,
        position: firstPosition + index,
      });
    }

    await db.entryImage.createMany({ data });
  } catch (error) {
    await removeStoredImages(storedKeys).catch(() => undefined);
    throw error;
  }

  const images = await db.entryImage.findMany({
    where: { entryId },
    select: { id: true, position: true },
    orderBy: { position: "asc" },
  });

  return NextResponse.json({ images }, { status: 201 });
}
