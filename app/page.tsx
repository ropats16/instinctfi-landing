import { Logo } from "@/components/logo";
import { WaitlistForm } from "@/components/waitlist-form";

export default function Page() {
  return (
    <main className="relative flex h-svh flex-col items-center justify-between px-6 py-6 md:py-8 lg:py-5 xl:py-6">
      {/* Logo */}
      <header className="flex w-full justify-center">
        <Logo className="h-16 w-auto mix-blend-multiply md:h-18 lg:h-20 xl:h-24" />
      </header>

      {/* Hero */}
      <section className="flex w-full flex-1 flex-col items-center justify-center gap-6 py-4 md:gap-7 lg:gap-6 lg:py-2 xl:gap-8 xl:py-3">
        <div className="flex w-full justify-center">
          <div className="w-full max-w-[min(70vw,40vh)] md:max-w-[min(60vw,42vh)] lg:max-w-[min(50vw,38vh)] xl:max-w-[min(42vw,42vh)] aspect-square">
            <video
              src="/visualiser-loop-sq-white.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="size-full object-cover mix-blend-multiply"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 md:gap-6 lg:gap-5 xl:gap-7">
          <div className="flex flex-col items-center gap-4 text-center md:gap-5 xl:gap-6">
            <h1 className="font-display leading-[1.05] tracking-[-0.02em] text-[clamp(2rem,5vw,3.5rem)]">
              Your cheatcode to
              <br />
              Internet Capital Markets.
            </h1>
            <p className="font-medium uppercase tracking-[0.18em] text-[var(--color-muted)] text-[clamp(0.7rem,0.95vw,0.85rem)]">
              Curated tokenised stock baskets on Solana.
            </p>
          </div>

          <WaitlistForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-[var(--color-muted)] text-[clamp(0.75rem,0.9vw,0.95rem)]">
        <p>Follow the smart money. © Instinct 2026</p>
      </footer>
    </main>
  );
}
