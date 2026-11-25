import DreamCarForm from "./DreamCarForm";
import Brand from "./Brand";
import { SITE } from "../siteInfo";

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.24 1.01l-2.21 2.2z" />
  </svg>
);

function SiteHeader({ onInventory }) {
  return (
    <header className="mx-auto flex h-20 w-full max-w-5xl items-center justify-between gap-4 px-5 md:px-8">
      <Brand />
      <nav className="flex items-center gap-1 text-[15px] font-medium sm:gap-6">
        {SITE.showInventory && (
          <button type="button" onClick={onInventory} className="rounded-full px-2 py-2 text-muted transition-colors hover:text-ink sm:px-3">
            Inventory
          </button>
        )}
        <a
          href={SITE.phoneHref}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-3 text-ink sm:px-4 transition-colors hover:border-ink/25"
        >
          <PhoneIcon />
          <span className="hidden tabular-nums sm:inline">{SITE.phoneDisplay}</span>
          <span className="sr-only sm:hidden">Call</span>
        </a>
      </nav>
    </header>
  );
}

function Steps() {
  const steps = ["Answer a few questions", "We find your options", "Pick up your keys"];
  return (
    <ol className="mx-auto mt-10 hidden max-w-2xl items-center justify-center gap-8 text-[14px] text-muted sm:flex">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-2.5">
          <span className="grid h-6 w-6 place-items-center rounded-full border border-line bg-surface text-[12px] font-semibold text-ink">
            {i + 1}
          </span>
          {s}
        </li>
      ))}
    </ol>
  );
}

function Footer() {
  const links = [
    { label: `${SITE.addressLine1}, Ottawa`, href: SITE.mapsUrl },
    { label: "WhatsApp", href: `https://wa.me/${SITE.whatsappNumber}` },
    { label: "Instagram", href: SITE.instagramUrl },
    { label: "Facebook", href: SITE.facebookUrl },
  ];
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 py-8 text-[14px] text-muted md:flex-row md:px-8">
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>
        <p>© {new Date().getFullYear()} {SITE.name}</p>
      </div>
    </footer>
  );
}

export default function Home({ onInventory }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader onInventory={onInventory} />

      <main className="flex-1 px-5 pb-20 pt-6 md:px-8 md:pt-12">
        <div className="mx-auto max-w-2xl animate-rise-in text-center">
          <h1 className="text-[clamp(2.1rem,6vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.025em] text-ink">
            Your next car starts here.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[17px] leading-relaxed text-muted">
            A few quick questions, then we call you with options that fit your budget.
          </p>
        </div>

        <div id="apply" className="mx-auto mt-10 max-w-2xl animate-rise-in [animation-delay:120ms]">
          <DreamCarForm />
        </div>

        <Steps />
      </main>

      <Footer />
    </div>
  );
}
