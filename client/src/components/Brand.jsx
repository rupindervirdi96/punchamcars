/* Wordmark: PUNCHAM + a cobalt "CARS" plate */
export default function Brand({ onClick }) {
  return (
    <a
      href="/"
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className="group inline-flex items-center gap-1.5 font-display text-[15px] font-extrabold sm:text-[16px] uppercase leading-none tracking-tight font-wide"
      aria-label="Puncham Cars — home"
    >
      <span className="text-ink">Puncham</span>
      <span className="rounded-[4px] bg-accent px-1.5 py-1 text-white transition-transform duration-200 group-hover:-rotate-2">
        Cars
      </span>
    </a>
  );
}
