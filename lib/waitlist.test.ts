import { describe, it, expect, vi } from "vitest";
import { addToWaitlist } from "./waitlist";

describe("addToWaitlist", () => {
  it("returns ok for a valid email", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const result = await addToWaitlist("test@example.com");
    expect(result).toEqual({ ok: true });
    expect(log).toHaveBeenCalled();
    log.mockRestore();
  });
});
