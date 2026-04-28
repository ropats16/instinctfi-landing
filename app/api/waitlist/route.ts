import { NextResponse } from "next/server";
import { z } from "zod";
import { addToWaitlist } from "../../../lib/waitlist";

const Body = z.object({ email: z.email() });

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }

  const result = await addToWaitlist(parsed.data.email);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
