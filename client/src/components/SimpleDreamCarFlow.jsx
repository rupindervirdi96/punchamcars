import { useMemo, useState } from "react";
import useGeoapifyAutocomplete from "../hooks/useGeoapifyAutocomplete";

const VEHICLE_OPTIONS = ["Sedan", "SUV", "Truck", "Coupe"];
const CREDIT_OPTIONS = [
  "Excellent",
  "Good",
  "Fair",
  "Poor",
  "Not sure",
];
const EMPLOYMENT_OPTIONS = [
  "Employed full-time",
  "Employed part-time",
  "Self-employed",
  "Student",
  "Other",
];
const BUDGET_OPTIONS = [
  "$100 - $250",
  "$251 - $400",
  "$401 - $600",
  "$601 - $800",
  "$801 - $1,000",
];
const INCOME_OPTIONS = [
  "$1,000 - $2,500 / month",
  "$2,501 - $4,000 / month",
  "$4,001 - $6,000 / month",
  "$6,001+ / month",
  "Prefer not to say",
];
const LIVING_DURATION_OPTIONS = [
  "Less than 1 year",
  "1 - 2 years",
  "3 - 5 years",
  "6+ years",
];

const buildWhatsappMessage = (submission) => {
  const birthDate = submission.birthDate?.day
    ? `${submission.birthDate.day}/${submission.birthDate.month}/${submission.birthDate.year}`
    : "";

  const addressLine = submission.address
    ? `${submission.address}${submission.apartment ? `, ${submission.apartment}` : ""}`
    : "";

  return [
    "Hi! I just completed the Punchamcars.ca questionnaire.",
    "",
    `Name: ${submission.firstName || ""} ${submission.lastName || ""}`.trim(),
    `Email: ${submission.email || ""}`,
    `Phone: ${submission.phone || ""}`,
    `Vehicle type: ${submission.vehicleType || ""}`,
    `Birthdate: ${birthDate}`,
    `Credit: ${submission.creditStatus || ""}`,
    `Employment: ${submission.employmentStatus || ""}`,
    `Biweekly budget: ${submission.biweeklyBudgetRange || ""}`,
    `Income: ${submission.incomeRange || ""}`,
    `Address: ${addressLine}`,
    `Time at address: ${submission.livingDuration || ""}`,
    "",
    "Please let me know the next steps.",
  ]
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");
};

