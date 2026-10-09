import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { projectSchema } from "@/lib/validation";
import { unauthorized, validationError } from "@/lib/api";

export async function GET(): Promise<NextResponse> {
  const userId = await requireUserId();

  if (!userId) {
    return unauthorized();
  }

  const projects = await db.project.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { entries: true } },
    },
  });

  return NextResponse.json({ projects });
}

export async function POST(request: Request): Promise<NextResponse> {
  const userId = await requireUserId();

  if (!userId) {
    return unauthorized();
  }

  const body = await request.json().catch(() => null);
  const parsed = projectSchema.safeParse(body);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const project = await db.project.create({
    data: {
      name: parsed.data.name,
      userId,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { entries: true } },
    },
  });

  return NextResponse.json({ project }, { status: 201 });
}
