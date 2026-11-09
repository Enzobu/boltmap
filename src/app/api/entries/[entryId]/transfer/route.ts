import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound, unauthorized, validationError } from "@/lib/api";
import { transferEntrySchema } from "@/lib/validation";

type Context = { params: Promise<{ entryId: string }> };

export async function POST(request: Request, context: Context): Promise<NextResponse> {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const { entryId } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = transferEntrySchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  // Check source ownership and destination ownership on the server.
  // The conditional update also prevents a concurrent transfer from moving a stale entry.
  const [source, destination] = await Promise.all([
    db.entry.findFirst({
      where: { id: entryId, project: { userId } },
      select: { id: true, projectId: true },
    }),
    db.project.findFirst({
      where: { id: parsed.data.projectId, userId },
      select: { id: true },
    }),
  ]);

  if (!source) return notFound("Entry not found.");
  if (!destination) return notFound("Destination project not found.");

  if (source.projectId === destination.id) {
    return NextResponse.json({ error: "Choose another project." }, { status: 409 });
  }

  const result = await db.entry.updateMany({
    where: { id: entryId, projectId: source.projectId },
    data: { projectId: destination.id },
  });

  if (result.count !== 1) {
    return NextResponse.json({ error: "Entry was moved. Refresh and try again." }, { status: 409 });
  }

  const entry = await db.entry.findUniqueOrThrow({
    where: { id: entryId },
    include: { images: { select: { id: true, position: true }, orderBy: { position: "asc" } } },
  });

  return NextResponse.json({ entry });
}
