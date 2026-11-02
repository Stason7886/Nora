import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Coffee, MapPin } from "lucide-react";
import { TopHat } from "./Logo";
import { OvalButton, Reveal, TornEdge, scrollTo } from "./ui";

const FEATURES = [
  { icon: <TopHat className="h-8 w-9 [&_path]:fill-[var(--ink)] [&_ellipse]:fill-[var(--ink)] [&_rect]:fill-[var(--paper)]" />, title: "Уникальный интерьер", text: "Декор в стиле Алисы в Стране чудес" },
  { icon: <Coffee className="h-7 w-7" strokeWidth={1.6} />, title: "Для любых событий", text: "Дни рождения, вечеринки, съемки, мастер-классы" },
  { icon: <MapPin className="h-7 w-7" strokeWidth={1.6} />, title: "Удобное расположение", text: "В центре города" },
];

const Note = () => (
  <motion.div
    data-testid="about-note"
    initial={{ rotate: -14, opacity: 0, y: 40 }}
    whileInView={{ rotate: -5, opacity: 1, y: 0 }}
    whileHover={{ rotate: 0, scale: 1.04 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ type: "spring", stiffness: 70, damping: 12 }}
    className="relative w-44 bg-[#e8dcc0] p-5 shadow-[6px_12px_30px_rgba(60,40,15,0.35)] sm:w-48"
    style={{ backgroundImage: "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,.5), transparent 60%), radial-gradient(ellipse at 80% 90%, rgba(130,90,40,.25), transparent 60%)" }}
  >
    <p className="font-hand text-2xl leading-snug text-[var(--ink)]">Вся жизнь — это сон, и мы в нём — гости.</p>
    <span className="mt-2 block text-right font-hand text-xl text-[var(--crimson)]">♥</span>
  </motion.div>
);

export const About = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const cupsY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const rabbitY = useTransform(scrollYProgress, [0, 1], [40, -50]);

  return (
    <section id="about" ref={ref} data-testid="about-section" className="parchment relative z-20">
      <TornEdge position="top" seed={11} />
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-6 py-20 sm:px-10 lg:grid-cols-12 lg:gap-8 lg:py-28">
        <div className="relative order-2 flex h-[360px] items-end justify-center lg:order-1 lg:col-span-3 lg:h-[520px]">
          <motion.img style={{ y: cupsY }} src="img/cups.jpg" alt="Башня чайных чашек с сердечками" className="ink-fade absolute -left-6 bottom-0 h-full w-auto max-w-none mix-blend-multiply lg:-left-16" />
          <div className="absolute right-0 top-4 lg:-right-4 lg:top-10"><Note /></div>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-4">
          <Reveal><p className="eyebrow text-[var(--ink-soft)]">О нас</p></Reveal>
          <Reveal delay={0.1}><h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl">Лофт «Кроличья Нора»</h2></Reveal>
          <Reveal delay={0.2}><p className="mt-4 font-serif-rn text-xl font-semibold leading-snug sm:text-2xl">— это пространство для тех, кто не боится выйти за рамки.</p></Reveal>
          <Reveal delay={0.3}><p className="mt-6 max-w-md text-sm leading-relaxed text-[var(--ink-soft)] sm:text-base">Наш лофт — как нора в Страну чудес: здесь можно забыть о времени, погрузиться в атмосферу волшебства и создать незабываемые события.</p></Reveal>
          <Reveal delay={0.4} className="mt-10 max-w-xs">
            <div className="mb-8 flex items-center gap-3 text-[var(--ink)]"><span className="h-px flex-1 bg-[#1c1613]/50" />♣<span className="h-px flex-1 bg-[#1c1613]/50" /></div>
            <OvalButton testId="about-more-btn" onClick={() => scrollTo("space")}>Подробнее о лофте</OvalButton>
          </Reveal>
        </div>

        <motion.div style={{ y: rabbitY }} className="order-3 mx-auto w-56 lg:col-span-2 lg:w-full">
          <motion.img
            src="img/rabbit.png"
            alt="Белый кролик с часами, гравюра"
            initial={{ opacity: 0, x: 60, rotate: 8 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:scale-125"
          />
        </motion.div>

        <Reveal delay={0.2} className="order-4 lg:col-span-3">
          <div className="relative border border-[#1c1613]/40 p-8 outline outline-1 outline-offset-[6px] outline-[#1c1613]/25">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} data-testid={`about-feature-${i}`} whileHover={{ x: 6 }} className="flex gap-4 border-b border-dashed border-[#1c1613]/25 py-6 first:pt-0 last:border-0 last:pb-0">
                <div className="mt-1 shrink-0 text-[var(--ink)]">{f.icon}</div>
                <div>
                  <h3 className="font-serif-rn text-sm font-bold uppercase tracking-[0.18em]">{f.title}</h3>
                  <p className="mt-2 text-sm text-[var(--ink-soft)]">{f.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>
      <TornEdge position="bottom" seed={23} />
    </section>
  );
};