function SimpleDreamCarFlow() {
  const [stepIndex, setStepIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [formState, setFormState] = useState({
    vehicleType: "",
    birthDate: { day: "", month: "", year: "" },
    creditStatus: "",
    employmentStatus: "",
    biweeklyBudgetRange: "",
    incomeRange: "",
    address: "",
    apartment: "",
    livingDuration: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const {
    address,
    setAddress,
    addressSuggestions,
    setAddressSuggestions,
    isAddressSearching,
    showAddressSuggestions,
    setShowAddressSuggestions,
  } = useGeoapifyAutocomplete("");

  const steps = useMemo(
    () => [
      {
        id: "vehicleType",
        title: "What kind of vehicle are you after today?",
        type: "options",
        options: VEHICLE_OPTIONS,
      },
      {
        id: "birthDate",
        title: "What’s your birthdate?",
        type: "birthDate",
      },
      {
        id: "creditStatus",
        title: "How would you describe your credit right now?",
        type: "options",
        options: CREDIT_OPTIONS,
      },
      {
        id: "employmentStatus",
        title: "What’s your employment status?",
        type: "options",
        options: EMPLOYMENT_OPTIONS,
      },
      {
        id: "biweeklyBudgetRange",
        title: "Roughly, what’s your biweekly budget?",
        type: "options",
        options: BUDGET_OPTIONS,
      },
      {
        id: "incomeRange",
        title: "Which range best fits your monthly income?",
        type: "options",
        options: INCOME_OPTIONS,
      },
      {
        id: "address",
        title: "What’s your current address?",
        type: "address",
      },
      {
        id: "livingDuration",
        title: "How long have you been there?",
        type: "options",
        options: LIVING_DURATION_OPTIONS,
      },
      {
        id: "name",
        title: "What’s your name?",
        type: "name",
      },
      {
        id: "email",
        title: "What’s the best email for you?",
        type: "email",
      },
      {
        id: "phone",
        title: "What’s the best phone number to reach you?",
        type: "phone",
      },
    ],
    []
  );

  const totalSteps = steps.length;
  const currentStep = steps[stepIndex];

  const updateField = (key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const updateBirthDate = (key, value) => {
    setFormState((prev) => ({
      ...prev,
      birthDate: { ...prev.birthDate, [key]: value },
    }));
  };

  const isStepComplete = (step) => {
    switch (step.id) {
      case "vehicleType":
        return Boolean(formState.vehicleType);
      case "birthDate":
        return (
          Boolean(formState.birthDate.day) &&
          Boolean(formState.birthDate.month) &&
          Boolean(formState.birthDate.year)
        );
      case "creditStatus":
        return Boolean(formState.creditStatus);
      case "employmentStatus":
        return Boolean(formState.employmentStatus);
      case "biweeklyBudgetRange":
        return Boolean(formState.biweeklyBudgetRange);
      case "incomeRange":
        return Boolean(formState.incomeRange);
      case "address":
        return Boolean((address || formState.address || "").trim());
      case "livingDuration":
        return Boolean(formState.livingDuration);
      case "name":
        return Boolean(formState.firstName.trim() && formState.lastName.trim());
      case "email":
        return Boolean(formState.email.trim());
      case "phone":
        return Boolean(formState.phone.trim().length >= 10);
      default:
        return false;
    }
  };

  const canGoNext = isStepComplete(currentStep);

  const goNext = () => {
    if (!canGoNext) return;
    if (stepIndex < totalSteps - 1) {
      setStepIndex((prev) => prev + 1);
    }
  };

  const goBack = () => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    }
  };

  const handleOptionSelect = (stepId, option) => {
    updateField(stepId, option);
    if (stepIndex < totalSteps - 1) {
      setStepIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    const submission = {
      ...formState,
      address: (address || formState.address || "").trim(),
    };

    try {
      const res = await fetch("/api/dreamcar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });

      if (!res.ok) throw new Error("Failed");

      setWhatsappMessage(buildWhatsappMessage(submission));
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Could not send your preferences. Please try again.");
    }
  };

  const handleReset = () => {
    setFormState({
      vehicleType: "",
      birthDate: { day: "", month: "", year: "" },
      creditStatus: "",
      employmentStatus: "",
      biweeklyBudgetRange: "",
      incomeRange: "",
      address: "",
      apartment: "",
      livingDuration: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    });
    setAddress("");
    setAddressSuggestions([]);
    setShowAddressSuggestions(false);
    setStepIndex(0);
    setShowSuccess(false);
  };

  return (
    <div className="simple-flow">
      <div className="simple-progress">
        {steps.map((step, index) => {
          const isActive = index === stepIndex;
          const isDone = isStepComplete(step);
          return (
            <button
              key={step.id}
              type="button"
              className={`simple-progress-dot${isActive ? " active" : ""}${isDone ? " done" : ""}`}
              onClick={() => {
                if (index <= stepIndex) {
                  setStepIndex(index);
                }
              }}
              aria-label={`Go to step ${index + 1}`}
            />
          );
        })}
      </div>

      <div className="simple-card">
        <div className="simple-step-count">
          Step {stepIndex + 1} of {totalSteps}
        </div>
        <h2 className="simple-question">{currentStep.title}</h2>

        {currentStep.type === "options" && (
          <div className="simple-options">
            {currentStep.options.map((option) => (
              <button
                key={option}
                type="button"
                className={`simple-option${formState[currentStep.id] === option ? " selected" : ""}`}
                onClick={() => handleOptionSelect(currentStep.id, option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {currentStep.type === "birthDate" && (
          <div className="simple-birthdate">
            <div className="birthdate-field">
              <span className="birthdate-label">Month</span>
              <select
                className="birthdate-select"
                value={formState.birthDate.month}
                onChange={(e) => updateBirthDate("month", e.target.value)}
              >
                <option value="">MM</option>
                <option value="1">01</option>
                <option value="2">02</option>
                <option value="3">03</option>
                <option value="4">04</option>
                <option value="5">05</option>
                <option value="6">06</option>
                <option value="7">07</option>
                <option value="8">08</option>
                <option value="9">09</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </select>
            </div>
            <span className="birthdate-slash">/</span>
            <div className="birthdate-field">
              <span className="birthdate-label">Day</span>
              <select
                className="birthdate-select"
                value={formState.birthDate.day}
                onChange={(e) => updateBirthDate("day", e.target.value)}
              >
                <option value="">DD</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>
                    {String(day).padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
            <span className="birthdate-slash">/</span>
            <div className="birthdate-field">
              <span className="birthdate-label">Year</span>
              <select
                className="birthdate-select birthdate-year"
                value={formState.birthDate.year}
                onChange={(e) => updateBirthDate("year", e.target.value)}
              >
                <option value="">YYYY</option>
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
        )}

        {currentStep.type === "address" && (
          <div className="simple-address">
            <div className="simple-address-field">
              <label className="simple-label">Street address</label>
              <div className="simple-address-input-wrapper">
                <input
                  className="simple-input"
                  type="text"
                  placeholder="Start typing your address"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    updateField("address", e.target.value);
                  }}
                  onFocus={() => {
                    if (addressSuggestions.length > 0) {
                      setShowAddressSuggestions(true);
                    }
                  }}
                />
                {isAddressSearching && (
                  <div className="simple-address-loader" aria-hidden="true" />
                )}
                {(showAddressSuggestions &&
                  (addressSuggestions.length > 0 || isAddressSearching)) && (
                  <div className="simple-address-suggestions">
                    {isAddressSearching && (
                      <div className="simple-address-suggestion loading">
                        Searching addresses...
                      </div>
                    )}
                    {addressSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        type="button"
                        className="simple-address-suggestion"
                        onMouseDown={(event) => {
                          event.preventDefault();
                          setAddress(suggestion.formatted);
                          updateField("address", suggestion.formatted);
                          setShowAddressSuggestions(false);
                          setAddressSuggestions([]);
                        }}
                      >
                        <span className="simple-address-primary">
                          {suggestion.primary}
                        </span>
                        {suggestion.secondary && (
                          <span className="simple-address-secondary">
                            {suggestion.secondary}
                          </span>
                        )}
                      </button>
                    ))}
                    <div className="simple-address-footer">
                      Powered by Geoapify &amp; OpenStreetMap
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="simple-address-field">
              <label className="simple-label">Apartment / Unit (optional)</label>
              <input
                className="simple-input"
                type="text"
                placeholder="Apt, Unit, Suite"
                value={formState.apartment}
                onChange={(e) => updateField("apartment", e.target.value)}
              />
            </div>
          </div>
        )}

        {currentStep.type === "name" && (
          <div className="simple-name">
            <input
              className="simple-input"
              type="text"
              placeholder="First name"
              value={formState.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
            />
            <input
              className="simple-input"
              type="text"
              placeholder="Last name"
              value={formState.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
            />
          </div>
        )}

        {currentStep.type === "email" && (
          <input
            className="simple-input"
            type="email"
            placeholder="you@example.com"
            value={formState.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
        )}

        {currentStep.type === "phone" && (
          <input
            className="simple-input"
            type="tel"
            placeholder="Phone number"
            value={formState.phone}
            onChange={(e) =>
              updateField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
            }
          />
        )}

        <div className="simple-actions">
            <button
            type="button"
            className="simple-back"
            onClick={goBack}
            disabled={stepIndex === 0}
          >
            Go back
          </button>

          {stepIndex < totalSteps - 1 && (
            <button
              type="button"
              className="simple-next"
              onClick={goNext}
              disabled={!canGoNext}
            >
            Continue
            </button>
          )}

          {stepIndex === totalSteps - 1 && (
            <button
              type="button"
              className="simple-next"
              onClick={handleSubmit}
              disabled={!canGoNext}
            >
            Submit
            </button>
          )}
        </div>
      </div>

      {showSuccess && (
        <div className="simple-success-overlay">
          <div className="simple-success-card">
            <div className="simple-success-title">Thanks! We’ve got your answers.</div>
            <p className="simple-success-text">
              We’ll review everything and get back to you shortly.
            </p>
            <a
              className="simple-whatsapp"
              href={`https://wa.me/13679943333?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noreferrer"
            >
              Chat on WhatsApp
            </a>
            <button type="button" className="simple-close" onClick={handleReset}>
              All set
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SimpleDreamCarFlow;
