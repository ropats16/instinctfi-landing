import { Logo } from "@/components/logo";
import { WaitlistForm } from "@/components/waitlist-form";

export default function Page() {
  return (
    <main className="relative flex flex-col h-screen">
      {/* Logo */}
      <header className="flex w-full justify-center">
        <Logo className="w-auto mix-blend-multiply max-w-[250px]" />
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col w-full items-center justify-center h-full py-6 px-4">
        <div className="flex flex-col items-center w-full max-w-xl md:max-w-2xl lg:max-w-3xl justify-between gap-6">
          <video
            src="/video.mp4"
            autoPlay
            loop
            muted
            playsInline
            width={720}
            height={720}
            className="aspect-square object-cover mix-blend-multiply max-w-md w-full"
          />
          <div className="flex flex-col gap-2">
            <h1 className="font-display leading-[1.05] tracking-[-0.02em] text-center text-[clamp(2rem,5vw,3.5rem)]">
              Your cheatcode to
              <br />
              Internet Capital Markets.
            </h1>
            <p className="font-medium uppercase tracking-[0.18em] text-center text-[var(--color-muted)] text-[clamp(0.7rem,0.95vw,0.85rem)]">
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
