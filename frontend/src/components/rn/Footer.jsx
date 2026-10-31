import { Instagram, MapPin, Send } from "lucide-react";
import { Ears, Logo, TopHat } from "./Logo";
import { scrollTo } from "./ui";

const Vk = () => <span className="font-serif-rn text-base font-bold leading-none">VK</span>;
const SOCIALS = [
  { id: "instagram", icon: <Instagram className="h-5 w-5" /> },
  { id: "telegram", icon: <Send className="h-5 w-5" /> },
  { id: "vk", icon: <Vk /> },
];

export const Footer = () => (
  <footer id="contacts" data-testid="footer" className="relative overflow-hidden bg-[var(--night)] pt-16">
    <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col items-center gap-10 px-6 pb-12 text-[var(--cream)] sm:px-10 lg:flex-row lg:justify-between lg:gap-6">
      <Logo size="sm" testId="footer-logo" />
      <div className="flex items-center gap-4">
        {SOCIALS.map((s) => (
          <a key={s.id} href="#" data-testid={`footer-social-${s.id}`} aria-label={s.id} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#f5eedd]/25 transition-[background-color,transform,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--crimson-2)] hover:bg-[var(--crimson)]">
            {s.icon}
          </a>
        ))}
      </div>
      <p data-testid="footer-address" className="flex items-center gap-2 text-sm text-[#d9cfbd]"><MapPin className="h-4 w-4 text-[var(--gold)]" />г. Москва, ул. Волшебная, д. 10</p>
      <div className="flex items-center gap-3 text-sm text-[#d9cfbd]">
        <p className="leading-snug">Погрузись в сказку<br />уже сегодня</p>
        <Ears className="h-10 w-12 text-[var(--cream)]" />
      </div>
      <button data-testid="footer-book-btn" onClick={() => scrollTo("contacts")} className="group flex items-center gap-3 rounded-full bg-gradient-to-b from-[var(--crimson-2)] to-[var(--crimson)] py-3 pl-7 pr-4 font-serif-rn text-[0.75rem] font-bold uppercase tracking-[0.22em] text-[var(--cream)] shadow-[0_10px_30px_rgba(196,38,43,0.4)] outline-dashed outline-1 -outline-offset-4 outline-[#f5eedd]/40 transition-transform duration-300 hover:scale-105">
        Забронировать
        <TopHat className="h-6 w-7 transition-transform duration-500 group-hover:rotate-12" />
      </button>
    </div>
    <p className="relative z-10 pb-6 text-center text-xs text-[#bfb4a2]">© 2026 Кроличья Нора · Лофт</p>
    <div className="relative h-40 [perspective:500px] sm:h-52">
      <div className="checker absolute -inset-x-1/2 bottom-[-60%] top-0 origin-top [transform:rotateX(62deg)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--night)] via-[#0f0c0e]/40 to-transparent" />
    </div>
  </footer>
);
