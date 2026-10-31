import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { MAX_URL } from "./ui";

export const MaxFab = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={MAX_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="max-fab"
          aria-label="Написать в MAX"
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 30 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-gradient-to-b from-[var(--crimson-2)] to-[var(--crimson)] py-3 pl-4 pr-5 text-[var(--cream)] shadow-[0_10px_30px_rgba(196,38,43,0.55)] outline-dashed outline-1 -outline-offset-4 outline-[#f5eedd]/40 md:hidden"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-[var(--crimson-2)] opacity-20" style={{ animationDuration: "2.4s" }} />
          <MessageCircle className="relative h-5 w-5" />
          <span className="relative font-serif-rn text-sm font-bold tracking-[0.18em]">MAX</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
};
