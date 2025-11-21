import { PopupWidget } from "react-calendly";
import "./App.css";
import insta from "./assets/insta.svg";

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
            <img src={insta} alt="Instagram" className="social-icon" />
            de_car_guy_puncham
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            Facebook
            <img src={insta} alt="Instagram" className="social-icon" />
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
