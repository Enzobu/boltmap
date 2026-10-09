import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export function unauthorized(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function notFound(message = "Not found"): NextResponse {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { error: error.issues[0]?.message ?? "Invalid request" },
    { status: 400 },
  );
}
