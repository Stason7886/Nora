import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

export const Cheshire = () => {
  const [shown, setShown] = useState(false);
  const [q, setQ] = useState(0);
  const timer = useRef(null);

  const start = () => { clearTimeout(timer.current); timer.current = setTimeout(() => { setQ((n) => (n + 1) % QUOTES.length); setShown(true); }, HOLD_MS); };
  const stop = () => { clearTimeout(timer.current); setShown(false); };

  useEffect(() => { return () => clearTimeout(timer.current); }, []);

  return (
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
              {QUOTES[q]}
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
  );
};
