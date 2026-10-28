'use client';

import { useLanguage } from '@/context/LanguageContext';
import PixelTitle from '@/components/PixelTitle';
import Lanyard3D from '@/components/Lanyard3D';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section
      id="hero"
      aria-label="Hero"
      className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-transparent z-10"
    >
      {/* Subtle Background Mesh */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Main Display: Pixelated 'PORTAFOLIO' & Subtitle */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center">
        <div className="w-full flex items-center justify-center">
          <PixelTitle />
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 text-center">
          <p className="text-zinc-400 text-sm sm:text-base font-normal max-w-md tracking-tight">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Right Anchor: Official Three.js React Bits Lanyard */}
      <div className="absolute inset-0 z-30 pointer-events-auto">
        <Lanyard3D />
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-zinc-500 text-[11px] font-mono-code z-40">
        <span>{t.scroll}</span>
        <div className="w-1 h-5 rounded-full bg-zinc-800 flex items-start justify-center p-0.5">
          <div className="w-1 h-2 rounded-full bg-zinc-400 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
