import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { OvalButton, Reveal, TornEdge, scrollTo } from "./ui";

const EVENTS = [
  { img: "img/rent.jpg", pos: "object-[center_45%]", caption: "Аренда лофта от 1.500 р", rot: -5, y: 10 },
  { img: "img/mafia.jpg", pos: "object-[15%_center]", caption: "Игра в мафию 5.000 р", rot: 4, y: -10 },
  { img: "img/challenge.jpg", pos: "object-[center_42%]", caption: "Челлендж - пати\n16.000 р", nowrap: true, rot: -2, y: 18 },
];

const Polaroid = ({ e, i }) => (
  <motion.figure
    data-testid={`event-card-${i}`}
    initial={{ opacity: 0, y: 120, rotate: e.rot * 3 }}
    whileInView={{ opacity: 1, y: e.y, rotate: e.rot }}
    whileHover={{ rotate: 0, y: e.y - 18, scale: 1.05, zIndex: 20 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ type: "spring", stiffness: 70, damping: 14, delay: i * 0.12 }}
    onClick={() => scrollTo("contacts")}
    className="relative cursor-pointer bg-[#f7f2e6] p-3 pb-2 shadow-[0_24px_50px_rgba(40,25,10,0.38)]"
  >
    <div className="aspect-[4/3.4] overflow-hidden">
      <img src={e.img} alt={e.caption} className={`h-full w-full object-cover ${e.pos || ""} transition-transform duration-700 hover:scale-110`} />
    </div>
    <figcaption className={`flex min-h-[4rem] items-center justify-center px-2 pt-2 text-center font-hand leading-none text-[var(--ink)] ${e.nowrap ? "whitespace-pre text-2xl sm:text-[1.35rem] xl:text-2xl" : "whitespace-pre-line text-2xl"}`}>{e.caption}</figcaption>
  </motion.figure>
);

export const Events = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const flY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const wR = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <section id="events" ref={ref} data-testid="events-section" className="parchment relative z-20">
      <TornEdge position="top" seed={41} />
      <motion.img style={{ y: flY }} src="img/flamingo.jpg" alt="Фламинго, гравюра" className="ink-fade pointer-events-none absolute -left-24 top-10 hidden h-[85%] mix-blend-multiply md:block lg:-left-20" />
      <motion.img style={{ rotate: wR }} src="img/watch.jpg" alt="Карманные часы и розы" className="ink-fade pointer-events-none absolute -right-20 -bottom-6 hidden w-80 mix-blend-multiply xl:block" />
      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-14 px-6 py-24 sm:px-10 md:pl-56 xl:grid-cols-12 xl:pl-56">
        <div className="xl:col-span-4">
          <Reveal><p className="eyebrow text-[var(--ink-soft)]">Мероприятия</p></Reveal>
          <Reveal delay={0.1}><h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl">События, которые запоминаются</h2></Reveal>
          <Reveal delay={0.2}><p className="mt-6 text-sm leading-relaxed text-[var(--ink-soft)] sm:text-base">Детские дни рождения с аниматорами, подростковые вечеринки в стиле «Мафия», корпоративы с музыкальными квизами. Мы создаём атмосферу, в которую хочется возвращаться.</p></Reveal>
          <Reveal delay={0.3} className="mt-10"><OvalButton testId="events-all-btn" onClick={() => scrollTo("contacts")}>Все мероприятия</OvalButton></Reveal>
        </div>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-5 xl:col-span-8 xl:pr-24">
          {EVENTS.map((e, i) => <Polaroid key={e.caption} e={e} i={i} />)}
        </div>
      </div>
      <TornEdge position="bottom" seed={57} />
    </section>
  );
};
