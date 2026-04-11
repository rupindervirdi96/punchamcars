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

const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM",
  "3:00 PM", "4:00 PM", "5:00 PM",
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
    `Scheduled call: ${submission.callDate && submission.callTime ? `${submission.callDate} at ${submission.callTime}` : "Not scheduled"}`,
    "",
    "Please let me know the next steps.",
  ]
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");
};

const SKIPPABLE = new Set(["birthDate", "incomeRange", "address"]);

function DreamCarForm() {
  const [stepIndex, setStepIndex] = useState(0);
  const [skippedSteps, setSkippedSteps] = useState(new Set());
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
    callDate: "",
    callTime: "",
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

  const todayMidnight = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [calViewYear, setCalViewYear] = useState(() => new Date().getFullYear());
  const [calViewMonth, setCalViewMonth] = useState(() => new Date().getMonth());

  const steps = useMemo(
    () => [
      {
        id: "vehicleType",
        title: "What kind of vehicle are you looking for?",
        type: "options",
        options: VEHICLE_OPTIONS,
      },
      {
        id: "birthDate",
        title: "What's your birthdate?",
        type: "birthDate",
        skippable: true,
      },
      {
        id: "creditStatus",
        title: "How would you describe your credit right now?",
        type: "options",
        options: CREDIT_OPTIONS,
      },
      {
        id: "employmentStatus",
        title: "What's your employment status?",
        type: "options",
        options: EMPLOYMENT_OPTIONS,
      },
      {
        id: "biweeklyBudgetRange",
        title: "Roughly, what's your biweekly budget?",
        type: "options",
        options: BUDGET_OPTIONS,
      },
      {
        id: "incomeRange",
        title: "Which range best fits your monthly income?",
        type: "options",
        options: INCOME_OPTIONS,
        skippable: true,
      },
      {
        id: "address",
        title: "What's your current address?",
        type: "address",
        skippable: true,
      },
      {
        id: "livingDuration",
        title: "How long have you been there?",
        type: "options",
        options: LIVING_DURATION_OPTIONS,
      },
      {
        id: "name",
        title: "What's your name?",
        type: "name",
      },
      {
        id: "email",
        title: "What's the best email for you?",
        type: "email",
      },
      {
        id: "phone",
        title: "What's the best phone number to reach you?",
        type: "phone",
      },
      {
        id: "callSchedule",
        title: "When's the best time for us to call you?",
        type: "callSchedule",
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
      case "callSchedule":
        return Boolean(formState.callDate && formState.callTime);
      default:
        return false;
    }
  };

  const canGoNext = isStepComplete(currentStep);

  // Returns true for steps that are invisibly auto-hidden (not explicitly skipped by user)
  const isAutoHidden = (idx) =>
    steps[idx].id === "livingDuration" && skippedSteps.has("address");

  const goNext = () => {
    if (!canGoNext) return;
    let next = stepIndex + 1;
    while (next < totalSteps - 1 && isAutoHidden(next)) next++;
    if (next < totalSteps) setStepIndex(next);
  };

  const goBack = () => {
    if (stepIndex === 0) return;
    let prev = stepIndex - 1;
    // Skip over auto-hidden steps (livingDuration when address was skipped)
    while (prev > 0 && isAutoHidden(prev)) prev--;
    // If landing on a step the user explicitly skipped, un-skip it so they can decide again
    const targetId = steps[prev].id;
    if (skippedSteps.has(targetId) && SKIPPABLE.has(targetId)) {
      const newSkipped = new Set(skippedSteps);
      newSkipped.delete(targetId);
      setSkippedSteps(newSkipped);
    }
    setStepIndex(prev);
  };

  const handleSkip = () => {
    const newSkipped = new Set(skippedSteps);
    newSkipped.add(currentStep.id);
    // Clear the field value for the skipped step
    if (currentStep.id === "birthDate") {
      updateField("birthDate", { day: "", month: "", year: "" });
    } else if (currentStep.id === "incomeRange") {
      updateField("incomeRange", "");
    } else if (currentStep.id === "address") {
      // Auto-skip livingDuration too and clear related fields
      newSkipped.add("livingDuration");
      setAddress("");
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
      updateField("address", "");
      updateField("apartment", "");
      updateField("livingDuration", "");
    }
    setSkippedSteps(newSkipped);
    // Advance past the skipped step (and past livingDuration if address was skipped)
    const jump = currentStep.id === "address" ? 2 : 1;
    setStepIndex((prev) => Math.min(prev + jump, totalSteps - 1));
  };

  const handleOptionSelect = (stepId, option) => {
    updateField(stepId, option);
    let next = stepIndex + 1;
    while (next < totalSteps - 1 && isAutoHidden(next)) next++;
    if (next < totalSteps) setStepIndex(next);
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
      callDate: "",
      callTime: "",
    });
    setAddress("");
    setAddressSuggestions([]);
    setShowAddressSuggestions(false);
    setSkippedSteps(new Set());
    setStepIndex(0);
    setShowSuccess(false);
  };

  const inputCls =
    "w-full border border-[rgba(148,163,184,0.4)] rounded-xl px-[14px] py-3 text-[15px]" +
    " leading-[1.4] text-gray-50 bg-[rgba(15,23,42,0.8)] outline-none" +
    " transition-[border-color,box-shadow] duration-150 placeholder:text-gray-500" +
    " focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.25)]";

  const selectCls =
    "border-0 border-b-2 border-[rgba(148,163,184,0.4)] pb-2 pt-1.5 px-0.5" +
    " text-xl text-gray-50 bg-transparent outline-none appearance-none cursor-pointer" +
    " focus:border-indigo-500 [&>option]:bg-slate-900 [&>option]:text-gray-50";

  const nextBtnCls =
    "rounded-xl px-4 py-3 border-0 font-bold text-sm text-white cursor-pointer" +
    " bg-gradient-to-br from-blue-500 to-indigo-500 shadow-[0_8px_20px_rgba(37,99,235,0.4)]" +
    " transition-[transform,box-shadow] duration-150 hover:-translate-y-px" +
    " hover:shadow-[0_12px_26px_rgba(37,99,235,0.55)] disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="flex-1 bg-[rgba(15,23,42,0.7)] rounded-[20px] px-5 py-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] text-gray-200 backdrop-blur-md flex flex-col justify-center">
      <div className="flex flex-col gap-[10px] w-full">
        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {steps.map((step, index) => {
            const isActive = index === stepIndex;
            const isDone = isStepComplete(step);
            const isSkipped = skippedSteps.has(step.id);
            return (
              <button
                key={step.id}
                type="button"
                className={[
                  "w-2.5 h-2.5 rounded-full border cursor-pointer transition-[background,border-color] duration-150",
                  isActive
                    ? "bg-indigo-500 border-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.3)]"
                    : isDone
                    ? "bg-emerald-400 border-emerald-400"
                    : isSkipped
                    ? "bg-[rgba(107,114,128,0.35)] border-[rgba(107,114,128,0.4)]"
                    : "border-[rgba(148,163,184,0.35)] bg-[rgba(15,23,42,0.5)]",
                ].join(" ")}
                onClick={() => { if (index <= stepIndex) setStepIndex(index); }}
                aria-label={`Go to step ${index + 1}`}
              />
            );
          })}
        </div>

        {/* Step card */}
        <div className="bg-[rgba(2,6,23,0.45)] rounded-[18px] px-5 py-6 shadow-[0_16px_40px_rgba(0,0,0,0.3)] border border-[rgba(148,163,184,0.15)] flex flex-col gap-[14px]">
          <div className="text-xs uppercase tracking-[0.08em] text-gray-400">
            Step {stepIndex + 1} of {totalSteps}
          </div>
          <h2 className="text-[19px] font-bold text-gray-50 m-0">{currentStep.title}</h2>

          {/* Options */}
          {currentStep.type === "options" && (
            <div className="grid grid-cols-2 gap-[10px]">
              {currentStep.options.map((option) => {
                const isSelected = formState[currentStep.id] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    className={[
                      "border px-[14px] py-3 rounded-xl text-sm font-semibold cursor-pointer text-left transition-all duration-150",
                      isSelected
                        ? "border-indigo-500 bg-gradient-to-br from-indigo-700 to-indigo-500 text-white shadow-[0_8px_22px_rgba(99,102,241,0.45)]"
                        : "border-[rgba(148,163,184,0.3)] bg-[rgba(15,23,42,0.6)] text-gray-200 hover:border-[rgba(99,102,241,0.65)] hover:bg-[rgba(99,102,241,0.14)] hover:-translate-y-px hover:shadow-[0_8px_18px_rgba(0,0,0,0.3)]",
                    ].join(" ")}
                    onClick={() => handleOptionSelect(currentStep.id, option)}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          )}

          {/* Birthdate */}
          {currentStep.type === "birthDate" && (
            <div className="flex items-end gap-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-[13px] text-gray-400 font-medium">Month</span>
                <select className={`${selectCls} !pb-2 !pr-3 text-[16px]`} value={formState.birthDate.month} onChange={(e) => updateBirthDate("month", e.target.value)}>
                  <option value="">MM</option>
                  <option value="1">01</option><option value="2">02</option><option value="3">03</option>
                  <option value="4">04</option><option value="5">05</option><option value="6">06</option>
                  <option value="7">07</option><option value="8">08</option><option value="9">09</option>
                  <option value="10">10</option><option value="11">11</option><option value="12">12</option>
                </select>
              </div>
              <span className="text-[22px] text-gray-500 pb-1.5">/</span>
              <div className="flex flex-col gap-1.5">
                <span className="text-[13px] text-gray-400 font-medium">Day</span>
                <select className={`${selectCls} !pb-2 !pr-3 text-[16px]`} value={formState.birthDate.day} onChange={(e) => updateBirthDate("day", e.target.value)}>
                  <option value="">DD</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>{String(day).padStart(2, "0")}</option>
                  ))}
                </select>
              </div>
              <span className="text-[22px] text-gray-500 pb-1.5">/</span>
              <div className="flex flex-col gap-1.5">
                <span className="text-[13px] text-gray-400 font-medium">Year</span>
                <select className={`${selectCls} !pb-2 !pr-3 text-[16px]`} value={formState.birthDate.year} onChange={(e) => updateBirthDate("year", e.target.value)}>
                  <option value="">YYYY</option>
                  {Array.from({ length: new Date().getFullYear() - 1940 + 1 }, (_, i) => 1940 + i)
                    .reverse().map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Address */}
          {currentStep.type === "address" && (
            <div className="grid gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-[0.06em] text-gray-400">Street address</label>
                <div className="relative">
                  <input
                    className={inputCls}
                    type="text"
                    placeholder="Start typing your address"
                    value={address}
                    onChange={(e) => { setAddress(e.target.value); updateField("address", e.target.value); }}
                    onFocus={() => { if (addressSuggestions.length > 0) setShowAddressSuggestions(true); }}
                  />
                  {isAddressSearching && (
                    <div
                      aria-hidden="true"
                      className="addr-spinner absolute top-1/2 right-3 w-3.5 h-3.5 rounded-full border-2 border-[rgba(148,163,184,0.4)] border-t-blue-400 border-r-blue-400 pointer-events-none"
                    />
                  )}
                  {showAddressSuggestions && (addressSuggestions.length > 0 || isAddressSearching) && (
                    <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-[rgba(15,23,42,0.98)] rounded-xl border border-[rgba(148,163,184,0.5)] shadow-[0_20px_40px_rgba(0,0,0,0.5)] max-h-60 overflow-y-auto z-20">
                      {isAddressSearching && (
                        <div className="px-3 py-2.5 text-xs text-gray-400">Searching addresses...</div>
                      )}
                      {addressSuggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          type="button"
                          className="w-full px-3 py-2.5 bg-transparent border-0 text-left cursor-pointer flex flex-col gap-0.5 text-[13px] text-gray-200 hover:bg-[rgba(37,99,235,0.28)]"
                          onMouseDown={(event) => {
                            event.preventDefault();
                            setAddress(suggestion.formatted);
                            updateField("address", suggestion.formatted);
                            setShowAddressSuggestions(false);
                            setAddressSuggestions([]);
                          }}
                        >
                          <span className="font-semibold">{suggestion.primary}</span>
                          {suggestion.secondary && (
                            <span className="text-[11px] text-gray-400">{suggestion.secondary}</span>
                          )}
                        </button>
                      ))}
                      <div className="px-3 pb-2 pt-1.5 border-t border-[rgba(31,41,55,0.9)] text-[10px] text-gray-500 text-right">
                        Powered by Geoapify &amp; OpenStreetMap
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-[0.06em] text-gray-400">Apartment / Unit (optional)</label>
                <input className={inputCls} type="text" placeholder="Apt, Unit, Suite" value={formState.apartment} onChange={(e) => updateField("apartment", e.target.value)} />
              </div>
            </div>
          )}

          {/* Name */}
          {currentStep.type === "name" && (
            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-[10px]">
              <input className={inputCls} type="text" placeholder="First name" value={formState.firstName} onChange={(e) => updateField("firstName", e.target.value)} />
              <input className={inputCls} type="text" placeholder="Last name" value={formState.lastName} onChange={(e) => updateField("lastName", e.target.value)} />
            </div>
          )}

          {/* Email */}
          {currentStep.type === "email" && (
            <input className={inputCls} type="email" placeholder="you@example.com" value={formState.email} onChange={(e) => updateField("email", e.target.value)} />
          )}

          {/* Phone */}
          {currentStep.type === "phone" && (
            <input className={inputCls} type="tel" placeholder="Phone number" value={formState.phone} onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} />
          )}

          {/* Call Schedule */}
          {currentStep.type === "callSchedule" && (
            <div className="flex flex-col gap-4">
              {/* Calendar */}
              <div className="bg-[rgba(2,6,23,0.5)] rounded-2xl border border-[rgba(148,163,184,0.15)] p-4">
                {/* Month navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (calViewMonth === 0) { setCalViewMonth(11); setCalViewYear((y) => y - 1); }
                      else setCalViewMonth((m) => m - 1);
                    }}
                    disabled={calViewYear === todayMidnight.getFullYear() && calViewMonth === todayMidnight.getMonth()}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="15 18 9 12 15 6" /></svg>
                  </button>
                  <span className="text-sm font-semibold text-gray-200">
                    {new Date(calViewYear, calViewMonth).toLocaleString("default", { month: "long", year: "numeric" })}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (calViewMonth === 11) { setCalViewMonth(0); setCalViewYear((y) => y + 1); }
                      else setCalViewMonth((m) => m + 1);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="9 18 15 12 9 6" /></svg>
                  </button>
                </div>
                {/* Day of week headers */}
                <div className="grid grid-cols-7 mb-1">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                    <div key={d} className="text-center text-[11px] font-medium text-gray-500 py-1">{d}</div>
                  ))}
                </div>
                {/* Day cells */}
                <div className="grid grid-cols-7 gap-y-1">
                  {(() => {
                    const firstDay = new Date(calViewYear, calViewMonth, 1).getDay();
                    const daysInMonth = new Date(calViewYear, calViewMonth + 1, 0).getDate();
                    const cells = [];
                    for (let i = 0; i < firstDay; i++) cells.push(null);
                    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
                    return cells.map((day, i) => {
                      if (day === null) return <div key={`blank-${i}`} />;
                      const dateStr = `${calViewYear}-${String(calViewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                      const cellDate = new Date(calViewYear, calViewMonth, day);
                      const isPast = cellDate < todayMidnight;
                      const isSelected = formState.callDate === dateStr;
                      return (
                        <button
                          key={dateStr}
                          type="button"
                          disabled={isPast}
                          onClick={() => { updateField("callDate", dateStr); updateField("callTime", ""); }}
                          className={[
                            "mx-auto w-8 h-8 flex items-center justify-center rounded-full text-sm transition-all duration-100",
                            isSelected
                              ? "bg-indigo-500 text-white font-bold shadow-[0_0_0_3px_rgba(99,102,241,0.35)]"
                              : isPast
                              ? "text-gray-600 cursor-not-allowed"
                              : "text-gray-200 hover:bg-white/10 cursor-pointer font-medium",
                          ].join(" ")}
                        >
                          {day}
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>
              {/* Time slots */}
              {formState.callDate && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-[0.06em] text-gray-400">Pick a time</span>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = formState.callTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => updateField("callTime", slot)}
                          className={[
                            "border py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-150",
                            isSelected
                              ? "border-indigo-500 bg-gradient-to-br from-indigo-700 to-indigo-500 text-white shadow-[0_6px_16px_rgba(99,102,241,0.4)]"
                              : "border-[rgba(148,163,184,0.25)] bg-[rgba(15,23,42,0.5)] text-gray-300 hover:border-[rgba(99,102,241,0.5)] hover:bg-[rgba(99,102,241,0.1)] hover:-translate-y-px",
                          ].join(" ")}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center gap-[10px] mt-1">
            <button
              type="button"
              className="flex-none rounded-xl px-4 py-3 border border-[rgba(148,163,184,0.3)] bg-[rgba(15,23,42,0.65)] text-gray-200 font-bold text-sm cursor-pointer transition-[background,transform] duration-150 hover:bg-[rgba(15,23,42,0.85)] hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={goBack}
              disabled={stepIndex === 0}
            >
              Go back
            </button>
            <div className="flex gap-2 items-center">
              {currentStep.skippable && (
                <button
                  type="button"
                  className="rounded-xl px-4 py-3 border border-[rgba(148,163,184,0.25)] bg-transparent text-gray-400 font-semibold text-sm cursor-pointer transition-[color,border-color] duration-150 hover:text-gray-200 hover:border-[rgba(148,163,184,0.5)]"
                  onClick={handleSkip}
                >
                  Skip
                </button>
              )}
              {stepIndex < totalSteps - 1 && (
                <button type="button" className={nextBtnCls} onClick={goNext} disabled={!canGoNext}>
                  Continue
                </button>
              )}
              {stepIndex === totalSteps - 1 && (
                <button type="button" className={nextBtnCls} onClick={handleSubmit} disabled={!canGoNext}>
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.75),rgba(2,6,23,0.9))] flex items-center justify-center z-50">
          <div className="bg-[linear-gradient(145deg,#020617_0%,#0f172a_40%,#1d4ed8_100%)] rounded-[20px] px-[22px] py-6 w-[min(92vw,360px)] flex flex-col gap-3 text-left border border-[rgba(129,140,248,0.6)] shadow-[0_26px_70px_rgba(15,23,42,0.95)] animate-success-pop">
            <div className="text-[17px] font-bold text-gray-50">Thanks! We&apos;ve got your answers.</div>
            <p className="text-sm text-[#cbd5f5]">We&apos;ll review everything and get back to you shortly.</p>
            <a
              className="inline-flex items-center justify-center px-3 py-2.5 rounded-xl bg-gradient-to-br from-green-500 to-green-400 text-[#052e16] font-bold no-underline text-sm shadow-[0_14px_28px_rgba(34,197,94,0.4)] transition-[transform,box-shadow] duration-150 hover:-translate-y-px hover:shadow-[0_18px_32px_rgba(34,197,94,0.5)]"
              href={`https://wa.me/16134006796?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noreferrer"
            >
              Chat on WhatsApp
            </a>
            <button
              type="button"
              className="border border-[rgba(148,163,184,0.3)] bg-[rgba(15,23,42,0.75)] px-3 py-2.5 rounded-xl font-semibold text-sm text-gray-200 cursor-pointer transition-[transform,background] duration-150 hover:bg-[rgba(15,23,42,0.92)] hover:-translate-y-px"
              onClick={handleReset}
            >
              All set
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DreamCarForm;
