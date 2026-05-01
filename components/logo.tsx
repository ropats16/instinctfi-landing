type LogoProps = { className?: string };

export function Logo({ className }: LogoProps) {
  return <img src="/logo.gif" alt="Instinct" width={800} height={266} className={className} />;
}
