export type WaitlistResult = { ok: true } | { ok: false; error: string };

/**
 * Phase 1: log only. Phase 2 swap body for Supabase / Resend.
 * Keep the signature stable so callers don't change.
 */
export async function addToWaitlist(email: string): Promise<WaitlistResult> {
  console.log("[waitlist] new signup:", email);
  return { ok: true };
}
