'use client';

import { useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { featuredProject } from '@/data/projects';

export default function Projects() {
  const { t } = useLanguage();
  const cardRef = useRef<HTMLElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      boundsRef.current = cardRef.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card) return;
    if (!boundsRef.current) {
      boundsRef.current = card.getBoundingClientRect();
    }
    const bounds = boundsRef.current;
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);

    const xPct = x / bounds.width - 0.5;
    const yPct = y / bounds.height - 0.5;
    const rotateX = -yPct * 8;
    const rotateY = xPct * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <section
      id="proyectos"
      aria-labelledby="proyectos-title"
      className="relative w-full py-28 px-4 sm:px-8 border-t border-white/5 bg-transparent z-10"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 font-mono-code text-xs text-zinc-500 uppercase tracking-[0.25em] mb-3">
              <span>{t.projectsTag}</span>
            </div>
            <h2
              id="proyectos-title"
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight"
            >
              {t.projectsTitle}
            </h2>
            <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl">
              {t.projectsDesc}
            </p>
          </div>

          {/* Status Indicator Pill */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-zinc-950/70 backdrop-blur-md self-start md:self-auto font-mono-code text-xs text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-[#1ed760] animate-pulse" />
            <span>En Producción • Vercel Live</span>
          </div>
        </div>

        {/* React Bits Single Featured Project Container (Compact & Refined max-w-xl) */}
        <div id="projectsGrid" className="max-w-xl mx-auto w-full">
          <div className="rb-card-item w-full">
            <div className="rb-card-wrapper group relative h-full">
              {/* React Bits Tilted & Spotlight Card */}
              <article
                ref={cardRef}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="rb-tilted-card relative h-full flex flex-col rounded-2xl bg-zinc-950/70 border border-white/10 overflow-hidden backdrop-blur-xl transition-all duration-300 group-hover:border-white/20"
              >
                {/* React Bits Spotlight Surface Overlay */}
                <div
                  className="rb-spotlight-surface pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      'radial-gradient(550px circle at var(--x, 50%) var(--y, 50%), rgba(255, 255, 255, 0.06), transparent 60%)',
                  }}
                />

                {/* React Bits Spotlight Border Shine Overlay */}
                <div
                  className="rb-spotlight-border pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      'radial-gradient(350px circle at var(--x, 50%) var(--y, 50%), rgba(255, 255, 255, 0.28), transparent 60%)',
                    WebkitMask:
                      'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    padding: '1px',
                  }}
                />

                {/* React Bits Subtle Glare Layer */}
                <div className="rb-glare pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Mockup Window Banner */}
                <div className="relative w-full aspect-[16/9.5] overflow-hidden bg-zinc-900/90 border-b border-white/5 select-none">
                  {/* Window Title Bar */}
                  <div className="absolute top-0 inset-x-0 h-8 sm:h-9 px-3 sm:px-4 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md border-b border-white/5 z-10">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-zinc-700/80 group-hover:bg-[#ff5f56] transition-colors" />
                      <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-zinc-700/80 group-hover:bg-[#ffbd2e] transition-colors" />
                      <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-zinc-700/80 group-hover:bg-[#27c93f] transition-colors" />
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900/90 border border-white/5 text-[10px] sm:text-[11px] font-mono-code text-zinc-400">
                      <span className="text-zinc-600">https://</span>
                      <span className="text-zinc-300">seo-lexpin-aljndroperez...vercel.app</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono-code text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Vercel Live</span>
                    </div>
                  </div>

                  {/* SVG Mockup Graphic */}
                  <div className="pt-8 sm:pt-9 w-full h-full flex items-center justify-center">
                    <svg
                      className="w-full h-full object-cover"
                      viewBox="0 0 600 320"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="600" height="320" fill="#000000" />
                      
                      {/* Left Sidebar (Mini Spotify Nav) */}
                      <rect x="0" y="0" width="130" height="268" fill="#121212" />
                      <circle cx="28" cy="24" r="10" fill="#1ed760" />
                      <path d="M23 21 C 26 19.5, 30 20, 33 22" stroke="#000" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M24 24 C 27 22.8, 29.5 23.2, 32 25" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M25 27 C 27 26, 29 26.5, 31 27.5" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
                      <text x="44" y="28" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Spotify</text>

                      {/* Sidebar Library Items */}
                      <rect x="14" y="52" width="102" height="26" rx="6" fill="#242424" />
                      <circle cx="28" cy="65" r="4" fill="#a7a7a7" />
                      <text x="38" y="68" fill="#ffffff" fontSize="9" fontWeight="600" fontFamily="sans-serif">Tu biblioteca</text>

                      {/* Mini Playlists in Sidebar */}
                      <rect x="14" y="90" width="20" height="20" rx="4" fill="url(#sp-grad-heart)" />
                      <text x="40" y="100" fill="#ffffff" fontSize="8.5" fontWeight="600">Tus me gusta</text>
                      <text x="40" y="108" fill="#71717a" fontSize="7">142 canciones</text>

                      <rect x="14" y="118" width="20" height="20" rx="4" fill="#27272a" />
                      <text x="40" y="128" fill="#e4e4e7" fontSize="8.5">Éxitos España</text>
                      <text x="40" y="136" fill="#71717a" fontSize="7">Playlist • Spotify</text>

                      <rect x="14" y="146" width="20" height="20" rx="4" fill="#3f3f46" />
                      <text x="40" y="156" fill="#e4e4e7" fontSize="8.5">Rock Classics</text>
                      <text x="40" y="164" fill="#71717a" fontSize="7">Playlist • 80s</text>

                      <rect x="14" y="174" width="20" height="20" rx="4" fill="#18181b" />
                      <text x="40" y="184" fill="#e4e4e7" fontSize="8.5">Lofi Chill Beats</text>
                      <text x="40" y="192" fill="#71717a" fontSize="7">Playlist • Lofi Girl</text>

                      {/* Center Main Player Content */}
                      <rect x="136" y="0" width="318" height="268" rx="6" fill="#121212" />

                      {/* Category Filter Pills */}
                      <rect x="150" y="14" width="42" height="18" rx="9" fill="#ffffff" />
                      <text x="171" y="26" textAnchor="middle" fill="#000000" fontSize="8" fontWeight="bold">Todos</text>
                      <rect x="198" y="14" width="46" height="18" rx="9" fill="#242424" />
                      <text x="221" y="26" textAnchor="middle" fill="#ffffff" fontSize="8">Música</text>
                      <rect x="250" y="14" width="52" height="18" rx="9" fill="#242424" />
                      <text x="276" y="26" textAnchor="middle" fill="#ffffff" fontSize="8">Podcasts</text>

                      {/* Section Title */}
                      <text x="150" y="56" fill="#ffffff" fontSize="14" fontWeight="bold">Buenas tardes</text>

                      {/* Quick Access Cards */}
                      <rect x="150" y="68" width="144" height="34" rx="4" fill="#242424" />
                      <rect x="150" y="68" width="34" height="34" rx="4" fill="#d97706" />
                      <circle cx="167" cy="85" r="7" fill="#b45309" />
                      <text x="190" y="88" fill="#ffffff" fontSize="9" fontWeight="bold">Éxitos de hoy</text>

                      <rect x="300" y="68" width="144" height="34" rx="4" fill="#242424" />
                      <rect x="300" y="68" width="34" height="34" rx="4" fill="#4338ca" />
                      <text x="340" y="88" fill="#ffffff" fontSize="9" fontWeight="bold">Tus me gusta</text>

                      {/* Hecho para ti cards */}
                      <text x="150" y="124" fill="#ffffff" fontSize="12" fontWeight="bold">Hecho para ti</text>

                      {/* Card 1 */}
                      <rect x="150" y="136" width="90" height="118" rx="6" fill="#18181b" />
                      <rect x="157" y="143" width="76" height="70" rx="4" fill="#1e1e24" />
                      <circle cx="195" cy="178" r="24" fill="#e11d48" />
                      <circle cx="195" cy="178" r="8" fill="#18181b" />
                      <circle cx="218" cy="202" r="10" fill="#1ed760" />
                      <polygon points="216,198 222,202 216,206" fill="#000000" />
                      <text x="157" y="226" fill="#ffffff" fontSize="8" fontWeight="bold">Daily Mix 1</text>
                      <text x="157" y="238" fill="#71717a" fontSize="7">Bad Bunny, Rauw</text>

                      {/* Card 2 */}
                      <rect x="248" y="136" width="90" height="118" rx="6" fill="#18181b" />
                      <rect x="255" y="143" width="76" height="70" rx="4" fill="#0f172a" />
                      <circle cx="293" cy="178" r="24" fill="#0284c7" />
                      <circle cx="293" cy="178" r="8" fill="#18181b" />
                      <text x="255" y="226" fill="#ffffff" fontSize="8" fontWeight="bold">Top Global</text>
                      <text x="255" y="238" fill="#71717a" fontSize="7">Lo más escuchado</text>

                      {/* Card 3 */}
                      <rect x="346" y="136" width="98" height="118" rx="6" fill="#18181b" />
                      <rect x="353" y="143" width="76" height="70" rx="4" fill="#27272a" />
                      <circle cx="391" cy="178" r="24" fill="#ea580c" />
                      <circle cx="391" cy="178" r="8" fill="#18181b" />
                      <text x="353" y="226" fill="#ffffff" fontSize="8" fontWeight="bold">Rock en Español</text>
                      <text x="353" y="238" fill="#71717a" fontSize="7">Clásicos del rock</text>

                      {/* Right Sidebar: Now Playing */}
                      <rect x="460" y="0" width="140" height="268" rx="6" fill="#121212" />
                      <text x="472" y="24" fill="#ffffff" fontSize="10" fontWeight="bold">En reproducción</text>
                      <rect x="472" y="38" width="116" height="116" rx="6" fill="#18181b" />
                      <circle cx="530" cy="96" r="46" fill="#09090b" stroke="#27272a" strokeWidth="1.5" />
                      <circle cx="530" cy="96" r="32" fill="none" stroke="#27272a" strokeWidth="0.8" />
                      <circle cx="530" cy="96" r="16" fill="#ea580c" />
                      <circle cx="530" cy="96" r="4" fill="#000000" />

                      <text x="472" y="172" fill="#ffffff" fontSize="10" fontWeight="bold">Blinding Lights</text>
                      <text x="472" y="184" fill="#a1a1aa" fontSize="8">The Weeknd</text>
                      <rect x="472" y="196" width="116" height="60" rx="4" fill="#18181b" />
                      <text x="480" y="210" fill="#a1a1aa" fontSize="7.5" fontWeight="600">ACERCA DEL ARTISTA</text>
                      <circle cx="490" cy="228" r="10" fill="#3f3f46" />
                      <text x="506" y="226" fill="#ffffff" fontSize="8" fontWeight="bold">The Weeknd</text>
                      <text x="506" y="236" fill="#1ed760" fontSize="7">108M oyentes</text>

                      {/* Bottom Player Bar */}
                      <rect x="0" y="268" width="600" height="52" fill="#000000" stroke="#27272a" strokeWidth="1" />
                      <rect x="14" y="276" width="34" height="34" rx="4" fill="#ea580c" />
                      <text x="56" y="291" fill="#ffffff" fontSize="9" fontWeight="600">Blinding Lights</text>
                      <text x="56" y="303" fill="#a1a1aa" fontSize="7.5">The Weeknd</text>
                      <path d="M 124 292 C 124 288, 127 286, 129.5 288 C 132 286, 135 288, 135 292 C 135 296, 129.5 299, 129.5 299 C 129.5 299, 124 296, 124 292 Z" fill="#1ed760" />

                      {/* Controls Center */}
                      <polygon points="266,288 274,283 274,293" fill="#a1a1aa" />
                      <rect x="264" y="283" width="2" height="10" fill="#a1a1aa" />
                      <circle cx="295" cy="288" r="11" fill="#ffffff" />
                      <polygon points="292,283 300,288 292,293" fill="#000000" />
                      <polygon points="324,288 316,283 316,293" fill="#a1a1aa" />
                      <rect x="324" y="283" width="2" height="10" fill="#a1a1aa" />

                      {/* Progress Bar with Spotify Green */}
                      <text x="210" y="308" fill="#71717a" fontSize="7">0:45</text>
                      <rect x="230" y="305" width="130" height="3" rx="1.5" fill="#3f3f46" />
                      <rect x="230" y="305" width="45" height="3" rx="1.5" fill="#1ed760" />
                      <circle cx="275" cy="306.5" r="3" fill="#ffffff" />
                      <text x="365" y="308" fill="#71717a" fontSize="7">3:20</text>

                      {/* Right Volume Slider */}
                      <circle cx="520" cy="292" r="3" fill="#a1a1aa" />
                      <rect x="532" y="291" width="45" height="3" rx="1.5" fill="#3f3f46" />
                      <rect x="532" y="291" width="30" height="3" rx="1.5" fill="#ffffff" />

                      <defs>
                        <linearGradient id="sp-grad-heart" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#450af5" />
                          <stop offset="100%" stopColor="#8e8ee5" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="relative z-10 p-5 sm:p-6 flex flex-col flex-1 justify-between gap-5">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono-code text-[11px] text-zinc-500 uppercase tracking-wider">
                        {featuredProject.category}
                      </span>
                      <span className="text-[10px] font-mono-code text-zinc-400 px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
                        {featuredProject.badge}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-[#eae6dc] transition-colors flex items-center gap-2">
                      {featuredProject.title}
                    </h3>

                    <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                      {t.spotifyDesc || featuredProject.description}
                    </p>
                  </div>

                  {/* Tech Chips & Actions */}
                  <div className="space-y-4 pt-1">
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {featuredProject.tags.map(tag => (
                        <span key={tag.name} className={`${tag.class} text-[11px] py-0.5 px-2.5`}>
                          {tag.name}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <div className="flex items-center gap-2.5">
                        <a
                          href={featuredProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1ed760] text-black font-semibold text-xs hover:bg-[#1fdf64] transition-all hover:scale-105 shadow-md shadow-[#1ed760]/20"
                        >
                          <span>{t.viewProject}</span>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                        <a
                          href={featuredProject.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white font-medium text-xs hover:border-white/25 transition-all"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-1.745.299-.268.28-.731.029-1.035l-.011-.013c-.878-1.034-.739-2.612.28-3.504.093-.082.193-.158.298-.228.326-.217.449-.64.283-1.002-.636-1.386-.2-3.003 1.05-3.876.107-.075.22-.142.338-.201.378-.189.566-.634.423-1.039C8.746 4.934 9.88 3.361 11.38 3.08c.414-.077.74-.383.82-.796.3-1.554 1.76-2.628 3.32-2.446.417.049.805-.181.968-.571.616-1.472 2.274-2.224 3.774-1.71.4.137.842-.016 1.077-.373.882-1.338 2.705-1.724 4.043-.842.361.238.834.195 1.15-.107 1.186-1.135 3.064-1.135 4.25 0 .316.302.789.345 1.15.107 1.338-.882 3.161-.496 4.043.842.235.357.677.51 1.077.373 1.5-.514 3.158.238 3.774 1.71.163.39.551.62 1.077.373z" />
                          </svg>
                          <span>GitHub</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
