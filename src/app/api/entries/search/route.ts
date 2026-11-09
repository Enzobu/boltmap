import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { unauthorized } from "@/lib/api";

export async function GET(request: Request): Promise<NextResponse> {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (!query) return NextResponse.json({ results: [] });
  if (query.length > 180) {
    return NextResponse.json({ error: "Search is too long." }, { status: 400 });
  }

  const entries = await db.entry.findMany({
    where: {
      project: { userId },
      OR: [
        { code: { contains: query } },
        { name: { contains: query } },
      ],
    },
    include: {
      project: { select: { id: true, name: true } },
      images: {
        select: { id: true, position: true },
        orderBy: { position: "asc" },
      },
    },
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    take: 100,
  });

  return NextResponse.json({
    results: entries.map(({ project, ...entry }) => ({
      entry,
      project: { id: project.id, name: project.name },
    })),
  });
}
