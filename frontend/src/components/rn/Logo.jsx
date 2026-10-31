export const Ears = ({ className = "" }) => (
  <svg viewBox="0 0 40 30" className={className} fill="none" aria-hidden="true">
    <path d="M15 28C11 19 9 6 13 2c4-2 6 10 6 25M25 28c4-9 6-22 2-26-4-2-6 10-6 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const TopHat = ({ className = "" }) => (
  <svg viewBox="0 0 120 90" className={className} aria-hidden="true">
    <path d="M30 8c10-5 50-5 60 0l-4 58H34z" fill="#f5eedd" />
    <path d="M33 46h54l-1 12H34z" fill="#1c1613" />
    <rect x="66" y="22" width="16" height="20" rx="1" fill="#f5eedd" stroke="#1c1613" strokeWidth="1.6" transform="rotate(8 74 32)" />
    <text x="68" y="36" fontSize="8" fontFamily="serif" fill="#1c1613" transform="rotate(8 74 32)">10/6</text>
    <path d="M8 70c18 14 86 14 104 0-6 12-98 12-104 0z" fill="#f5eedd" />
    <ellipse cx="60" cy="68" rx="48" ry="8" fill="#f5eedd" />
  </svg>
);

export const Logo = ({ size = "md", testId }) => {
  const big = size === "md";
  return (
    <a href="#top" data-testid={testId} className="group relative inline-flex flex-col items-center leading-none text-[var(--cream)]">
      <Ears className={`${big ? "w-8 -mb-2" : "w-6 -mb-1.5"} transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-6deg]`} />
      <span className={`font-display font-bold ${big ? "text-[1.7rem]" : "text-[1.35rem]"} tracking-tight`}>Кроличья</span>
      <span className={`font-display font-bold ${big ? "text-[1.7rem]" : "text-[1.35rem]"} -mt-1`}>Нора</span>
      <span className="mt-1 text-[0.55rem] tracking-[0.5em] font-serif-rn font-bold">ЛОФТ</span>
    </a>
  );
};
