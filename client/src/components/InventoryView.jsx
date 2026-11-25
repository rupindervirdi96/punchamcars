import { useMemo, useState } from "react";
import CarCard from "./CarCard";
import useNolocoVehicles from "../hooks/useNolocoVehicles";
import Brand from "./Brand";
import { VehicleIcon } from "./VehicleIcons";

/* ─── Arrow icon ─────────────────────────────────────────────── */
const ArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

/* ─── Select component ───────────────────────────────────────── */
function FilterSelect({ id, label, value, onChange, options, disabled, placeholder }) {
  return (
    <div className="min-w-[150px] flex-1 sm:flex-none">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full cursor-pointer rounded-full border border-line bg-surface px-4 py-2.5 text-[15px]
          text-ink transition-[border-color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50
          focus:border-accent focus:outline-none focus:shadow-[0_0_0_4px_rgba(36,69,255,0.12)]"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

/* ─── Inventory view ─────────────────────────────────────────── */
function InventoryView({ onBack }) {
  const { vehicles, loading, error } = useNolocoVehicles();

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [mustHavePhotos, setMustHavePhotos] = useState(false);

  /* Derived brand list */
  const brands = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.make).filter(Boolean))).sort(),
    [vehicles]
  );

  /* Derived model list for the selected brand */
  const models = useMemo(() => {
    if (!selectedBrand) return [];
    return Array.from(
      new Set(
        vehicles.filter((v) => v.make === selectedBrand).map((v) => v.model).filter(Boolean)
      )
    ).sort();
  }, [vehicles, selectedBrand]);

  /* Filtered car list */
  const filteredCars = useMemo(() => {
    let list = vehicles;
    if (selectedBrand) list = list.filter((v) => v.make === selectedBrand);
    if (selectedModel) list = list.filter((v) => v.model === selectedModel);
    if (mustHavePhotos) list = list.filter((v) => v.googleDriveFolder || v.googlePhotosAlbumIdVal);
    return list;
  }, [vehicles, selectedBrand, selectedModel, mustHavePhotos]);

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
    setSelectedModel(""); // reset model when brand changes
  };

  /* Status message */
  const statusText = useMemo(() => {
    if (loading) return "Loading inventory…";
    if (error) return `Error: ${error}`;
    if (!selectedBrand) return `${vehicles.length} vehicles loaded — select a brand to filter.`;
    if (!selectedModel) return `${filteredCars.length} ${selectedBrand} models available — pick a model.`;
    return `${filteredCars.length} vehicle${filteredCars.length !== 1 ? "s" : ""} matching ${selectedBrand} ${selectedModel}`;
  }, [loading, error, vehicles.length, selectedBrand, selectedModel, filteredCars.length]);

  /* Decide whether to show the grid */
  const showGrid = !loading && !error && selectedBrand && selectedModel;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
        <Brand onClick={onBack} />
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-[15px] font-medium text-ink transition-colors hover:border-ink/25"
        >
          <ArrowLeft />
          Back
        </button>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-20 pt-4 md:px-8 md:pt-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-[clamp(2rem,5vw,3rem)] font-semibold leading-tight tracking-[-0.025em] text-ink">Inventory</h1>
            <p className="mt-1 text-[15px] text-muted" aria-live="polite">{statusText}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <FilterSelect
              id="brand-filter"
              label="Make"
              value={selectedBrand}
              onChange={handleBrandChange}
              options={brands}
              disabled={loading || !!error}
              placeholder="Make"
            />
            <FilterSelect
              id="model-filter"
              label="Model"
              value={selectedModel}
              onChange={setSelectedModel}
              options={models}
              disabled={!selectedBrand}
              placeholder="Model"
            />
            <button
              type="button"
              role="switch"
              aria-checked={mustHavePhotos}
              onClick={() => setMustHavePhotos((p) => !p)}
              className="flex select-none items-center gap-2.5 px-1 py-2"
            >
              <span className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${mustHavePhotos ? "bg-accent" : "bg-line"}`}>
                <span
                  className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                    mustHavePhotos ? "translate-x-5" : ""
                  }`}
                />
              </span>
              <span className="text-[14px] text-ink">With photos</span>
            </button>
          </div>
        </div>

        <div className="mt-10">
          {loading && (
            <div className="flex items-center justify-center gap-3 py-24 text-muted">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-accent" />
              <span className="text-[15px]">Loading…</span>
            </div>
          )}

          {!loading && error && <EmptyState title="Couldn't load the inventory" text={error} tone="error" />}

          {!loading && !error && !showGrid && (
            <EmptyState title={selectedBrand ? "Now pick a model" : "Pick a make to start"} />
          )}

          {showGrid && filteredCars.length === 0 && (
            <EmptyState title="No matches" text="Try another model or turn off “With photos”." />
          )}

          {showGrid && filteredCars.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCars.map((car) => (
                <CarCard key={car.uuid || car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function EmptyState({ title, text, tone }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-line py-20 text-center">
      <VehicleIcon type="Sedan" wheelFill="#F5F3EE" className={`h-12 w-32 ${tone === "error" ? "text-red-400" : "text-line"}`} />
      <p className={`mt-5 text-[18px] font-semibold ${tone === "error" ? "text-red-700" : "text-ink"}`}>{title}</p>
      {text && <p className="mt-1 max-w-sm text-[14px] text-muted">{text}</p>}
    </div>
  );
}

export default InventoryView;
