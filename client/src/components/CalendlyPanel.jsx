import insta from "../assets/insta.svg";
import facebook from "../assets/facebook.svg";

const pillClass =
  "flex flex-col items-center gap-1 py-0.5 px-[14px] rounded-[2px]" +
  " bg-[linear-gradient(145deg,rgba(15,23,42,0.95),rgba(30,64,175,0.18))]" +
  " border border-[rgba(148,163,184,0.45)] text-[#e2e8f0] text-sm no-underline text-center" +
  " shadow-[0_12px_28px_rgba(15,23,42,0.45)] transition-all duration-200" +
  " hover:-translate-y-0.5 hover:border-[rgba(129,140,248,0.9)] hover:shadow-[0_18px_32px_rgba(30,64,175,0.4)]";

function CalendlyPanel() {
  return (
    <div className="panel flex-1 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.9)_0%,rgba(15,23,42,0.7)_45%,rgba(15,23,42,0.4)_100%)] rounded-[20px] shadow-[0_22px_70px_rgba(0,0,0,0.85)] p-[18px_16px] text-gray-200 backdrop-blur-md">
      <div className="calendar-container bg-[linear-gradient(145deg,#020617_0%,#111827_45%,#1d4ed8_100%)] rounded-[22px] shadow-[0_26px_80px_rgba(15,23,42,0.9)] py-9 text-center w-full animate-slide-up flex flex-col items-stretch justify-center">
        <div className="flex flex-col items-center w-full">
          <div className="flex justify-between w-full mb-[18px]">
            <a
              href="https://www.instagram.com/punchamcars.ca/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-[5px] text-white no-underline whitespace-nowrap text-[13px] transition-transform duration-300 hover:-translate-y-0.5"
            >
              <img src={insta} height="20" width="20" alt="Instagram" />
              <span>punchamcars.ca</span>
            </a>
            <a
              href="https://www.facebook.com/punchams.posse.2025"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-[5px] text-white no-underline whitespace-nowrap text-[13px] transition-transform duration-300 hover:-translate-y-0.5"
            >
              <span>Punchams Posse</span>
              <img src={facebook} height="20" width="20" alt="Facebook" />
            </a>
          </div>

          <h1 className="text-white text-[24px] tracking-[0.08em] mb-[10px] font-bold">
            PUNCHAMCARS.CA
          </h1>
          <p className="uppercase tracking-[0.18em] text-xs font-semibold text-[rgba(226,232,240,0.9)] mb-[10px]">
            Finance Manager
          </p>

          <div className="flex flex-wrap items-center justify-center gap-[14px] mt-[10px] mb-[18px]">
            <a
              className={pillClass + " !flex-row items-center gap-[6px] rounded-lg"}
              href="https://maps.google.com/?q=1330+Carling+Ave,+Ottawa,+ON+K1Z+6H2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
              </svg>
              <span className="text-sm font-semibold text-slate-50 leading-[1.4]">
                Meet in person
              </span>
            </a>
            <a
              className={pillClass + " !flex-row items-center gap-[6px] rounded-lg"}
              href="tel:+13679943333"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.24 1.01l-2.21 2.2z" />
              </svg>
              <span className="text-sm font-semibold text-slate-50 leading-[1.4]">
                Let's talk
              </span>
            </a>
          </div>
        </div>
        <div />
      </div>
    </div>
  );
}

export default CalendlyPanel;
