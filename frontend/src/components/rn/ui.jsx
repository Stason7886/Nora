import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -10, duration: 1.6 });
  else el.scrollIntoView({ behavior: "smooth" });
};

export const Reveal = ({ children, delay = 0, y = 34, className = "", ...rest }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    {...rest}
  >
    {children}
  </motion.div>
);

export const TicketButton = ({ children, onClick, testId }) => (
  <motion.button
    data-testid={testId}
    onClick={onClick}
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.97 }}
    className="ticket group relative bg-[#7d0f14] p-[3px] shadow-[0_10px_40px_rgba(196,38,43,0.45)]"
  >
    <span className="ticket-inner flex items-center gap-3 bg-gradient-to-b from-[var(--crimson-2)] to-[var(--crimson)] px-10 py-4 font-serif-rn text-sm font-bold uppercase tracking-[0.28em] text-[var(--cream)] outline-dashed outline-1 -outline-offset-[6px] outline-[#f5eedd]/50">
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
    </span>
  </motion.button>
);

export const OvalButton = ({ children, onClick, testId, dark = false }) => (
  <button
    data-testid={testId}
    onClick={onClick}
    className={`group relative overflow-hidden rounded-full border px-9 py-3.5 font-serif-rn text-[0.8rem] font-bold uppercase tracking-[0.26em] transition-colors duration-500 ${
      dark
        ? "border-[#f5eedd]/70 text-[var(--cream)] hover:text-[var(--night)]"
        : "border-[var(--ink)] text-[var(--ink)] hover:text-[var(--cream)]"
    }`}
  >
    <span className={`absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 ${dark ? "bg-[var(--cream)]" : "bg-[var(--ink)]"}`} />
    <span className="relative">{children}</span>
  </button>
);

const tornPath = (seed, top) => {
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  let d = top ? "M0 40 L0 " : "M0 0 L0 ";
  const pts = [];
  for (let x = 0; x <= 1440; x += 12 + rnd() * 22) pts.push(`${x.toFixed(0)} ${(6 + rnd() * 22).toFixed(1)}`);
  d += pts[0].split(" ")[1] + " L" + pts.join(" L") + " L1440 " + (8 + rnd() * 16).toFixed(1);
  return d + (top ? " L1440 40 Z" : " L1440 0 Z");
};

export const TornEdge = ({ position = "top", seed = 7 }) => (
  <svg
    viewBox="0 0 1440 40"
    preserveAspectRatio="none"
    aria-hidden="true"
    className={`pointer-events-none absolute left-0 z-10 h-5 w-full sm:h-8 ${position === "top" ? "-top-[19px] sm:-top-[31px]" : "-bottom-[19px] sm:-bottom-[31px] rotate-180"}`}
    style={{ filter: "drop-shadow(0 -3px 2px rgba(0,0,0,0.35))" }}
  >
    <path d={tornPath(seed, true)} fill="#efe5cf" />
  </svg>
);
