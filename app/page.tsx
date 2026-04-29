import { Logo } from "@/components/logo";
import { WaitlistForm } from "@/components/waitlist-form";

export default function Page() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-between px-6 py-6 lg:h-svh lg:py-4 xl:py-5 2xl:py-5">
      {/* Logo */}
      <header className="flex w-full justify-center">
        <Logo className="h-16 w-auto mix-blend-multiply lg:h-20" />
      </header>

      {/* Hero */}
      <section className="flex w-full flex-1 flex-col items-center justify-center gap-5 py-4 lg:gap-5 lg:py-2 xl:gap-6 2xl:gap-7">
        <div className="flex w-full justify-center">
          <div className="w-full max-w-[min(70vw,40vh)] lg:max-w-[min(50vw,42vh)] xl:max-w-[min(45vw,36vh)] 2xl:max-w-[min(42vw,44vh)] aspect-square">
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

        <div className="flex flex-col items-center gap-4 text-center lg:gap-5">
          <h1 className="font-display leading-[1.05] tracking-[-0.02em] text-[clamp(2rem,4.5vw,5.5rem)] lg:text-[clamp(2.75rem,5.5vw,5.5rem)]">
            Your cheatcode to
            <br />
            Internet Capital Markets.
          </h1>
          <p className="font-medium uppercase tracking-[0.18em] text-[var(--color-muted)] text-[clamp(0.625rem,0.95vw,0.9rem)] lg:text-[clamp(0.75rem,1vw,1rem)]">
            Curated tokenised stock baskets on Solana.
          </p>
        </div>

        <WaitlistForm />
      </section>

      {/* Footer */}
      <footer className="text-center text-[var(--color-muted)] text-[clamp(0.7rem,0.85vw,0.95rem)]">
        <p>Follow the smart money. © Instinct 2026</p>
      </footer>
    </main>
  );
}
