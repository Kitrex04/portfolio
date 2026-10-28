import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#09090b',
};

export const metadata: Metadata = {
  title: 'Alejandro Pérez — Full-Stack Web Developer Portfolio',
  description:
    'Desarrollador Web Full-Stack. Interfaces creativas, fluidas y de alto rendimiento construidas con arquitecturas modernas.',
  authors: [{ name: 'Alejandro Pérez', url: 'https://github.com/Kitrex04' }],
  keywords: [
    'Alejandro Pérez',
    'Frontend Developer',
    'Full-Stack Developer',
    'Next.js',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'Three.js',
    'Portfolio',
  ],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${plusJakartaSans.variable} ${jetBrainsMono.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-[#09090b] text-[#f4f4f5] overflow-x-hidden selection:bg-white/10 selection:text-white">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
