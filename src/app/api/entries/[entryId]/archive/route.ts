import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound, unauthorized } from "@/lib/api";

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

const entryInclude = {
  images: {
    select: { id: true, position: true },
    orderBy: { position: "asc" as const },
  },
};

export async function POST(
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

  const entry = await db.entry.update({
    where: { id: entryId },
    data: { archivedAt: new Date() },
    include: entryInclude,
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

  const entry = await db.entry.update({
    where: { id: entryId },
    data: { archivedAt: null },
    include: entryInclude,
  });

  return NextResponse.json({ entry });
}
