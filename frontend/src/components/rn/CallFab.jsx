import { motion } from "framer-motion";
import { Phone } from "lucide-react";

export const PHONE = "+79052104194";
export const PHONE_LABEL = "+7 905 210-41-94";

export const CallFab = () => (
  <motion.a
    href={`tel:${PHONE}`}
    data-testid="call-fab"
    aria-label={`Позвонить ${PHONE_LABEL}`}
    initial={{ opacity: 0, scale: 0.6 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 2, type: "spring", stiffness: 220, damping: 18 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.92 }}
    className="group fixed bottom-5 right-5 z-40 flex h-14 items-center gap-3 rounded-full bg-[var(--gold)] pl-4 pr-4 text-[var(--night)] shadow-[0_10px_30px_rgba(201,164,90,0.45)] md:pr-6"
  >
    <span className="absolute inset-0 animate-ping rounded-full bg-[var(--gold)] opacity-25" style={{ animationDuration: "2.6s" }} />
    <Phone className="relative h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
    <span className="relative hidden font-serif-rn text-base font-bold tracking-wide md:inline">{PHONE_LABEL}</span>
  </motion.a>
);
