import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Logo } from "./Logo";
import { scrollTo, openMax } from "./ui";
import { SoundToggle } from "./SoundToggle";

export const NAV = [
  { id: "about", label: "О нас" },
  { id: "space", label: "Пространство" },
  { id: "events", label: "Мероприятия" },
  { id: "gallery", label: "Галерея" },
  { id: "contacts", label: "Контакты" },
];

const MobileMenu = ({ onClose }) => (
  <motion.div
    data-testid="mobile-menu"
    initial={{ clipPath: "circle(0% at 95% 4%)" }}
    animate={{ clipPath: "circle(150% at 95% 4%)" }}
    exit={{ clipPath: "circle(0% at 95% 4%)" }}
    transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
    className="fixed inset-0 z-[60] flex flex-col justify-center bg-[var(--night)] px-8 sm:px-16"
  >
    <button data-testid="mobile-menu-close" onClick={onClose} className="absolute right-6 top-6 rounded-full border border-[#f5eedd]/40 p-3 text-[var(--cream)] transition-transform hover:rotate-90">
      <X className="h-5 w-5" />
    </button>
    <p className="eyebrow mb-8 text-[var(--gold)]">Следуй за белым кроликом</p>
    {NAV.map((n, i) => (
      <motion.button
        key={n.id}
        data-testid={`mobile-nav-${n.id}`}
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.25 + i * 0.07, duration: 0.6 }}
        onClick={() => { onClose(); setTimeout(() => scrollTo(n.id), 350); }}
        className="group flex items-baseline gap-5 py-2 text-left font-display text-5xl font-bold text-[var(--cream)] sm:text-7xl"
      >
        <span className="font-serif-rn text-base text-[var(--gold)]">0{i + 1}</span>
        <span className="transition-colors duration-300 group-hover:text-[var(--crimson-2)] group-hover:italic">{n.label}</span>
      </motion.button>
    ))}
  </motion.div>
);

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.9 }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,padding,backdrop-filter] duration-500 ${scrolled ? "bg-[#0f0c0e]/95 py-2 backdrop-blur-xl" : "py-5"}`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 sm:px-10">
          <Logo size={scrolled ? "sm" : "md"} testId="header-logo" />
          <nav className="hidden items-center gap-10 lg:flex">
            {NAV.map((n) => (
              <button key={n.id} data-testid={`nav-${n.id}`} onClick={() => scrollTo(n.id)} className="group relative font-serif-rn text-[0.82rem] font-bold uppercase tracking-[0.2em] text-[var(--cream)]">
                {n.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-[var(--gold)] transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3 sm:gap-6">
            <SoundToggle />
            <button data-testid="header-book-btn" onClick={openMax} className="group hidden items-center gap-3 rounded-full border border-[#c9a45a]/70 py-2 px-6 font-serif-rn text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[var(--cream)] transition-colors duration-500 hover:bg-[var(--crimson)] hover:border-[var(--crimson)] sm:flex">
              Забронировать
            </button>
            <button data-testid="burger-btn" onClick={() => setOpen(true)} aria-label="Меню" className="group flex h-10 w-10 flex-col items-end justify-center gap-[6px]">
              <span className="h-px w-7 bg-[var(--cream)] transition-all duration-300 group-hover:w-5" />
              <span className="h-px w-5 bg-[var(--cream)] transition-all duration-300 group-hover:w-7" />
              <span className="h-px w-7 bg-[var(--cream)]" />
            </button>
          </div>
        </div>
      </motion.header>
      <AnimatePresence>{open && <MobileMenu onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
};
