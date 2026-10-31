import { useEffect } from "react";
import Lenis from "lenis";
import "@/App.css";
import { Header } from "@/components/rn/Header";
import { Hero } from "@/components/rn/Hero";
import { About } from "@/components/rn/About";
import { Space } from "@/components/rn/Space";
import { Events } from "@/components/rn/Events";
import { Marquee } from "@/components/rn/Marquee";
import { Footer } from "@/components/rn/Footer";
import { Cheshire } from "@/components/rn/Cheshire";
import { Toaster } from "sonner";

function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.25, smoothWheel: true });
    window.__lenis = lenis;
    let id;
    const raf = (t) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); window.__lenis = null; };
  }, []);

  return (
    <main className="relative">
      <Header />
      <Hero />
      <About />
      <Space />
      <Events />
      <Marquee />
      <Footer />
      <Cheshire />
      <Toaster position="top-center" richColors />
    </main>
  );
}

export default App;
