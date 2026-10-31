import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Armchair, Coffee, Flame, Flower2, Martini } from "lucide-react";
import { OvalButton, Reveal, scrollTo } from "./ui";

const ZONES = [
  { icon: Armchair, name: "Основной зал", hint: "Сцена, бархат и шахматный пол" },
  { icon: Coffee, name: "Чайная зона", hint: "Безумное чаепитие на 24 гостя" },
  { icon: Flame, name: "Каминная", hint: "Тихие разговоры у огня" },
  { icon: Flower2, name: "Сад", hint: "Красные розы Королевы" },
  { icon: Martini, name: "Бар", hint: "«Выпей меня» — фирменные коктейли" },
];

const ZoneCard = () => {
  const [active, setActive] = useState(0);
  return (
    <motion.div
      initial={{ opacity: 0, rotate: 8, y: 60 }}
      whileInView={{ opacity: 1, rotate: 2, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ type: "spring", stiffness: 60, damping: 13 }}
      className="parchment relative px-7 py-9 shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
      style={{ clipPath: "polygon(2% 1%, 30% 0, 62% 2%, 98% 0, 100% 30%, 98% 62%, 100% 99%, 70% 100%, 35% 98%, 1% 100%, 0 70%, 2% 35%)" }}
    >
      <ul className="space-y-1">
        {ZONES.map((z, i) => (
          <li key={z.name}>
            <button data-testid={`zone-${i}`} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)} className="group flex w-full items-center gap-4 py-2 text-left">
              <z.icon className={`h-6 w-6 transition-colors duration-300 ${active === i ? "text-[var(--crimson)]" : "text-[var(--ink)]"}`} strokeWidth={1.5} />
              <span className={`font-hand text-2xl transition-transform duration-300 ${active === i ? "translate-x-1.5 text-[var(--crimson)]" : "text-[var(--ink)]"}`}>{z.name}</span>
            </button>
          </li>
        ))}
      </ul>
      <p data-testid="zone-hint" key={active} className="mt-5 border-t border-dashed border-[#1c1613]/30 pt-4 font-serif-rn text-base italic text-[var(--ink-soft)]">{ZONES[active].hint}</p>
    </motion.div>
  );
};

export const Space = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const clip = useTransform(scrollYProgress, [0.05, 0.4], ["inset(12% 18% 12% 0%)", "inset(0% 0% 0% 0%)"]);

  return (
    <section id="space" ref={ref} data-testid="space-section" className="grain relative overflow-hidden bg-[var(--night)] py-24 lg:py-0">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <motion.div style={{ clipPath: clip }} className="relative h-[340px] overflow-hidden sm:h-[460px] lg:col-span-6 lg:h-[680px]">
          <motion.img style={{ y: imgY }} src="/img/interior.jpg" alt="Интерьер лофта: шахматный пол, бархатные кресла и большие часы" className="fade-right absolute inset-0 h-[116%] w-full -translate-y-[8%] object-cover" />
        </motion.div>
        <div className="px-6 sm:px-10 lg:col-span-3 lg:px-0">
          <Reveal><p className="eyebrow text-[var(--gold)]">Пространство</p></Reveal>
          <Reveal delay={0.1}><h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] text-[var(--cream)] sm:text-5xl">Тут всё не так, как кажется</h2></Reveal>
          <Reveal delay={0.2}><p className="mt-6 text-sm leading-relaxed text-[#d9cfbd] sm:text-base">Лофт «Кроличья нора» — это несколько зон, каждая из которых перенесёт тебя в свою историю: от чаепития у Безумного Шляпника до загадочного сада.</p></Reveal>
          <Reveal delay={0.3} className="mt-10"><OvalButton dark testId="space-gallery-btn" onClick={() => scrollTo("gallery")}>Посмотреть галерею</OvalButton></Reveal>
        </div>
        <div className="px-6 sm:px-10 lg:col-span-3 lg:pl-0 lg:pr-12">
          <ZoneCard />
        </div>
      </div>
    </section>
  );
};
