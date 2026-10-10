import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { projectSchema } from "@/lib/validation";
import { notFound, unauthorized, validationError } from "@/lib/api";
import { removeStoredImages } from "@/lib/images";

type Context = {
  params: Promise<{ projectId: string }>;
};

export async function PATCH(
  request: Request,
  context: Context,
): Promise<NextResponse> {
  const userId = await requireUserId();

  if (!userId) {
    return unauthorized();
  }

  const { projectId } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = projectSchema.safeParse(body);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const result = await db.project.updateMany({
    where: { id: projectId, userId },
    data: { name: parsed.data.name },
  });

  if (result.count === 0) {
    return notFound("Project not found.");
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { entries: true } },
    },
  });

  return NextResponse.json({ project });
}

export async function DELETE(
  _request: Request,
  context: Context,
): Promise<NextResponse> {
  const userId = await requireUserId();

  if (!userId) {
    return unauthorized();
  }

  const { projectId } = await context.params;
  const project = await db.project.findFirst({
    where: { id: projectId, userId },
    select: {
      id: true,
      entries: {
        select: {
          images: { select: { storageKey: true } },
        },
      },
    },
  });

  if (!project) {
    return notFound("Project not found.");
  }

  const storageKeys = project.entries.flatMap((entry) =>
    entry.images.map((image) => image.storageKey),
  );

  await db.project.delete({ where: { id: project.id } });
  await removeStoredImages(storageKeys);

  return NextResponse.json({ ok: true });
}
