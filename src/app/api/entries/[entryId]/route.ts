import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { entryPatchSchema } from "@/lib/validation";
import { notFound, unauthorized, validationError } from "@/lib/api";
import { removeStoredImages } from "@/lib/images";

type Context = {
  params: Promise<{ entryId: string }>;
};

async function findOwnedEntry(entryId: string, userId: string) {
  return db.entry.findFirst({
    where: {
      id: entryId,
      project: { userId },
    },
    select: { id: true },
  });
}

export async function PATCH(
  request: Request,
  context: Context,
): Promise<NextResponse> {
  const userId = await requireUserId();

  if (!userId) {
    return unauthorized();
  }

  const { entryId } = await context.params;

  if (!(await findOwnedEntry(entryId, userId))) {
    return notFound("Entry not found.");
  }

  const body = await request.json().catch(() => null);
  const parsed = entryPatchSchema.safeParse(body);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const data = {
    ...parsed.data,
    ...(parsed.data.notes !== undefined
      ? { notes: parsed.data.notes || null }
      : {}),
  };

  const entry = await db.entry.update({
    where: { id: entryId },
    data,
    include: {
      images: {
        select: { id: true, position: true },
        orderBy: { position: "asc" },
      },
    },
  });

  return NextResponse.json({ entry });
}

export async function DELETE(
  _request: Request,
  context: Context,
): Promise<NextResponse> {
  const userId = await requireUserId();

  if (!userId) {
    return unauthorized();
  }

  const { entryId } = await context.params;

  if (!(await findOwnedEntry(entryId, userId))) {
    return notFound("Entry not found.");
  }

  const images = await db.entryImage.findMany({
    where: { entryId },
    select: { storageKey: true },
  });

  await db.entry.delete({ where: { id: entryId } });
  await removeStoredImages(images.map((image) => image.storageKey));

  return NextResponse.json({ ok: true });
}
