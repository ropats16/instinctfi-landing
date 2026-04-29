import { describe, it, expect, vi, beforeEach } from "vitest";
import { addToWaitlist } from "./waitlist";

const { mockCreate } = vi.hoisted(() => ({ mockCreate: vi.fn() }));
vi.mock("resend", () => ({
  Resend: class {
    contacts = { create: mockCreate };
  },
}));

describe("addToWaitlist", () => {
  beforeEach(() => {
    mockCreate.mockReset();
    process.env.RESEND_API_KEY = "test-key";
    process.env.RESEND_WAITLIST_SEGMENT_ID = "test-segment";
  });

  it("creates a contact in the configured segment", async () => {
    mockCreate.mockResolvedValue({ data: { id: "c1" }, error: null });
    const result = await addToWaitlist("test@example.com");
    expect(result).toEqual({ ok: true });
    expect(mockCreate).toHaveBeenCalledWith({
      email: "test@example.com",
      segments: [{ id: "test-segment" }],
    });
  });

  it("treats duplicate-email errors as success", async () => {
    mockCreate.mockResolvedValue({
      data: null,
      error: { message: "Contact already exists", name: "validation_error", statusCode: 400 },
    });
    const result = await addToWaitlist("dup@example.com");
    expect(result).toEqual({ ok: true });
  });

  it("returns error on other Resend failures", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    mockCreate.mockResolvedValue({
      data: null,
      error: { message: "rate limited", name: "rate_limit_exceeded", statusCode: 429 },
    });
    const result = await addToWaitlist("rl@example.com");
    expect(result.ok).toBe(false);
    err.mockRestore();
  });

  it("returns error when env vars are missing", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    delete process.env.RESEND_API_KEY;
    const result = await addToWaitlist("x@example.com");
    expect(result.ok).toBe(false);
    expect(mockCreate).not.toHaveBeenCalled();
    err.mockRestore();
  });
});
