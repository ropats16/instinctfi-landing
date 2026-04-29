"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type State = "idle" | "loading" | "success" | "error";

const PLACEHOLDERS = ["nancypelosi@gmail.com", "magamyman@gmail.com"];

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState<string>("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setState("error");
        setMessage(data.error ?? "Something went wrong");
        return;
      }
      setState("success");
      setMessage("You're on the list.");
      setEmail("");
    } catch {
      setState("error");
      setMessage("Network error");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-[320px] flex-col items-stretch gap-2 md:max-w-[380px] lg:max-w-[400px] xl:max-w-[420px] xl:gap-3"
    >
      <Input
        type="email"
        required
        autoComplete="email"
        placeholder={PLACEHOLDERS[placeholderIdx]}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-9 rounded-none border-black/15 bg-white/80 text-center text-sm md:h-10 xl:h-12 xl:text-base"
      />
      <Button
        type="submit"
        disabled={state === "loading"}
        className="h-11 rounded-none bg-[#024cc7] px-6 text-sm font-medium text-white hover:bg-black/90 lg:h-12 xl:h-14 xl:text-base"
      >
        {state === "loading" ? "Joining…" : "Join the private alpha →"}
      </Button>
      {message && (
        <p
          className={`text-center text-xs ${
            state === "error" ? "text-red-600" : "text-emerald-700"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
