import CarCard from "./CarCard";

/* ─── Arrow icon ─────────────────────────────────────────────── */
const ArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

/* ─── Inventory view ─────────────────────────────────────────── */
function InventoryView({ cars, onBack }) {
  return (
    <div className="min-h-screen w-full bg-[linear-gradient(135deg,#1a1a4e_0%,#0f0f2d_40%,#0a0a1a_100%)]
      font-ui flex flex-col">

      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-[rgba(10,10,26,0.85)] backdrop-blur-md
        border-b border-white/10 px-4 md:px-8 py-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-300 hover:text-white
            transition-colors bg-white/5 hover:bg-white/10 border border-white/10
            rounded-full px-4 py-2"
        >
          <ArrowLeft />
          Back
        </button>
        <div>
          <h1 className="text-white font-bold text-lg leading-none">Inventory</h1>
          <p className="text-slate-400 text-xs mt-0.5">{cars.length} vehicles available</p>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 px-4 md:px-8 py-6 max-w-[1200px] mx-auto w-full">
        {cars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500">
            <p className="text-lg font-medium">No vehicles available right now.</p>
            <p className="text-sm mt-1">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cars.map((car, i) => (
              <CarCard key={i} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default InventoryView;
