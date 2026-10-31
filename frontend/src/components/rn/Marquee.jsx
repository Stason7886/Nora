const ITEMS = [
  { t: "Выпей меня" }, { img: "/img/ev1.jpg" }, { t: "Чаепитие у Шляпника" }, { img: "/img/interior.jpg" },
  { t: "Съешь меня" }, { img: "/img/ev2.jpg" }, { t: "Сад Королевы" }, { img: "/img/ev3.jpg" }, { t: "Всё чудесатее" }, { img: "/img/hero.jpg" },
];

const Row = ({ hidden }) => (
  <div className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden}>
    {ITEMS.map((it, i) =>
      it.img ? (
        <div key={i} className="h-28 w-44 shrink-0 overflow-hidden rounded-[999px] border border-[#c9a45a]/40 sm:h-36 sm:w-60">
          <img src={it.img} alt="" className="h-full w-full object-cover grayscale-[40%] transition-[filter,transform] duration-700 hover:scale-110 hover:grayscale-0" />
        </div>
      ) : (
        <span key={i} className="flex shrink-0 items-center gap-10 font-display text-5xl font-bold italic text-[var(--cream)] sm:text-7xl">
          {it.t}<span className="text-2xl text-[var(--crimson-2)]">♥</span>
        </span>
      )
    )}
  </div>
);

export const Marquee = () => (
  <section id="gallery" data-testid="gallery-marquee" className="marquee-wrap relative overflow-hidden bg-[var(--night)] py-16 sm:py-20">
    <p className="eyebrow mb-10 px-6 text-[var(--gold)] sm:px-10">Галерея · Загляни за зеркало</p>
    <div className="marquee-track flex w-max">
      <Row />
      <Row hidden />
    </div>
  </section>
);
