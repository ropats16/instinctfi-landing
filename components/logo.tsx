type LogoProps = { className?: string };

export function Logo({ className }: LogoProps) {
  return <img src="/logo.gif" alt="Instinct" className={className} />;
}
