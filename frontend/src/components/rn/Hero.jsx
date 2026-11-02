import { useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { TopHat } from "./Logo";
import { TicketButton, scrollTo } from "./ui";

const ease = [0.76, 0, 0.24, 1];

const Line = ({ children, delay }) => (
  <span className="block overflow-hidden pb-[0.08em]">
    <motion.span className="block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1.3, delay, ease }}>
      {children}
    </motion.span>
  </span>
);

const DUST = Array.from({ length: 18 }, (_, i) => ({ l: (i * 53) % 100, t: 30 + ((i * 37) % 60), d: (i % 6) * 1.1, s: 2 + (i % 3) }));

export const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 80, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 80, damping: 18 });
  const bx = useSpring(useTransform(mx, [-0.5, 0.5], [18, -18]), { stiffness: 60, damping: 20 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section id="top" ref={ref} onMouseMove={onMove} data-testid="hero-section" className="grain relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[var(--night)] [perspective:1200px]">
      <motion.div style={{ y: bgY, x: bx }} className="absolute -inset-[4%]">
        <motion.img
          src="img/hero.jpg"
          alt="Вход в лофт Кроличья Нора через нору в корнях дерева"
          initial={{ scale: 1.25, filter: "brightness(0.2) blur(6px)" }}
          animate={{ scale: 1.05, filter: "brightness(1) blur(0px)" }}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_50%_at_50%_48%,rgba(10,7,9,0.72),rgba(10,7,9,0.15)_70%,rgba(10,7,9,0.55))]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--night)] to-transparent" />
      {DUST.map((p, i) => (
        <span key={i} className="pointer-events-none absolute rounded-full bg-[#ffd98a]" style={{ left: `${p.l}%`, top: `${p.t}%`, width: p.s, height: p.s, boxShadow: "0 0 8px #ffcf70", animation: `dust ${6 + p.d}s ${p.d}s linear infinite` }} />
      ))}

      <motion.div style={{ y: titleY, opacity: fade, rotateX: rx, rotateY: ry }} className="relative z-10 flex flex-col items-center px-5 pt-20 text-center [transform-style:preserve-3d]">
        <motion.div initial={{ y: -80, opacity: 0, rotate: -25 }} animate={{ y: 0, opacity: 1, rotate: -6 }} transition={{ duration: 1.2, delay: 0.9, type: "spring", bounce: 0.45 }} style={{ translateZ: 60 }}>
          <TopHat className="mb-[-0.6rem] h-16 w-24 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)] sm:h-24 sm:w-32" />
        </motion.div>
        <h1 data-testid="hero-title" className="font-display text-[3.6rem] font-bold leading-[0.88] text-[var(--cream)] drop-shadow-[0_6px_30px_rgba(0,0,0,0.85)] sm:text-[6.5rem] lg:text-[8.5rem]" style={{ transform: "translateZ(40px)" }}>
          <Line delay={0.35}>Кроличья</Line>
          <Line delay={0.55}>Нора</Line>
        </h1>
        <motion.div initial={{ opacity: 0, letterSpacing: "0.1em" }} animate={{ opacity: 1, letterSpacing: "0.6em" }} transition={{ duration: 1.6, delay: 1.1 }} className="mt-4 flex items-center gap-4 font-serif-rn text-lg font-bold text-[var(--cream)] sm:text-2xl">
          <span className="h-px w-10 bg-[#f5eedd]/60 sm:w-16" />ЛОФТ<span className="h-px w-10 bg-[#f5eedd]/60 sm:w-16" />
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.35 }} className="mt-6 max-w-sm text-base text-[#f5eedd]/90 sm:text-lg">
          Погрузись в мир, где реальность — всего лишь начало
        </motion.p>
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 1.6, type: "spring" }} className="mt-10">
          <TicketButton testId="hero-cta-btn" onClick={() => scrollTo("about")}>Узнать больше</TicketButton>
        </motion.div>
      </motion.div>

      <motion.button data-testid="hero-scroll-hint" aria-label="Прокрутить вниз" onClick={() => scrollTo("about")} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} className="absolute bottom-10 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[#f5eedd]/80 sm:flex">
        <span className="relative h-10 w-px overflow-hidden bg-[#f5eedd]/25"><motion.span animate={{ y: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }} className="absolute inset-0 bg-[var(--gold)]" /></span>
      </motion.button>
    </section>
  );
};
