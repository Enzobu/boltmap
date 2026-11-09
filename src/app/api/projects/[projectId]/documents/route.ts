import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { unauthorized, notFound, validationError } from "@/lib/api";
import { generateDocumentCode } from "@/lib/documents";
import { documentSchema } from "@/lib/validation";

type Context = { params: Promise<{ projectId: string }> };

async function canAccess(projectId: string, userId: string): Promise<boolean> {
  return Boolean(await db.project.findFirst({
    where: { id: projectId, userId },
    select: { id: true },
  }));
}

export async function GET(_request: Request, context: Context): Promise<NextResponse> {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  const { projectId } = await context.params;
  if (!(await canAccess(projectId, userId))) return notFound("Project not found.");

  const documents = await db.document.findMany({
    where: { projectId },
    include: {
      files: {
        select: { id: true, name: true, mimeType: true, size: true, position: true },
        orderBy: { position: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ documents });
}

export async function POST(request: Request, context: Context): Promise<NextResponse> {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  const { projectId } = await context.params;
  if (!(await canAccess(projectId, userId))) return notFound("Project not found.");

  const parsed = documentSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);

  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const document = await db.document.create({
        data: {
          projectId,
          code: generateDocumentCode(),
          title: parsed.data.title,
          notes: parsed.data.notes || null,
        },
        include: {
          files: { select: { id: true, name: true, mimeType: true, size: true, position: true } },
        },
      });
      return NextResponse.json({ document }, { status: 201 });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") continue;
      throw error;
    }
  }
  return NextResponse.json({ error: "Unable to generate a free documentation code." }, { status: 409 });
}
