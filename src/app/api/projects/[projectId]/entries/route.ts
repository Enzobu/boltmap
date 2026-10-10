import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateFourDigitCode } from "@/lib/codes";
import { entrySchema } from "@/lib/validation";
import { notFound, unauthorized, validationError } from "@/lib/api";

type Context = {
  params: Promise<{ projectId: string }>;
};

async function canAccessProject(projectId: string, userId: string): Promise<boolean> {
  const project = await db.project.findFirst({
    where: { id: projectId, userId },
    select: { id: true },
  });

  return Boolean(project);
}

export async function GET(
  _request: Request,
  context: Context,
): Promise<NextResponse> {
  const userId = await requireUserId();

  if (!userId) {
    return unauthorized();
  }

  const { projectId } = await context.params;

  if (!(await canAccessProject(projectId, userId))) {
    return notFound("Project not found.");
  }

  const entries = await db.entry.findMany({
    where: { projectId },
    include: {
      images: {
        select: { id: true, position: true },
        orderBy: { position: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ entries });
}

export async function POST(
  request: Request,
  context: Context,
): Promise<NextResponse> {
  const userId = await requireUserId();

  if (!userId) {
    return unauthorized();
  }

  const { projectId } = await context.params;

  if (!(await canAccessProject(projectId, userId))) {
    return notFound("Project not found.");
  }

  const body = await request.json().catch(() => null);
  const parsed = entrySchema.safeParse(body);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const entry = await db.entry.create({
        data: {
          projectId,
          code: generateFourDigitCode(),
          name: parsed.data.name,
          quantity: parsed.data.quantity,
          notes: parsed.data.notes || null,
        },
        include: {
          images: {
            select: { id: true, position: true },
            orderBy: { position: "asc" },
          },
        },
      });

      return NextResponse.json({ entry }, { status: 201 });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        continue;
      }

      throw error;
    }
  }

  return NextResponse.json(
    { error: "Unable to allocate a free code. Please try again." },
    { status: 409 },
  );
}
