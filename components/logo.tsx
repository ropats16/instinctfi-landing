"use client";

import { useEffect, useState } from "react";

type LogoProps = { className?: string };

const FRAMES = [
  "/logo/Instinct-Logo-Op6_1.gif",
  "/logo/Instinct-Logo-Op1_1.gif",
  "/logo/Instinct-Logo-Op2_1.gif",
  "/logo/Instinct-Logo-Op3_1.gif",
  "/logo/Instinct-Logo-Op4_1.gif",
  "/logo/Instinct-Logo-Op5_1.gif",
];

const FRAME_MS = 1000;

export function Logo({ className }: LogoProps) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    FRAMES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % FRAMES.length);
    }, FRAME_MS);
    return () => clearInterval(id);
  }, []);

  return <img src={FRAMES[idx]} alt="Instinct" className={className} />;
}
