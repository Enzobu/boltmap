import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth";

export async function POST(): Promise<NextResponse> {
  await deleteSession();
  return NextResponse.json({ ok: true });
}
