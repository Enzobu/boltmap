import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { credentialsSchema } from "@/lib/validation";
import { validationError } from "@/lib/api";

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json().catch(() => null);
  const parsed = credentialsSchema.safeParse(body);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const email = parsed.data.email.toLowerCase();
  const existingUser = await db.user.findUnique({ where: { email } });

  if (existingUser) {
    return NextResponse.json(
      { error: "An account already exists for this email." },
      { status: 409 },
    );
  }

  const user = await db.user.create({
    data: {
      email,
      passwordHash: await hash(parsed.data.password, 12),
    },
    select: { id: true, email: true },
  });

  await createSession({ userId: user.id, email: user.email });

  return NextResponse.json({ user }, { status: 201 });
}
