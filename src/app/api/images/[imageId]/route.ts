import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { readStoredImage, removeStoredImages } from "@/lib/images";
import { notFound, unauthorized } from "@/lib/api";

type Context = {
  params: Promise<{ imageId: string }>;
};

async function findOwnedImage(imageId: string, userId: string) {
  return db.entryImage.findFirst({
    where: {
      id: imageId,
      entry: { project: { userId } },
    },
    select: {
      id: true,
      storageKey: true,
      mimeType: true,
    },
  });
}

export async function GET(
  _request: Request,
  context: Context,
): Promise<NextResponse> {
  const userId = await requireUserId();

  if (!userId) {
    return unauthorized();
  }

  const { imageId } = await context.params;
  const image = await findOwnedImage(imageId, userId);

  if (!image) {
    return notFound("Image not found.");
  }

  try {
    const data = await readStoredImage(image.storageKey);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": image.mimeType,
        "Cache-Control": "private, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return notFound("Image file not found.");
  }
}

export async function DELETE(
  _request: Request,
  context: Context,
): Promise<NextResponse> {
  const userId = await requireUserId();

  if (!userId) {
    return unauthorized();
  }

  const { imageId } = await context.params;
  const image = await findOwnedImage(imageId, userId);

  if (!image) {
    return notFound("Image not found.");
  }

  await db.entryImage.delete({ where: { id: image.id } });
  await removeStoredImages([image.storageKey]);

  return NextResponse.json({ ok: true });
}
