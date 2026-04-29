import { Logo } from "@/components/logo";
import { WaitlistForm } from "@/components/waitlist-form";

export default function Page() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-between px-6 py-8 lg:h-svh lg:py-10">
      {/* Logo */}
      <header className="flex w-full justify-center">
        <Logo className="h-6 w-auto text-black sm:h-7 lg:h-8 xl:h-9 2xl:h-10" />
      </header>

      {/* Hero */}
      <section className="flex w-full flex-1 flex-col items-center justify-center gap-10 py-8 2xl:gap-14">
        <div className="flex w-full justify-center">
          <div className="w-full max-w-[min(80vw,55vh)] lg:max-w-[min(35vw,35vh)] aspect-square">
            <video
              src="/visualiser-loop-sq.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="size-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 text-center 2xl:gap-7">
          <h1 className="font-display leading-[1.05] tracking-[-0.02em] text-[clamp(2rem,4.5vw,5.5rem)]">
            Your cheatcode to
            <br />
            Internet Capital Markets.
          </h1>
          <p className="font-medium uppercase tracking-[0.18em] text-[var(--color-muted)] text-[clamp(0.625rem,0.95vw,0.9rem)]">
            Curated tokenised stock baskets on Solana.
          </p>
        </div>

        <WaitlistForm />
      </section>

      {/* Footer */}
      <footer className="text-center text-[var(--color-muted)] text-[clamp(0.7rem,0.85vw,0.95rem)]">
        <p>Follow the smart money. Built on Solana.</p>
      </footer>
    </main>
  );
}
