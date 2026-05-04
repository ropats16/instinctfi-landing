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
      className="flex w-full flex-col items-stretch gap-2 max-w-md"
    >
      <Input
        type="email"
        required
        autoComplete="email"
        placeholder={PLACEHOLDERS[placeholderIdx]}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button
        type="submit"
        disabled={state === "loading"}
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
