import ShapeGrid from '@/components/ShapeGrid';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Stack from '@/components/Stack';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      {/* Interactive 3D Dot Matrix Background */}
      <ShapeGrid />

      {/* Fixed Header & Navigation Pill */}
      <Header />

      {/* Main Semantic Landmark */}
      <main id="main-content" className="relative z-10 w-full flex flex-col">
        <Hero />
        <Stack />
        <Projects />
        <Contact />
      </main>

      {/* Minimalist Centered Footer */}
      <Footer />
    </>
  );
}
