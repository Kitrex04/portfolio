'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const copyTimerRef = useRef<NodeJS.Timeout | null>(null);

  const physics = useRef({
    isHovered: false,
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    targetRotX: 0,
    targetRotY: 0,
    currentRotX: 0,
    currentRotY: 0,
  });

  const maxPull = 14;
  const maxTilt = 7.0;
  const lerpSpeed = 0.12;

  const updateBounds = () => {
    if (cardRef.current) {
      boundsRef.current = cardRef.current.getBoundingClientRect();
    }
  };

  const renderPhysicsLoop = () => {
    const card = cardRef.current;
    if (!card) return;

    const p = physics.current;
    p.currentX += (p.targetX - p.currentX) * lerpSpeed;
    p.currentY += (p.targetY - p.currentY) * lerpSpeed;
    p.currentRotX += (p.targetRotX - p.currentRotX) * lerpSpeed;
    p.currentRotY += (p.targetRotY - p.currentRotY) * lerpSpeed;

    const shadowX = -p.currentX * 1.5;
    const shadowY = 16 - p.currentY * 1.5;

    card.style.transform = `perspective(1000px) translate3d(${p.currentX.toFixed(2)}px, ${p.currentY.toFixed(2)}px, 0px) rotateX(${p.currentRotX.toFixed(2)}deg) rotateY(${p.currentRotY.toFixed(2)}deg)`;
    card.style.boxShadow = `${shadowX.toFixed(1)}px ${shadowY.toFixed(1)}px 36px rgba(0, 0, 0, 0.45), 0 0 20px rgba(255, 255, 255, 0.02)`;

    const delta =
      Math.abs(p.targetX - p.currentX) +
      Math.abs(p.targetY - p.currentY) +
      Math.abs(p.targetRotX - p.currentRotX) +
      Math.abs(p.targetRotY - p.currentRotY);

    if (p.isHovered || delta > 0.04) {
      animFrameRef.current = requestAnimationFrame(renderPhysicsLoop);
    } else {
      card.style.transform =
        'perspective(1000px) translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg)';
      card.style.boxShadow = '';
      animFrameRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    physics.current.isHovered = true;
    updateBounds();
    if (!animFrameRef.current) {
      animFrameRef.current = requestAnimationFrame(renderPhysicsLoop);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!physics.current.isHovered) return;
    if (!boundsRef.current) updateBounds();
    const bounds = boundsRef.current;
    if (!bounds) return;

    const relX = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
    const relY = ((e.clientY - bounds.top) / bounds.height) * 2 - 1;

    physics.current.targetX = Math.max(-maxPull, Math.min(maxPull, relX * maxPull));
    physics.current.targetY = Math.max(-maxPull, Math.min(maxPull, relY * maxPull));
    physics.current.targetRotX = -relY * maxTilt;
    physics.current.targetRotY = relX * maxTilt;

    if (!animFrameRef.current) {
      animFrameRef.current = requestAnimationFrame(renderPhysicsLoop);
    }
  };

  const handleMouseLeave = () => {
    physics.current.isHovered = false;
    physics.current.targetX = 0;
    physics.current.targetY = 0;
    physics.current.targetRotX = 0;
    physics.current.targetRotY = 0;
  };

  const copyEmail = async () => {
    const email = 'perezfalejandro2@gmail.com';
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = email;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  useEffect(() => {
    const handleScrollOrResize = () => updateBounds();
    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  return (
    <section
      id="contacto"
      aria-label="Contacto"
      className="relative w-full py-28 px-4 sm:px-8 border-t border-white/5 bg-transparent z-10"
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy & Presentation */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3 font-mono-code text-xs text-zinc-500 uppercase tracking-[0.25em]">
              <span>{t.contactTag}</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              ¿Tienes un proyecto en mente?<br />
              <span className="holo-rgb-text">Hablemos.</span>
            </h2>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-md">
              {t.contactDesc}
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs font-mono-code text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.availableProjects}</span>
            </div>
          </div>

          {/* Right Column: Card with Matching Header Pill Border & Gravity Physics */}
          <div className="lg:col-span-6" style={{ perspective: '1200px' }}>
            <div
              ref={cardRef}
              id="contactGravityCard"
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="contact-gravity-card"
            >
              <div className="contact-card-inner p-7 sm:p-9 space-y-6">
                
                {/* Email Block */}
                <div className="space-y-2.5">
                  <div className="text-xs font-mono-code text-zinc-400 uppercase tracking-wider">
                    {t.emailLabel}
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="mailto:perezfalejandro2@gmail.com"
                      className="mattia-pill px-5 py-3.5 rounded-2xl flex items-center justify-between flex-1 text-sm font-mono-code text-zinc-200 hover:text-white transition duration-200 group"
                      title="Enviar correo"
                    >
                      <span>perezfalejandro2@gmail.com</span>
                      <span className="text-zinc-500 group-hover:text-zinc-300 transition">↗</span>
                    </a>
                    <button
                      onClick={copyEmail}
                      type="button"
                      className="mattia-pill px-4 py-3.5 rounded-2xl flex items-center justify-center text-xs font-mono-code text-zinc-400 hover:text-white transition duration-200 cursor-pointer"
                      title="Copiar correo"
                    >
                      <span className={copied ? 'text-emerald-400 font-semibold' : ''}>
                        {copied ? t.copied : t.copy}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Direct Links Block */}
                <div className="space-y-2.5 pt-2">
                  <div className="text-xs font-mono-code text-zinc-400 uppercase tracking-wider">
                    {t.socialsLabel}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href="https://github.com/Kitrex04"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mattia-pill px-4 py-3 rounded-2xl text-xs font-mono-code text-zinc-300 hover:text-white hover:border-white/30 transition flex items-center justify-between group"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-zinc-400 group-hover:text-white transition" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                        GitHub
                      </span>
                      <span className="text-zinc-500 group-hover:text-zinc-300 transition">↗</span>
                    </a>

                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mattia-pill px-4 py-3 rounded-2xl text-xs font-mono-code text-zinc-300 hover:text-white hover:border-white/30 transition flex items-center justify-between group"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-zinc-400 group-hover:text-white transition" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0-.01-3.28 1.64 1.64 0 0 0 .01 3.28m1.4 9.74v-8.37H5.06v8.37h2.8z" />
                        </svg>
                        LinkedIn
                      </span>
                      <span className="text-zinc-500 group-hover:text-zinc-300 transition">↗</span>
                    </a>
                  </div>
                </div>

                {/* Direct Mail CTA Action inside Card */}
                <div className="pt-2">
                  <a
                    href="mailto:perezfalejandro2@gmail.com"
                    className="w-full py-3.5 px-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-mono-code text-xs flex items-center justify-center gap-2 transition duration-200 group"
                  >
                    <svg className="w-4 h-4 text-white group-hover:scale-110 transition duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{t.directEmailCta}</span>
                    <span className="text-zinc-400 group-hover:translate-x-0.5 transition duration-200">→</span>
                  </a>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
