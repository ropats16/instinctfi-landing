"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type State = "idle" | "loading" | "success" | "error";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState<string>("");

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
      className="flex w-full max-w-md flex-col items-center gap-3 sm:flex-row"
    >
      <Input
        type="email"
        required
        autoComplete="email"
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-11 rounded-full bg-white/80 text-center sm:flex-1 sm:text-left"
      />
      <Button
        type="submit"
        disabled={state === "loading"}
        className="h-11 rounded-full bg-black px-6 text-white hover:bg-black/90"
      >
        {state === "loading" ? "Joining…" : "Join the private alpha →"}
      </Button>
      {message && (
        <p
          className={`text-xs sm:absolute sm:translate-y-12 ${
            state === "error" ? "text-red-600" : "text-emerald-700"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
