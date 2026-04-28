import { Logo } from "@/components/logo";
import { HeroGrid } from "@/components/hero-grid";
import { WaitlistForm } from "@/components/waitlist-form";

export default function Page() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-between px-6 py-8 lg:h-svh lg:py-10">
      {/* Logo */}
      <header className="flex w-full justify-center">
        <Logo className="h-6 w-auto text-black sm:h-7" />
      </header>

      {/* Hero */}
      <section className="flex w-full flex-1 flex-col items-center justify-center gap-8 py-8">
        <div className="w-full max-w-2xl">
          <HeroGrid />
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          <h1
            className="font-display text-3xl leading-[1.1] tracking-[-0.02em] sm:text-4xl lg:text-5xl"
          >
            Your cheatcode to
            <br />
            Internet Capital Markets.
          </h1>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)] sm:text-xs">
            Curated tokenised stock baskets on Solana.
          </p>
        </div>

        <WaitlistForm />
      </section>

      {/* Footer */}
      <footer className="flex flex-col items-center text-center text-xs text-[var(--color-muted)]">
        <p>Follow the smart money.</p>
        <p>Built on Solana.</p>
      </footer>
    </main>
  );
}
