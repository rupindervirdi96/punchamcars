import { useEffect, useState } from "react";

function DreamCarForm() {
  const [maxBudget, setMaxBudget] = useState(60000);
  const [yearFrom, setYearFrom] = useState(2018);
  const [yearTo, setYearTo] = useState(2024);
  const [creditScore, setCreditScore] = useState(720);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form["client-name"].value.trim();
    const email = form["client-email"].value.trim();
    const phone = form["client-phone"].value.trim();
    const extraDetails = form["extra-details"].value.trim();

    if (!name || !email || !phone) {
      // Basic guard to ensure the main fields are filled.
      // You can replace this with your own UI/validation later.
      alert("Please fill in your name, email and phone.");
      return;
    }

    const submission = {
      name,
      email,
      phone,
      maxBudget,
      yearFrom,
      yearTo,
      creditScore,
      extraDetails,
    };

    try {
      const response = await fetch("/api/dreamcar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submission),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setShowSuccess(true);
      form.reset();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error submitting dream car form", error);
      alert("Could not send your preferences. Please try again.");
    }
  };

  useEffect(() => {
    if (!showSuccess) return undefined;
    const timer = setTimeout(() => setShowSuccess(false), 3000);
    return () => clearTimeout(timer);
  }, [showSuccess]);

  return (
    <div className="panel left-panel">
      <h2>Tell me about your dream car</h2>
      <p className="panel-subtitle">
        Share a few quick details so I can match you with the right car.
      </p>
      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-field full-width">
          <label className="form-label" htmlFor="client-name">
            Name
          </label>
          <input
            id="client-name"
            type="text"
            className="text-input"
            placeholder="Your full name"
            required
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="client-email">
            Email
          </label>
          <input
            id="client-email"
            type="email"
            className="text-input"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="client-phone">
            Phone
          </label>
          <input
            id="client-phone"
            type="tel"
            className="text-input"
            placeholder="Mobile or WhatsApp number"
            required
          />
        </div>

        <div className="form-field full-width">
          <label className="form-label" htmlFor="max-budget">
            Max budget
          </label>
          <div className="range-wrapper">
            <span className="range-value">
              ${maxBudget.toLocaleString()}
            </span>
            <input
              id="max-budget"
              type="range"
              min="10000"
              max="200000"
              step="1000"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="range-input"
            />
            <div className="range-scale">
              <span>$10k</span>
              <span>$200k+</span>
            </div>
          </div>
        </div>

        <div className="form-field full-width">
          <label className="form-label">Preferred year range</label>
          <div className="year-range-row">
            <div className="year-range-column">
              <div className="range-header">
                <span className="range-label">From</span>
                <span className="range-value">{yearFrom}</span>
              </div>
              <input
                type="range"
                min="2005"
                max="2025"
                value={yearFrom}
                onChange={(e) => setYearFrom(Number(e.target.value))}
                className="range-input"
              />
            </div>
            <div className="year-range-column">
              <div className="range-header">
                <span className="range-label">To</span>
                <span className="range-value">{yearTo}</span>
              </div>
              <input
                type="range"
                min="2005"
                max="2025"
                value={yearTo}
                onChange={(e) => setYearTo(Number(e.target.value))}
                className="range-input"
              />
            </div>
          </div>
        </div>

        <div className="form-field full-width">
          <label className="form-label" htmlFor="credit-score">
            Credit score (approx.)
          </label>
          <div className="range-wrapper">
            <span className="range-value">{creditScore}</span>
            <input
              id="credit-score"
              type="range"
              min="300"
              max="900"
              step="10"
              value={creditScore}
              onChange={(e) => setCreditScore(Number(e.target.value))}
              className="range-input"
            />
            <div className="range-scale">
              <span>300</span>
              <span>900</span>
            </div>
          </div>
        </div>

        <div className="form-field full-width">
          <label className="form-label" htmlFor="extra-details">
            Any extra details
          </label>
          <textarea
            id="extra-details"
            className="textarea-input"
            rows={3}
            placeholder="Tell me about colours, features, or anything else that matters to you."
          />
        </div>

        <button type="submit" className="primary-button">
          Share my preferences
        </button>
      </form>
      {showSuccess && (
        <div
          className="form-success-overlay"
          onClick={() => setShowSuccess(false)}
        >
          <div
            className="form-success-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="form-success-icon">✓</div>
            <h3 className="form-success-title">Preferences saved</h3>
            <p className="form-success-message">
              Thanks! I&apos;ll use these details to match you with the right car.
            </p>
            <button
              type="button"
              className="form-success-button"
              onClick={() => setShowSuccess(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DreamCarForm;
