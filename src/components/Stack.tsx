'use client';

import { useLanguage } from '@/context/LanguageContext';
import OrbitImages from '@/components/OrbitImages';

export default function Stack() {
  const { t } = useLanguage();

  return (
    <section
      id="stack"
      aria-labelledby="stack-title"
      className="relative w-full py-28 px-4 sm:px-8 border-t border-white/5 bg-transparent z-10"
    >
      <div className="max-w-7xl mx-auto grid gap-10 lg:grid-cols-12 lg:gap-12 items-center">
        
        {/* Left Column: Categories, Chips & Retro Terminal GIF */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <div className="flex items-center gap-2.5 font-mono-code text-xs text-zinc-500 uppercase tracking-[0.25em] mb-3">
              <span>{t.stackTag}</span>
            </div>
            <h2
              id="stack-title"
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight"
            >
              {t.stackTitle}
            </h2>
            <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl">
              {t.stackDesc}
            </p>
          </div>

          {/* Interactive Stack Area: Buttons Layered Over Transparent GIF */}
          <div className="relative pt-2">
            {/* Buttons on Elevated Layer (z-20) */}
            <div className="relative z-20 pointer-events-auto">
              <ul className="flex flex-wrap gap-2.5">
                <li><span className="chip chip-html5">HTML5</span></li>
                <li><span className="chip chip-css">CSS</span></li>
                <li><span className="chip chip-tailwind">Tailwind CSS</span></li>
                <li><span className="chip chip-js">JavaScript</span></li>
                <li><span className="chip chip-ts">TypeScript</span></li>
                <li><span className="chip chip-react">React</span></li>
                <li><span className="chip chip-next">Next.js</span></li>
                <li><span className="chip chip-vercel">Vercel</span></li>
                <li>
                  <a
                    href="https://github.com/Kitrex04"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="chip chip-github inline-block cursor-pointer"
                    title="Visitar mi GitHub"
                  >
                    Github
                  </a>
                </li>
                <li><span className="chip chip-figma">Figma</span></li>
                <li><span className="chip chip-seo">SEO</span></li>
                <li><span className="chip chip-wordpress">WordPress</span></li>
              </ul>
            </div>

            {/* Retro Pixel Art Transparent GIF Underneath (z-10) */}
            <div className="relative z-10 -mt-14 sm:-mt-16 max-w-sm pointer-events-none select-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://64.media.tumblr.com/1be00a24aa31832b46a7633ae4e3a46a/tumblr_n320f2gHjd1sxws2ko1_500.gif"
                alt="Retro pixel workspace"
                className="w-full h-auto select-none pointer-events-none opacity-90"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 3D Orbit */}
        <div className="lg:col-span-7 lg:sticky lg:top-28 flex flex-col items-center">
          <div className="w-full flex items-center justify-end px-2 mb-2">
            <span className="text-[11px] font-mono-code text-zinc-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1ed760] animate-pulse" />
              {t.sphereHint}
            </span>
          </div>

          <div className="relative w-full max-w-[54rem] flex items-center justify-center">
            {/* Subtle ambient depth glow behind orbit */}
            <div className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />

            <OrbitImages />
          </div>
        </div>

      </div>
    </section>
  );
}
