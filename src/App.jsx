import { PopupWidget } from "react-calendly";
import "./App.css";
import insta from "./assets/insta.svg";
import facebook from "./assets/facebook.svg";

function App() {
  return (
    <div className="App">
      <div className="container">
        <div className="social-links">
          <a
            href="https://www.instagram.com/de_car_guy_puncham/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <img
              src={insta}
              height={"20px"}
              width={"20px"}
              alt="Instagram"
              className="social-icon"
            />
            <span>de_car_guy_puncham</span>
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
              height={"20px"}
              width={"20px"}
              alt="Instagram"
              className="social-icon"
            />
          </a>
        </div>
        <div className="calendar-container">
          <h1>PUNCHAM GIRDHAR</h1>
          <p className="subtitle">Plan your next car with me.</p>
          <PopupWidget
            url="https://calendly.com/punchamgirdhar91-zqft"
            rootElement={document.getElementById("root")}
            text="Let's meet"
            textColor="#ffffff"
            color="#3b82f6"
            position="relative"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
