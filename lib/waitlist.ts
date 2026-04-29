import { Resend } from "resend";

export type WaitlistResult = { ok: true } | { ok: false; error: string };

export async function addToWaitlist(email: string): Promise<WaitlistResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_WAITLIST_SEGMENT_ID;
  if (!apiKey || !segmentId) {
    console.error(
      "[waitlist] missing RESEND_API_KEY or RESEND_WAITLIST_SEGMENT_ID",
    );
    return { ok: false, error: "Waitlist is misconfigured" };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.contacts.create({
    email,
    segments: [{ id: segmentId }],
  });

  if (error) {
    // Treat duplicates as success — better UX than surfacing a confusing error on retry.
    if (/already/i.test(error.message ?? "")) {
      return { ok: true };
    }
    console.error("[waitlist] Resend error:", error);
    return { ok: false, error: "Something went wrong" };
  }

  return { ok: true };
}
