import { useMemo, useState } from "react";
import useGeoapifyAutocomplete from "../hooks/useGeoapifyAutocomplete";
import { MiniCar, VehicleIcon } from "./VehicleIcons";
import { SITE } from "../siteInfo";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
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

  const getSubmission = () => ({
    ...formState,
    address: (address || formState.address || "").trim(),
  });

  const handleSubmit = async () => {
    if (isSubmitting) return;
    const submission = getSubmission();
    setIsSubmitting(true);
    setSubmitError(false);

    try {
      const res = await fetch("/api/dreamcar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });

      if (!res.ok) throw new Error(`Submit failed: HTTP ${res.status}`);

      setWhatsappMessage(buildWhatsappMessage(submission));
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
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
    setSubmitError(false);
  };

  const inputCls =
    "w-full rounded-xl border border-line bg-surface px-4 py-3.5 text-[16px] leading-[1.4] text-ink" +
    " outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted/60" +
    " focus:border-accent focus:shadow-[0_0_0_4px_rgba(36,69,255,0.12)]";

  const selectCls = `${inputCls} cursor-pointer appearance-none`;

  const labelCls = "text-[13px] font-medium text-muted";

  const primaryBtnCls =
    "inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-white" +
    " transition-[background,transform] duration-150 hover:bg-accent-hover active:scale-[0.98]" +
    " disabled:cursor-not-allowed disabled:bg-line disabled:text-muted";

  const progress = totalSteps > 1 ? stepIndex / (totalSteps - 1) : 0;

  const Check = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  return (
    <div className="relative">
      <div className="rounded-[28px] border border-line bg-surface p-6 shadow-[0_1px_2px_rgba(21,23,27,0.04),0_24px_60px_-28px_rgba(21,23,27,0.22)] sm:p-10">
        {/* Progress: a small car moves along as you answer */}
        <div className="mb-8 flex items-center gap-4">
          <div
            className="relative h-1 flex-1 rounded-full bg-line"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            aria-valuenow={stepIndex + 1}
            aria-label={`Step ${stepIndex + 1} of ${totalSteps}`}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-accent transition-[width] duration-500 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
            <div
              className="absolute -top-[13px] -translate-x-1/2 text-accent transition-[left] duration-500 ease-out"
              style={{ left: `${progress * 100}%` }}
            >
              <MiniCar className="h-[13px] w-[28px]" />
            </div>
          </div>
          <span className="shrink-0 text-[13px] tabular-nums text-muted">
            {stepIndex + 1} / {totalSteps}
          </span>
        </div>

        {/* Step */}
        <div key={currentStep.id} className="flex animate-step-in flex-col gap-6">
          <h2 className="text-[22px] font-semibold leading-snug tracking-tight text-ink sm:text-[26px]">
            {currentStep.title}
            {currentStep.skippable && (
              <span className="ml-2 align-middle text-[13px] font-normal text-muted">Optional</span>
            )}
          </h2>

          {/* Vehicle type: silhouettes */}
          {currentStep.type === "options" && currentStep.id === "vehicleType" && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {currentStep.options.map((option) => {
                const isSelected = formState.vehicleType === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleOptionSelect(currentStep.id, option)}
                    className={[
                      "group flex flex-col items-center gap-2 rounded-2xl border px-3 py-5 transition-all duration-150",
                      isSelected
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-line bg-subtle text-ink hover:-translate-y-0.5 hover:border-ink/25",
                    ].join(" ")}
                  >
                    <VehicleIcon
                      type={option}
                      wheelFill={isSelected ? "#ECEFFF" : "#FAF9F6"}
                      className={[
                        "h-10 w-full transition-colors duration-150",
                        isSelected ? "text-accent" : "text-muted group-hover:text-ink",
                      ].join(" ")}
                    />
                    <span className="text-[15px] font-semibold">{option}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Generic options */}
          {currentStep.type === "options" && currentStep.id !== "vehicleType" && (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {currentStep.options.map((option) => {
                const isSelected = formState[currentStep.id] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleOptionSelect(currentStep.id, option)}
                    className={[
                      "flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left text-[15px] transition-all duration-150",
                      isSelected
                        ? "border-accent bg-accent-soft font-semibold text-accent"
                        : "border-line bg-subtle font-medium text-ink hover:border-ink/25",
                    ].join(" ")}
                  >
                    {option}
                    {isSelected && <Check />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Birthdate */}
          {currentStep.type === "birthDate" && (
            <div className="grid grid-cols-[1fr_1fr_1.3fr] gap-2.5">
              <label className="flex flex-col gap-1.5">
                <span className={labelCls}>Month</span>
                <select className={selectCls} value={formState.birthDate.month} onChange={(e) => updateBirthDate("month", e.target.value)}>
                  <option value="">MM</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={String(m)}>{String(m).padStart(2, "0")}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelCls}>Day</span>
                <select className={selectCls} value={formState.birthDate.day} onChange={(e) => updateBirthDate("day", e.target.value)}>
                  <option value="">DD</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>{String(day).padStart(2, "0")}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelCls}>Year</span>
                <select className={selectCls} value={formState.birthDate.year} onChange={(e) => updateBirthDate("year", e.target.value)}>
                  <option value="">YYYY</option>
                  {Array.from({ length: new Date().getFullYear() - 1940 + 1 }, (_, i) => 1940 + i)
                    .reverse().map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </label>
            </div>
          )}

          {/* Address */}
          {currentStep.type === "address" && (
            <div className="grid gap-3">
              <div className="relative">
                <input
                  className={inputCls}
                  type="text"
                  aria-label="Street address"
                  placeholder="Start typing your address"
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); updateField("address", e.target.value); }}
                  onFocus={() => { if (addressSuggestions.length > 0) setShowAddressSuggestions(true); }}
                />
                {isAddressSearching && (
                  <div
                    aria-hidden="true"
                    className="addr-spinner pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 rounded-full border-2 border-line border-r-accent border-t-accent"
                  />
                )}
                {showAddressSuggestions && (addressSuggestions.length > 0 || isAddressSearching) && (
                  <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 max-h-60 overflow-y-auto rounded-xl border border-line bg-surface shadow-[0_20px_40px_-12px_rgba(21,23,27,0.25)]">
                    {isAddressSearching && (
                      <div className="px-3 py-2.5 text-xs text-muted">Searching…</div>
                    )}
                    {addressSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        type="button"
                        className="flex w-full flex-col gap-0.5 border-0 bg-transparent px-3 py-2.5 text-left text-[14px] text-ink hover:bg-accent-soft"
                        onMouseDown={(event) => {
                          event.preventDefault();
                          setAddress(suggestion.formatted);
                          updateField("address", suggestion.formatted);
                          setShowAddressSuggestions(false);
                          setAddressSuggestions([]);
                        }}
                      >
                        <span className="font-medium">{suggestion.primary}</span>
                        {suggestion.secondary && (
                          <span className="text-[12px] text-muted">{suggestion.secondary}</span>
                        )}
                      </button>
                    ))}
                    <div className="border-t border-line px-3 pb-2 pt-1.5 text-right text-[10px] text-muted/70">
                      Powered by Geoapify &amp; OpenStreetMap
                    </div>
                  </div>
                )}
              </div>
              <input className={inputCls} type="text" aria-label="Apartment or unit" placeholder="Apt / unit (optional)" value={formState.apartment} onChange={(e) => updateField("apartment", e.target.value)} />
            </div>
          )}

          {/* Name */}
          {currentStep.type === "name" && (
            <div className="grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
              <input className={inputCls} type="text" autoComplete="given-name" placeholder="First name" value={formState.firstName} onChange={(e) => updateField("firstName", e.target.value)} />
              <input className={inputCls} type="text" autoComplete="family-name" placeholder="Last name" value={formState.lastName} onChange={(e) => updateField("lastName", e.target.value)} />
            </div>
          )}

          {/* Email */}
          {currentStep.type === "email" && (
            <input className={inputCls} type="email" autoComplete="email" placeholder="you@example.com" value={formState.email} onChange={(e) => updateField("email", e.target.value)} />
          )}

          {/* Phone */}
          {currentStep.type === "phone" && (
            <input className={`${inputCls} tabular-nums`} type="tel" autoComplete="tel" inputMode="numeric" placeholder="613 555 0123" value={formState.phone} onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} />
          )}

          {/* Call schedule */}
          {currentStep.type === "callSchedule" && (
            <div className="flex flex-col gap-5">
              <div className="rounded-2xl border border-line p-4">
                <div className="mb-3 flex items-center justify-between">
                  <button
                    type="button"
                    aria-label="Previous month"
                    onClick={() => {
                      if (calViewMonth === 0) { setCalViewMonth(11); setCalViewYear((y) => y - 1); }
                      else setCalViewMonth((m) => m - 1);
                    }}
                    disabled={calViewYear === todayMidnight.getFullYear() && calViewMonth === todayMidnight.getMonth()}
                    className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><polyline points="15 18 9 12 15 6" /></svg>
                  </button>
                  <span className="text-[15px] font-semibold text-ink">
                    {new Date(calViewYear, calViewMonth).toLocaleString("default", { month: "long", year: "numeric" })}
                  </span>
                  <button
                    type="button"
                    aria-label="Next month"
                    onClick={() => {
                      if (calViewMonth === 11) { setCalViewMonth(0); setCalViewYear((y) => y + 1); }
                      else setCalViewMonth((m) => m + 1);
                    }}
                    className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-ink"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><polyline points="9 18 15 12 9 6" /></svg>
                  </button>
                </div>
                <div className="mb-1 grid grid-cols-7">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <div key={i} className="py-1 text-center text-[12px] text-muted">{d}</div>
                  ))}
                </div>
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
                      const isToday = cellDate.getTime() === todayMidnight.getTime();
                      const isSelected = formState.callDate === dateStr;
                      return (
                        <button
                          key={dateStr}
                          type="button"
                          disabled={isPast}
                          onClick={() => { updateField("callDate", dateStr); updateField("callTime", ""); }}
                          className={[
                            "mx-auto grid h-9 w-9 place-items-center rounded-full text-[14px] tabular-nums transition-colors duration-100",
                            isSelected
                              ? "bg-accent font-semibold text-white"
                              : isPast
                              ? "cursor-not-allowed text-line"
                              : "text-ink hover:bg-subtle",
                            isToday && !isSelected ? "font-semibold text-accent" : "",
                          ].join(" ")}
                        >
                          {day}
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>
              {formState.callDate && (
                <div className="grid animate-step-in grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = formState.callTime === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => updateField("callTime", slot)}
                        className={[
                          "rounded-xl border py-2.5 text-[14px] tabular-nums transition-colors duration-150",
                          isSelected
                            ? "border-accent bg-accent-soft font-semibold text-accent"
                            : "border-line bg-subtle text-ink hover:border-ink/25",
                        ].join(" ")}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goBack}
            disabled={stepIndex === 0}
            className="inline-flex items-center gap-1.5 py-3 text-[15px] font-medium text-muted transition-colors hover:text-ink disabled:invisible"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
            Back
          </button>
          <div className="flex items-center gap-5">
            {currentStep.skippable && (
              <button
                type="button"
                onClick={handleSkip}
                className="text-[15px] font-medium text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                Skip
              </button>
            )}
            {stepIndex < totalSteps - 1 && (
              <button type="button" className={primaryBtnCls} onClick={goNext} disabled={!canGoNext}>
                Continue
              </button>
            )}
            {stepIndex === totalSteps - 1 && (
              <button type="button" className={primaryBtnCls} onClick={handleSubmit} disabled={!canGoNext || isSubmitting} aria-busy={isSubmitting}>
                {isSubmitting ? (
                  <>
                    Sending
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true" />
                  </>
                ) : submitError ? (
                  "Try again"
                ) : (
                  "Book my call"
                )}
              </button>
            )}
          </div>
        </div>

        {/* Submit failed: keep their answers, offer a retry and other ways to reach us */}
        {submitError && stepIndex === totalSteps - 1 && (
          <div role="alert" className="mt-5 animate-step-in rounded-2xl bg-red-50 p-4 text-[14px]">
            <p className="font-semibold text-red-700">We couldn&apos;t send your request.</p>
            <p className="mt-1 text-red-700/80">Try again, or reach us directly:</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={`https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(buildWhatsappMessage(getSubmission()))}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full bg-[#25D366] px-4 py-2 text-[13px] font-semibold text-[#052e16]"
              >
                WhatsApp
              </a>
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center rounded-full border border-red-200 bg-white px-4 py-2 text-[13px] font-semibold text-ink"
              >
                Call {SITE.phoneDisplay}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Success overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
          <div className="w-[min(92vw,380px)] animate-success-pop rounded-[28px] bg-surface p-7 text-center shadow-[0_30px_80px_-20px_rgba(21,23,27,0.45)]">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h3 className="mt-5 text-[24px] font-semibold tracking-tight text-ink">You&apos;re all set</h3>
            <p className="mt-2 text-[15px] text-muted">
              {formState.callDate && formState.callTime
                ? `We'll call you ${new Date(`${formState.callDate}T00:00`).toLocaleDateString("default", { weekday: "long", month: "short", day: "numeric" })} at ${formState.callTime}.`
                : "We'll be in touch shortly."}
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <a
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-[15px] font-semibold text-[#052e16] transition-[filter] hover:brightness-105"
                href={`https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noreferrer"
              >
                Chat on WhatsApp
              </a>
              <button
                type="button"
                className="rounded-full px-4 py-3 text-[15px] font-medium text-muted transition-colors hover:text-ink"
                onClick={handleReset}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DreamCarForm;
