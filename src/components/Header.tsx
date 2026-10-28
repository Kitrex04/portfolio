'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Header() {
  const { lang, setLang, t } = useLanguage();
  const [timeStr, setTimeStr] = useState('GMT-4 • --:--');
  const [activeSection, setActiveSection] = useState('hero');

  // Live Caracas, Venezuela Clock (GMT-4)
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = now.toLocaleTimeString('es-VE', {
          timeZone: 'America/Caracas',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
        setTimeStr(`GMT-4 • ${formatted}`);
      } catch {
        setTimeStr('GMT-4 • 12:00:00');
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Active section scroll spy
  useEffect(() => {
    const sections = ['hero', 'stack', 'proyectos', 'contacto'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLang(lang === 'ES' ? 'EN' : 'ES');
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50 px-4 sm:px-8 py-5 pointer-events-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        
        {/* LEFT CONTAINER: LOCATION (VENEZUELA + GMT) & TRANSLATOR (EN / ES) */}
        <div className="flex items-center gap-2.5">
          {/* Location Pill */}
          <div className="mattia-pill flex items-center gap-2.5 rounded-full px-4 py-2 sm:px-5 sm:py-2.5 shadow-lg">
            <svg className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a14 14 0 014 9 14 14 0 01-4 9 14 14 0 01-4-9 14 14 0 014-9z" />
            </svg>
            <span className="text-xs sm:text-sm font-medium text-zinc-300">
              {t.locCity}
            </span>
            <span className="h-1 w-1 rounded-full bg-zinc-500" />
            <span className="text-xs sm:text-sm font-medium text-zinc-400 font-mono-code">
              {timeStr}
            </span>
          </div>

          {/* Translator Button (EN / ES) */}
          <button
            onClick={toggleLanguage}
            type="button"
            className="mattia-pill flex items-center gap-2 rounded-full px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium text-zinc-300 hover:text-white transition cursor-pointer shadow-lg"
            aria-label="Toggle language"
          >
            <svg className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span className="font-mono-code font-bold uppercase tracking-wider text-zinc-200">
              {lang}
            </span>
          </button>
        </div>

        {/* CENTER: NAVIGATION PILL */}
        <nav className="hidden md:flex items-center gap-1.5 mattia-pill rounded-full p-1.5 shadow-lg">
          <a
            href="#hero"
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
              activeSection === 'hero' ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {t.navHome}
          </a>
          <a
            href="#stack"
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
              activeSection === 'stack' ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {t.navStack}
          </a>
          <a
            href="#proyectos"
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
              activeSection === 'proyectos' ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {t.navProjects}
          </a>
          <a
            href="#contacto"
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
              activeSection === 'contacto' ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {t.navContact}
          </a>
        </nav>

        {/* RIGHT CONTAINER: "FIND ME ON" CONTAINER */}
        <div className="mattia-pill flex items-center gap-3 rounded-full px-4 py-2 sm:px-5 sm:py-2.5 shadow-lg">
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-400">
            {t.findMeOn}
          </span>
          <div className="flex items-center gap-2 border-l border-white/10 pl-2.5">
            <a
              href="https://github.com/Kitrex04"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition p-1"
              title="GitHub"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition p-1"
              title="LinkedIn"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </header>
  );
}
