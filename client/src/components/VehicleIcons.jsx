/* Side-profile vehicle silhouettes (stroke icons, 120×48 viewBox) */

const BODIES = {
  Sedan:
    "M8 36 V31 Q8 27 14 26 L32 24 L44 14 Q47 12 52 12 H74 Q79 12 83 15 L94 24 L108 26 Q113 27 113 32 V36 Z",
  SUV: "M8 36 V26 Q8 22 13 21 L24 20 L32 10 Q34 8 38 8 H92 Q97 8 99 12 L104 20 Q112 21 113 26 V36 Z",
  Truck:
    "M8 36 V27 Q8 23 13 22 L22 21 L30 11 Q32 9 36 9 H58 Q61 9 61 12 V22 H110 Q113 22 113 25 V36 Z",
  Coupe:
    "M8 36 V31 Q8 28 14 27 L34 25 L50 15 Q54 13 60 13 H70 Q76 13 82 17 L100 26 L109 27 Q113 28 113 32 V36 Z",
};

const WINDOWS = {
  Sedan: "M36 24 L46 15.5 H61 V24 Z M65 24 V15.5 H74 Q78 15.5 81 18 L87 24 Z",
  SUV: "M30 20 L36 12 H58 V20 Z M62 20 V12 H90 Q93 12 95 15 L98 20 Z",
  Truck: "M27 21 L34 13 H56 V21 Z",
  Coupe: "M40 25 L52 17.5 H64 V25 Z M68 25 V17.5 H70 Q75 17.5 80 20 L88 25 Z",
};

export function VehicleIcon({ type, className = "", wheelFill = "#FFFFFF" }) {
  const body = BODIES[type] || BODIES.Sedan;
  return (
    <svg
      viewBox="0 0 120 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d={body} />
      {WINDOWS[type] && <path d={WINDOWS[type]} strokeWidth="1.5" opacity="0.7" />}
      <circle cx="30" cy="36" r="7" fill={wheelFill} />
      <circle cx="30" cy="36" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="92" cy="36" r="7" fill={wheelFill} />
      <circle cx="92" cy="36" r="2.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* Tiny solid car used as the progress marker and in the road band */
export function MiniCar({ className = "" }) {
  return (
    <svg viewBox="0 0 40 18" className={className} aria-hidden="true">
      <path
        d="M2 13 V10.5 Q2 8.6 4.6 8.2 L10 7.6 L14.4 3.2 Q15.4 2.2 17 2.2 H25.4 Q27 2.2 28.2 3.4 L32 7.4 L36.2 8.1 Q38 8.5 38 10.4 V13 Z"
        fill="currentColor"
      />
      <path d="M15.6 7.4 L17.6 4.4 H21.2 V7.4 Z M22.8 7.4 V4.4 H25.2 Q26.2 4.4 26.9 5.1 L29 7.4 Z" fill="#FFFFFF" opacity="0.7" />
      <circle cx="10.5" cy="13.4" r="3.2" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="30" cy="13.4" r="3.2" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export const VEHICLE_TYPES = Object.keys(BODIES);
