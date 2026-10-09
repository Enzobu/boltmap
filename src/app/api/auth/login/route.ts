import { compare } from "bcryptjs";
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
  const user = await db.user.findUnique({ where: { email } });

  if (!user || !(await compare(parsed.data.password, user.passwordHash))) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  await createSession({ userId: user.id, email: user.email });

  return NextResponse.json({
    user: { id: user.id, email: user.email },
  });
}
