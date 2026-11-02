import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Gift, X } from "lucide-react";
import { purr } from "@/lib/wonderSound";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const GIFT_AT = 5;

const QUOTES = ["Мы все здесь не в своём уме.", "Куда ты хочешь попасть?", "Всё чудесатее и чудесатее…"];
const HOLD_MS = 1200;

const Eye = ({ cx }) => (
  <g>
    <ellipse cx={cx} cy="78" rx="15" ry="11" fill="#5ef2d6" style={{ filter: "drop-shadow(0 0 6px #5ef2d6)" }} />
    <ellipse cx={cx} cy="78" rx="3" ry="10" fill="#0f0c0e" />
  </g>
);

const Grin = () => (
  <g>
    <path d="M38 104 Q100 160 162 104 Q100 136 38 104Z" fill="#f5eedd" stroke="#0f0c0e" strokeWidth="2" />
    {[56, 70, 84, 100, 116, 130, 144].map((x) => (
      <line key={x} x1={x} y1={108 + (x < 100 ? (x - 38) / 6 : (162 - x) / 6)} x2={x} y2={122 + (x < 100 ? (x - 38) / 4 : (162 - x) / 4) * 0.6} stroke="#0f0c0e" strokeWidth="1.6" />
    ))}
  </g>
);

const Head = () => (
  <g>
    <path d="M30 70 L22 18 L66 46 Q100 34 134 46 L178 18 L170 70 Q186 120 100 150 Q14 120 30 70Z" fill="#7a3a8c" />
    {[52, 74, 96, 118, 140].map((x, i) => (
      <path key={x} d={`M${x} ${44 - (i % 2) * 4} q6 20 -2 40`} stroke="#c45aa8" strokeWidth="7" fill="none" strokeLinecap="round" />
    ))}
    <path d="M30 22 L58 44 L36 56Z M170 22 L142 44 L164 56Z" fill="#e48bc6" />
  </g>
);

const GiftCard = ({ gift, onClose }) => {
  const copy = () => { navigator.clipboard?.writeText(gift.code).catch(() => {}); };
  return (
    <motion.div
      data-testid="cheshire-gift"
      initial={{ opacity: 0, y: 60, rotate: -8, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, rotate: -2, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.85 }}
      transition={{ type: "spring", stiffness: 90, damping: 13 }}
      className="parchment fixed bottom-32 left-4 z-50 w-[min(320px,calc(100vw-2rem))] p-6 shadow-[0_30px_70px_rgba(0,0,0,0.65)] outline-dashed outline-1 -outline-offset-8 outline-[#a3161c]/60 sm:bottom-40 sm:left-8"
    >
      <button data-testid="cheshire-gift-close" onClick={onClose} aria-label="Закрыть" className="absolute right-3 top-3 p-1 text-[var(--ink)] transition-transform hover:rotate-90"><X className="h-4 w-4" /></button>
      <Gift className="h-7 w-7 text-[var(--crimson)]" />
      <p className="mt-3 font-hand text-2xl leading-tight text-[var(--ink)]">Ты заходил ко мне пять раз. Держи подарок!</p>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">Скидка {gift.discount}% на бронирование лофта</p>
      <button data-testid="cheshire-gift-code" onClick={copy} className="mt-4 flex w-full items-center justify-between border border-dashed border-[var(--crimson)] px-4 py-3 font-serif-rn text-lg font-bold tracking-[0.2em] text-[var(--crimson)] transition-colors hover:bg-[#a3161c]/10">
        {gift.code}<Copy className="h-4 w-4" />
      </button>
      <p className="mt-4 text-xs text-[var(--ink-soft)]">Назовите этот код при бронировании.</p>
    </motion.div>
  );
};

export const Cheshire = () => {
  const [shown, setShown] = useState(false);
  const [q, setQ] = useState(0);
  const [gift, setGift] = useState(null);
  const timer = useRef(null);

  const reveal = async () => {
    const n = Number(localStorage.getItem("rn_cat_count") || 0) + 1;
    localStorage.setItem("rn_cat_count", String(n));
    setQ((v) => (v + 1) % QUOTES.length);
    setShown(true);
    if (n !== GIFT_AT) return;
    try {
      const { data } = await axios.get(`${API}/promo/cheshire`);
      if (!data?.code) return;
      localStorage.setItem("rn_promo", data.code);
      setGift(data);
    } catch (e) { /* кот сегодня не в духе */ }
  };

  const start = () => { clearTimeout(timer.current); timer.current = setTimeout(reveal, HOLD_MS); };
  const stop = () => { clearTimeout(timer.current); setShown(false); };

  useEffect(() => { return () => clearTimeout(timer.current); }, []);
  useEffect(() => { purr(shown); }, [shown]);

  return (
    <>
    <AnimatePresence>{gift && <GiftCard gift={gift} onClose={() => setGift(null)} />}</AnimatePresence>
    <div
      data-testid="cheshire-hotspot"
      onPointerEnter={start}
      onPointerLeave={stop}
      onPointerDown={start}
      onPointerUp={stop}
      onContextMenu={(e) => e.preventDefault()}
      className="fixed bottom-0 left-0 z-40 h-28 w-28 select-none sm:h-36 sm:w-36"
      style={{ touchAction: "manipulation" }}
    >
      {!shown && (
        <motion.div animate={{ opacity: [0.15, 0.55, 0.15] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute bottom-6 left-6 flex gap-3" aria-hidden="true">
          <span className="h-1.5 w-2.5 rounded-full bg-[#5ef2d6] shadow-[0_0_8px_#5ef2d6]" />
          <span className="h-1.5 w-2.5 rounded-full bg-[#5ef2d6] shadow-[0_0_8px_#5ef2d6]" />
        </motion.div>
      )}
      <AnimatePresence>
        {shown && (
          <motion.div data-testid="cheshire-cat" key="cat" className="pointer-events-none absolute bottom-3 left-3 w-44 sm:w-56" initial={{ rotate: -20, y: 30 }} animate={{ rotate: 8, y: 0 }} exit={{ rotate: -30, y: 20, transition: { delay: 1.2, duration: 0.6 } }} transition={{ type: "spring", stiffness: 80, damping: 12 }}>
            <motion.p
              data-testid="cheshire-quote"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.9 } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="absolute -top-12 left-16 w-52 rounded-2xl bg-[#f5eedd] px-4 py-2 font-hand text-lg leading-tight text-[#1c1613] shadow-[0_10px_30px_rgba(0,0,0,0.5)] sm:left-24"
            >
              {gift ? "Держи подарок…" : QUOTES[q]}
            </motion.p>
            <svg viewBox="0 0 200 160" className="w-full overflow-visible">
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.6 } }} exit={{ opacity: 0, transition: { duration: 0.4 } }}><Head /></motion.g>
              <motion.g initial={{ opacity: 0, scaleY: 0.1 }} animate={{ opacity: 1, scaleY: 1, transition: { delay: 0.25 } }} exit={{ opacity: 0, transition: { delay: 0.3, duration: 0.4 } }} style={{ originY: "78px" }}><Eye cx={70} /><Eye cx={130} /></motion.g>
              <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { delay: 1.1, duration: 0.6 } }} style={{ originX: "100px", originY: "120px" }}><Grin /></motion.g>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
};
