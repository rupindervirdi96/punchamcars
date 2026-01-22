import { PopupWidget } from "react-calendly";
import insta from "../assets/insta.svg";
import facebook from "../assets/facebook.svg";

function CalendlyPanel() {
  return (
    <div className="panel middle-panel">
      <div className="calendar-container">
        <div className="calendar-header">
          <div className="social-links calendar-social-links">
            <a
              href="https://www.instagram.com/punchamcars.ca/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <img
                src={insta}
                height="20"
                width="20"
                alt="Instagram"
                className="social-icon"
              />
              <span>punchamcars.ca</span>
            </a>
            <a
              href="https://www.facebook.com/punchams.posse.2025"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <span>Punchams Posse</span>
              <img
                src={facebook}
                height="20"
                width="20"
                alt="Facebook"
                className="social-icon"
              />
            </a>
          </div>
          <h1>PUNCHAM GIRDHAR</h1>
          <p className="subtitle calendar-subtitle">Finance Manager</p>
          <div className="calendar-contact-row">
            <a
              className="contact-pill"
              href="https://maps.google.com/?q=1330+Carling+Ave,+Ottawa,+ON+K1Z+6H2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact-value">1330 Carling Ave, Ottawa, ON K1Z 6H2</span>
            </a>
            <a className="contact-pill" href="tel:+13679943333">
              <span className="contact-value">+1 (367) 994-3333</span>
            </a>
          </div>
          <p className="subtitle plan-line">Plan your next car with me.</p>

          {/* <PopupWidget
            url="https://calendly.com/punchamgirdhar91-zqft"
            rootElement={document.getElementById("root")}
            text="Let's meet"
            textColor="#ffffff"
            color="#3b82f6"
            position="relative"
          /> */}
        </div>
        <div className="calendar-footer"></div>
      </div>
    </div>
  );
}

export default CalendlyPanel;
