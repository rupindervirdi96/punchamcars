import { useEffect, useState } from "react";
import useGeoapifyAutocomplete from "../hooks/useGeoapifyAutocomplete";

function DreamCarForm() {
  const [maxBudget, setMaxBudget] = useState(60000);
  const [yearFrom, setYearFrom] = useState(2018);
  const [yearTo, setYearTo] = useState(2024);
  const [creditScore, setCreditScore] = useState(720);
  const [showSuccess, setShowSuccess] = useState(false);
  const {
    address,
    setAddress,
    addressSuggestions,
    setAddressSuggestions,
    isAddressSearching,
    showAddressSuggestions,
    setShowAddressSuggestions,
  } = useGeoapifyAutocomplete("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    const submission = {
      name: form["client-name"].value.trim(),
      email: form["client-email"].value.trim(),
      phone: form["client-phone"].value.trim(),
      birthDate: {
        day: form["birth-day"].value,
        month: form["birth-month"].value,
        year: form["birth-year"].value,
      },
      address: (address || form["client-address"].value).trim(),
      maxBudget,
      yearFrom,
      yearTo,
      creditScore,
      extraDetails: form["extra-details"].value.trim(),
    };

    try {
      const res = await fetch("/api/dreamcar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });

      if (!res.ok) throw new Error("Failed");

      setShowSuccess(true);
      form.reset();
  setAddress("");
  setAddressSuggestions([]);
    } catch (err) {
      console.error(err);
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
            inputMode="numeric"
            maxLength={10}
            pattern="\d{10}"
            onChange={(e) => {
              e.target.value = e.target.value
                .replace(/\D/g, "")
                .slice(0, 10);
            }}
            required
          />
        </div>

        <div className="form-field full-width">
          <label className="form-label">Birthdate</label>
          <div className="birthdate-row">
            <div className="birthdate-column">
              <span className="birthdate-label">Day</span>
              <select
                id="birth-day"
                className="select-input"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  DD
                </option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div className="birthdate-column">
              <span className="birthdate-label">Month</span>
              <select
                id="birth-month"
                className="select-input"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  MM
                </option>
                <option value="1">Jan</option>
                <option value="2">Feb</option>
                <option value="3">Mar</option>
                <option value="4">Apr</option>
                <option value="5">May</option>
                <option value="6">Jun</option>
                <option value="7">Jul</option>
                <option value="8">Aug</option>
                <option value="9">Sep</option>
                <option value="10">Oct</option>
                <option value="11">Nov</option>
                <option value="12">Dec</option>
              </select>
            </div>
            <div className="birthdate-column">
              <span className="birthdate-label">Year</span>
              <select
                id="birth-year"
                className="select-input"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  YYYY
                </option>
                {Array.from(
                  { length: new Date().getFullYear() - 1940 + 1 },
                  (_, i) => 1940 + i
                )
                  .reverse()
                  .map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-field full-width">
          <label className="form-label" htmlFor="client-address">
            Address
          </label>
          <div className="address-autocomplete-wrapper">
            <input
              id="client-address"
              type="text"
              className="text-input"
              placeholder="Street, city, state"
              required
              autoComplete="off"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onFocus={() => {
                if (addressSuggestions.length > 0) {
                  setShowAddressSuggestions(true);
                }
              }}
            />
            {isAddressSearching && (
              <div className="address-loading-indicator" aria-hidden="true" />
            )}
            {(showAddressSuggestions &&
              (addressSuggestions.length > 0 || isAddressSearching)) && (
              <div className="address-suggestions">
                {isAddressSearching && (
                  <div className="address-suggestion-item address-suggestion-loading">
			            Searching addresses...
                  </div>
                )}
                {addressSuggestions.map((suggestion) => (
                  <button
                    type="button"
                    key={suggestion.id}
                    className="address-suggestion-item"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setAddress(suggestion.formatted);
                      setShowAddressSuggestions(false);
                      setAddressSuggestions([]);
                    }}
                  >
                    <div className="address-suggestion-primary">
                      {suggestion.primary}
                    </div>
                    {suggestion.secondary && (
                      <div className="address-suggestion-secondary">
                        {suggestion.secondary}
                      </div>
                    )}
                  </button>
                ))}
                <div className="address-suggestions-footer">
                  Powered by Geoapify &amp; OpenStreetMap
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="form-field full-width">
          <label className="form-label" htmlFor="max-budget">
            Max budget
          </label>
          <div className="range-wrapper">
            <span className="range-value">${maxBudget.toLocaleString()}</span>
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
              Thanks! I&apos;ll use these details to match you with the right
              car.
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
