import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isSoundOn, onSoundChange, setSound } from "@/lib/wonderSound";

export const SoundToggle = () => {
  const [on, setOn] = useState(isSoundOn());

  useEffect(() => {
    const off = onSoundChange(setOn);
    return () => { off(); };
  }, []);

  return (
    <button
      data-testid="sound-toggle"
      onClick={() => setSound(!on)}
      aria-pressed={on}
      aria-label={on ? "Выключить звуки" : "Включить звуки Страны чудес"}
      title={on ? "Выключить звуки" : "Звуки Страны чудес"}
      className={`group relative flex h-10 items-center gap-2 rounded-full border px-3 transition-colors duration-300 ${on ? "border-[var(--gold)] bg-[#c9a45a]/15 text-[var(--gold)]" : "border-[#f5eedd]/30 text-[var(--cream)] hover:border-[var(--gold)]"}`}
    >
      {on ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span key={i} className={`w-[2px] rounded-full bg-current ${on ? "animate-pulse" : ""}`} style={{ height: on ? `${6 + i * 3}px` : "3px", animationDelay: `${i * 0.2}s`, transition: "height .3s" }} />
        ))}
      </span>
    </button>
  );
};
