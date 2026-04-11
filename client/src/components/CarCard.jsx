import { useState, useCallback, useEffect, useRef } from "react";

/* ─── tiny SVG icons ─────────────────────────────────────────── */
const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

/* ─── Carfax badge ───────────────────────────────────────────── */
function CarfaxBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold
      bg-emerald-500/20 text-emerald-300 border border-emerald-500/30
      rounded-full px-3 py-1 whitespace-nowrap">
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
        <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm11.03-2.47a.75.75 0 0 1 0 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0l-1.5-1.5a.75.75 0 1 1 1.06-1.06l.97.97 2.97-2.97a.75.75 0 0 1 1.06 0Z" />
      </svg>
      Carfax Verified
    </span>
  );
}

/* ─── Info pill ──────────────────────────────────────────────── */
function InfoPill({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-300
      bg-white/5 border border-white/10 rounded-full px-3 py-1.5 whitespace-nowrap">
      {icon}
      {label}
    </span>
  );
}

/* ─── Car card with infinite-clone carousel ─────────────────── */
export default function CarCard({ car }) {
  const photos = car.Photos || [];
  const total = photos.length;

  /*
   * Infinite-clone approach:
   * Extended strip = [clone_of_last, ...photos, clone_of_first]
   * vIndex 1..total = real slides; 0 = clone of last; total+1 = clone of first.
   * After animating into a clone we silently snap to its real counterpart
   * so the user never sees any slide rearranging.
   */
  const [vIndex, setVIndex] = useState(1);
  const [skipTransition, setSkipTransition] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const snapPending = useRef(false);
  const touchStartX = useRef(null);

  // Real 0-based index for dots / counter
  const realIndex = total > 1 ? ((vIndex - 1 + total) % total) : 0;

  // Extended slide list (clones only needed when total > 1)
  const slides = total > 1
    ? [photos[total - 1], ...photos, photos[0]]
    : photos;

  const prev = useCallback((e) => {
    e.stopPropagation();
    if (!snapPending.current) setVIndex((v) => v - 1);
  }, []);

  const next = useCallback((e) => {
    e.stopPropagation();
    if (!snapPending.current) setVIndex((v) => v + 1);
  }, []);

  const onTouchStart = useCallback((e) => {
    if (total <= 1) return;
    touchStartX.current = e.touches[0].clientX;
  }, [total]);

  const onTouchMove = useCallback((e) => {
    if (touchStartX.current === null || snapPending.current) return;
    setDragOffset(e.touches[0].clientX - touchStartX.current);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (touchStartX.current === null) return;
    const delta = dragOffset;
    setDragOffset(0);
    touchStartX.current = null;
    if (snapPending.current) return;
    if (delta < -50)       setVIndex((v) => v + 1);
    else if (delta > 50)   setVIndex((v) => v - 1);
  }, [dragOffset]);

  // When we land on a clone, wait for the animation then snap silently
  useEffect(() => {
    if (total <= 1) return;
    if (vIndex === 0 || vIndex === total + 1) {
      const snapTo = vIndex === 0 ? total : 1;
      snapPending.current = true;
      const id = setTimeout(() => {
        setSkipTransition(true);
        setVIndex(snapTo);
        snapPending.current = false;
      }, 320); // slightly longer than the 300 ms animation
      return () => clearTimeout(id);
    }
  }, [vIndex, total]);

  // Re-enable transition one frame after the instant snap render
  useEffect(() => {
    if (!skipTransition) return;
    const id = requestAnimationFrame(() => setSkipTransition(false));
    return () => cancelAnimationFrame(id);
  }, [skipTransition]);

  return (
    <div className="rounded-2xl overflow-hidden bg-[rgba(15,23,42,0.75)] border border-white/10
      shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-sm flex flex-col
      transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)]">

      {/* ── Carousel ──────────────────────────────────────────── */}
      <div
        className="relative w-full aspect-[4/3] bg-black select-none overflow-x-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Slides — centre is 84 % wide; 8 % peek strips on each side */}
        {slides.map((src, i) => {
          const offset = i - vIndex;
          return (
            <div
              key={i}
              className="absolute top-0 h-full"
              style={{
                width: "84%",
                left: "8%",
                transform: `translateX(calc(${offset} * (100% + 8px) + ${dragOffset}px))`,
                transition: (dragOffset !== 0 || skipTransition) ? "none" : "transform 300ms ease-in-out",
              }}
            >
              <img
                src={src}
                alt={`${car.Brand} ${car.Model} — photo ${i + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          );
        })}

        {/* Prev / Next — full-height tap zones over the peek strips
            hidden on mobile (touch users swipe), visible sm+ */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-0 top-0 bottom-0 w-[8%] z-10
                hidden sm:flex items-center justify-center
                bg-gradient-to-r from-black/50 to-transparent
                text-white hover:from-black/70 transition-colors"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={next}
              aria-label="Next photo"
              className="absolute right-0 top-0 bottom-0 w-[8%] z-10
                hidden sm:flex items-center justify-center
                bg-gradient-to-l from-black/50 to-transparent
                text-white hover:from-black/70 transition-colors"
            >
              <ChevronRight />
            </button>
          </>
        )}

        {/* Dot indicators — scoped to the 84 % slide width */}
        {total > 1 && (
          <div className="flex w-[84%] justify-between absolute -bottom-2 left-[8%] z-10 gap-1">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setVIndex(i + 1); }}
                aria-label={`Photo ${i + 1}`}
                className={`flex-1 h-1.5 rounded-full transition-all duration-200
                  ${i === realIndex
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/75"}`}
              />
            ))}
          </div>
        )}

        {/* Photo counter badge */}
        {total > 1 && (
          <span className="absolute top-2 right-[calc(8%+8px)] text-[11px] font-medium
            bg-black/60 text-white rounded-full px-2 py-0.5 backdrop-blur-sm z-10">
            {realIndex + 1}/{total}
          </span>
        )}
      </div>

      {/* ── Card body ─────────────────────────────────────────── */}
      <div className="p-4 flex flex-col gap-3 flex-1 mt-2">
        {/* Info pills row */}
        <div className="flex flex-wrap gap-2">
          {/* Mileage */}
          <InfoPill
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            }
            label={`${car.Mileage.toLocaleString()} km`}
          />
          {/* Transmission */}
          <InfoPill
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <rect x="3" y="3" width="4" height="4" rx="1" />
                <rect x="10" y="3" width="4" height="4" rx="1" />
                <rect x="17" y="3" width="4" height="4" rx="1" />
                <rect x="10" y="10" width="4" height="4" rx="1" />
                <rect x="10" y="17" width="4" height="4" rx="1" />
                <line x1="12" y1="7" x2="12" y2="10" />
                <line x1="5" y1="7" x2="12" y2="10" />
                <line x1="19" y1="7" x2="12" y2="10" />
                <line x1="12" y1="14" x2="12" y2="17" />
              </svg>
            }
            label={car.Transmission}
          />
          {/* Year */}
          <InfoPill
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            }
            label={String(car.Year)}
          />
          {/* Price */}
          <InfoPill
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            }
            label={`$${car.Price.toLocaleString()}`}
          />
        </div>

        {/* Car name + carfax row */}
        <div className="flex items-end justify-between gap-2 mt-auto">
          <div>
            <p className="text-white font-semibold text-base leading-snug">
              {car.Year} {car.Brand} {car.Model}
            </p>
            <p className="text-slate-400 text-xs mt-0.5">{car.BodyType}</p>
          </div>
          {car.CarfaxVerified && <CarfaxBadge />}
        </div>
      </div>
    </div>
  );
}
