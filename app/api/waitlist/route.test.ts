import { describe, it, expect, vi, beforeEach } from "vitest";

const { addToWaitlist } = vi.hoisted(() => ({ addToWaitlist: vi.fn() }));
vi.mock("@/lib/waitlist", () => ({ addToWaitlist }));

import { POST } from "./route";

function req(body: unknown) {
  return new Request("http://localhost/api/waitlist", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/waitlist", () => {
  beforeEach(() => addToWaitlist.mockReset());

  it("400s on invalid email", async () => {
    const res = await POST(req({ email: "not-an-email" }));
    expect(res.status).toBe(400);
    expect(addToWaitlist).not.toHaveBeenCalled();
  });

  it("200s on valid email", async () => {
    addToWaitlist.mockResolvedValue({ ok: true });
    const res = await POST(req({ email: "ok@example.com" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(addToWaitlist).toHaveBeenCalledWith("ok@example.com");
  });

  it("500s when the lib reports failure", async () => {
    addToWaitlist.mockResolvedValue({ ok: false, error: "boom" });
    const res = await POST(req({ email: "fail@example.com" }));
    expect(res.status).toBe(500);
  });
});
