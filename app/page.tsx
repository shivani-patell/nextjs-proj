"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";

const PRIVACY_POLICY_URL =
  "https://survey-tool-j-healthcare.vercel.app/privacy-policy";

type Step = 1 | 2 | 3;

type FormState = {
  incidentDate: string;
  incidentTime: string;
  area: string;
  intended: string;
  gotExpected: "" | "yes" | "no";
  route: "" | "inject" | "smoke" | "snort" | "eat" | "other";
  routeOther: string;
  source: "" | "same" | "new";
  newSourceDetail: string;
  lookedDifferent: "" | "yes" | "no";
  photoFile: File | null;
  effects: string[];
  effectsOther: string;
  frequency: "" | "first" | "recent" | "common";
  notes: string;
  sendOpcInfo: boolean;
};

const initialForm: FormState = {
  incidentDate: "",
  incidentTime: "",
  area: "",
  intended: "",
  gotExpected: "",
  route: "",
  routeOther: "",
  source: "",
  newSourceDetail: "",
  lookedDifferent: "",
  photoFile: null,
  effects: [],
  effectsOther: "",
  frequency: "",
  notes: "",
  sendOpcInfo: false,
};

const ROUTE_OPTIONS = [
  { value: "inject", label: "Inject" },
  { value: "smoke", label: "Smoke" },
  { value: "snort", label: "Snort" },
  { value: "eat", label: "Eat" },
  { value: "other", label: "Other" },
] as const;

const EFFECT_OPTIONS = [
  { value: "hit-fast", label: "Hit too fast" },
  { value: "hit-slow", label: "Hit too slow" },
  { value: "lasted-short", label: "Lasted too short" },
  { value: "lasted-long", label: "Lasted too long" },
  {
    value: "psychosis",
    label: "Psychosis (confusion/hallucinations)",
  },
  { value: "heavy-sedation", label: "Heavy sedation" },
  { value: "panic", label: "Panic attack" },
  { value: "other", label: "Other (describe below)" },
] as const;

const inputClass =
  "w-full rounded-lg border border-neutral-400 bg-white px-3 py-2.5 text-base text-black placeholder:text-neutral-500 shadow-sm focus:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-800/30";

const labelClass = "mb-2 block text-sm font-semibold text-black";

function validateStep2(f: FormState): string | null {
  if (!f.incidentDate.trim()) return "Please enter the date of the incident.";
  if (!f.incidentTime.trim()) return "Please enter the time of the incident.";
  if (!f.area.trim()) return "Please enter the rough area or neighbourhood.";
  if (!f.intended.trim()) return "Please describe what you intended to take.";
  if (!f.gotExpected) return "Please answer whether you got what you expected.";
  if (!f.route) return "Please select how it was taken.";
  if (f.route === "other" && !f.routeOther.trim()) {
    return "Please describe how it was taken (Other).";
  }
  if (!f.source) return "Please indicate whether the source was usual or new.";
  if (f.source === "new" && !f.newSourceDetail.trim()) {
    return "Please briefly describe the new source.";
  }
  if (!f.lookedDifferent) {
    return "Please answer whether the substance looked or smelled different.";
  }
  const hasEffect =
    f.effects.length > 0 ||
    (f.effects.includes("other") && f.effectsOther.trim().length > 0);
  if (!hasEffect) {
    return "Please select at least one effect, or describe under Other.";
  }
  if (f.effects.includes("other") && !f.effectsOther.trim()) {
    return "Please describe the other effect(s).";
  }
  if (!f.frequency) return "Please answer how often you use.";
  return null;
}

export default function FrontlineFeedbackSurvey() {
  const [step, setStep] = useState<Step>(1);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [step2Error, setStep2Error] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const formId = useId();

  const resetAll = useCallback(() => {
    setForm(initialForm);
    setStep(1);
    setSuccess(false);
    setStep2Error(null);
    setSubmitError(null);
  }, []);

  useEffect(() => {
    mainRef.current?.focus();
  }, [step, success]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleEffect = (value: string) => {
    setForm((prev) => {
      const has = prev.effects.includes(value);
      const effects = has
        ? prev.effects.filter((e) => e !== value)
        : [...prev.effects, value];
      return { ...prev, effects };
    });
  };

  const goNextFromDisclaimer = () => {
    setStep2Error(null);
    setStep(2);
  };

  const goToReview = () => {
    const err = validateStep2(form);
    setStep2Error(err);
    if (!err) setStep(3);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("incidentDate", form.incidentDate);
      fd.append("incidentTime", form.incidentTime);
      fd.append("area", form.area);
      fd.append("intendedSubstance", form.intended);
      fd.append("gotExpected", form.gotExpected);
      fd.append("howTaken", form.route);
      fd.append("howTakenOther", form.routeOther);
      fd.append("usualSource", form.source);
      fd.append("newSourceExplain", form.newSourceDetail);
      fd.append("lookedDifferent", form.lookedDifferent);
      fd.append("effects", JSON.stringify(form.effects));
      fd.append("effectsOther", form.effectsOther);
      fd.append("useFrequency", form.frequency);
      fd.append("additionalNotes", form.notes);
      fd.append("opcOptIn", String(form.sendOpcInfo));
      if (form.photoFile) {
        fd.append("photo", form.photoFile);
      }

      const res = await fetch("/api/submit", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Submit failed");
      setSuccess(true);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const progressSteps: { step: Step; label: string }[] = [
    { step: 1, label: "Disclaimer" },
    { step: 2, label: "Questions" },
    { step: 3, label: "Resources" },
  ];

  return (
    <div className="flex min-h-[100dvh] min-h-screen flex-col bg-blue-950">
      <header className="shrink-0 border-b border-blue-800 bg-blue-950 px-4 py-5 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
          <Image
            src="/j-healthcare-logo.svg"
            alt="J Healthcare Initiative"
            width={56}
            height={56}
            className="h-14 w-14 shrink-0"
            priority
          />
          <div className="min-w-0 text-white">
            <p className="text-xs font-medium uppercase tracking-wide text-blue-200">
              JHealthcare Initiative
            </p>
            <h1 className="text-balance text-xl font-bold leading-tight sm:text-2xl">
              Frontline Feedback
            </h1>
            <p className="mt-1 text-balance text-sm text-blue-100 sm:text-base">
              Report Unusual Drug Effects – Help Canadians Stay Informed
            </p>
          </div>
        </div>
      </header>

      {!success && (
        <div
          className="border-b border-blue-800 bg-blue-950 px-4 py-3 sm:px-8"
          aria-label="Survey progress"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <ol className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              {progressSteps.map(({ step: n, label }) => {
                const active = step === n;
                return (
                  <li key={n}>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        active
                          ? "bg-white text-blue-950"
                          : "bg-blue-900/80 text-blue-100"
                      }`}
                      aria-current={active ? "step" : undefined}
                    >
                      {n}/3 {label}
                    </span>
                  </li>
                );
              })}
            </ol>
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-blue-900 sm:max-w-xs"
              role="presentation"
            >
              <div
                className="h-full rounded-full bg-white transition-[width] duration-300 ease-out"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <main
        ref={mainRef}
        tabIndex={-1}
        className="flex flex-1 flex-col bg-white text-black outline-none"
      >
        {success ? (
          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-10 sm:px-8">
            <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-black">
                Received – data logged safely
              </h2>
              <p className="mt-3 text-neutral-800">
                Thank you. Your report helps track supply risks safely.
              </p>
              <button
                type="button"
                onClick={resetAll}
                className="mt-8 rounded-lg bg-blue-900 px-6 py-3 font-semibold text-white hover:bg-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2"
              >
                Submit another report
              </button>
            </div>
          </div>
        ) : step === 1 ? (
          <DisclaimerContent onContinue={goNextFromDisclaimer} />
        ) : step === 2 ? (
          <form
            id={formId}
            className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-8"
            onSubmit={(e) => e.preventDefault()}
          >
            <h2 className="mb-6 text-xl font-bold text-black">
              Incident details
            </h2>
            {step2Error && (
              <div
                role="alert"
                className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900"
              >
                {step2Error}
              </div>
            )}

            <div className="space-y-8">
              <fieldset className="space-y-3">
                <legend className={`${labelClass} text-base`}>
                  1. When did the incident take place?
                </legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="incident-date">
                      Date
                    </label>
                    <input
                      id="incident-date"
                      type="date"
                      value={form.incidentDate}
                      onChange={(e) =>
                        setField("incidentDate", e.target.value)
                      }
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="incident-time">
                      Time
                    </label>
                    <input
                      id="incident-time"
                      type="time"
                      value={form.incidentTime}
                      onChange={(e) =>
                        setField("incidentTime", e.target.value)
                      }
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </fieldset>

              <div>
                <label className={labelClass} htmlFor="area">
                  2. What was the rough area/neighbourhood of the incident?
                </label>
                <input
                  id="area"
                  type="text"
                  value={form.area}
                  onChange={(e) => setField("area", e.target.value)}
                  placeholder="Vancouver DTES, Surrey, etc."
                  className={inputClass}
                  autoComplete="off"
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="intended">
                  3. What did you intend to take?
                </label>
                <input
                  id="intended"
                  type="text"
                  value={form.intended}
                  onChange={(e) => setField("intended", e.target.value)}
                  placeholder="e.g., fentanyl, heroin, coke, medetomidine"
                  className={inputClass}
                  autoComplete="off"
                />
              </div>

              <fieldset>
                <legend className={labelClass}>
                  4. Did you get the substance that you expected?
                </legend>
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  {(["yes", "no"] as const).map((v) => (
                    <label
                      key={v}
                      className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg border border-neutral-400 px-4 py-2 has-[:checked]:border-blue-900 has-[:checked]:bg-blue-50"
                    >
                      <input
                        type="radio"
                        name="gotExpected"
                        value={v}
                        checked={form.gotExpected === v}
                        onChange={() => setField("gotExpected", v)}
                        className="h-4 w-4 accent-blue-900"
                      />
                      <span className="capitalize">{v}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className={labelClass}>5. How was it taken?</legend>
                <div className="flex flex-col gap-2">
                  {ROUTE_OPTIONS.map(({ value, label }) => (
                    <label
                      key={value}
                      className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg border border-neutral-400 px-4 py-2 has-[:checked]:border-blue-900 has-[:checked]:bg-blue-50"
                    >
                      <input
                        type="radio"
                        name="route"
                        value={value}
                        checked={form.route === value}
                        onChange={() => setField("route", value)}
                        className="h-4 w-4 accent-blue-900"
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                {form.route === "other" && (
                  <div className="mt-3">
                    <label className={labelClass} htmlFor="route-other">
                      Describe (other)
                    </label>
                    <input
                      id="route-other"
                      type="text"
                      value={form.routeOther}
                      onChange={(e) =>
                        setField("routeOther", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                )}
              </fieldset>

              <fieldset>
                <legend className={labelClass}>
                  6. Was the substance from your usual source?
                </legend>
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <label className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg border border-neutral-400 px-4 py-2 has-[:checked]:border-blue-900 has-[:checked]:bg-blue-50">
                    <input
                      type="radio"
                      name="source"
                      value="same"
                      checked={form.source === "same"}
                      onChange={() => setField("source", "same")}
                      className="h-4 w-4 accent-blue-900"
                    />
                    Same source
                  </label>
                  <label className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg border border-neutral-400 px-4 py-2 has-[:checked]:border-blue-900 has-[:checked]:bg-blue-50">
                    <input
                      type="radio"
                      name="source"
                      value="new"
                      checked={form.source === "new"}
                      onChange={() => setField("source", "new")}
                      className="h-4 w-4 accent-blue-900"
                    />
                    New source
                  </label>
                </div>
                {form.source === "new" && (
                  <div className="mt-3">
                    <label className={labelClass} htmlFor="new-source-detail">
                      Tell us about the new source
                    </label>
                    <textarea
                      id="new-source-detail"
                      value={form.newSourceDetail}
                      onChange={(e) =>
                        setField("newSourceDetail", e.target.value)
                      }
                      rows={3}
                      className={inputClass}
                    />
                  </div>
                )}
              </fieldset>

              <fieldset>
                <legend className={labelClass}>
                  7. Did the substance look/smell different?
                </legend>
                <div className="flex flex-col gap-2 sm:flex-row">
                  {(["yes", "no"] as const).map((v) => (
                    <label
                      key={v}
                      className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg border border-neutral-400 px-4 py-2 has-[:checked]:border-blue-900 has-[:checked]:bg-blue-50"
                    >
                      <input
                        type="radio"
                        name="lookedDifferent"
                        value={v}
                        checked={form.lookedDifferent === v}
                        onChange={() => setField("lookedDifferent", v)}
                        className="h-4 w-4 accent-blue-900"
                      />
                      <span className="capitalize">{v}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-4">
                  <label className={labelClass} htmlFor="photo">
                    Photo (optional — helps identify supply)
                  </label>
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setField(
                        "photoFile",
                        e.target.files?.[0] ?? null
                      )
                    }
                    className="block w-full text-sm text-black file:mr-4 file:rounded-lg file:border-0 file:bg-blue-900 file:px-4 file:py-2 file:font-semibold file:text-white"
                  />
                </div>
              </fieldset>

              <fieldset>
                <legend className={labelClass}>
                  8. Did you experience any unusual effects? (select all that
                  apply)
                </legend>
                <div className="flex flex-col gap-2">
                  {EFFECT_OPTIONS.map(({ value, label }) => (
                    <label
                      key={value}
                      className="flex min-h-[44px] cursor-pointer items-start gap-2 rounded-lg border border-neutral-400 px-4 py-2 has-[:checked]:border-blue-900 has-[:checked]:bg-blue-50"
                    >
                      <input
                        type="checkbox"
                        checked={form.effects.includes(value)}
                        onChange={() => toggleEffect(value)}
                        className="mt-1 h-4 w-4 accent-blue-900"
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                {form.effects.includes("other") && (
                  <div className="mt-3">
                    <label className={labelClass} htmlFor="effects-other">
                      Other — describe
                    </label>
                    <textarea
                      id="effects-other"
                      value={form.effectsOther}
                      onChange={(e) =>
                        setField("effectsOther", e.target.value)
                      }
                      rows={3}
                      className={inputClass}
                    />
                  </div>
                )}
              </fieldset>

              <fieldset>
                <legend className={labelClass}>9. How often do you use?</legend>
                <div className="flex flex-col gap-2">
                  {(
                    [
                      { value: "first", label: "First time" },
                      { value: "recent", label: "Recent pattern" },
                      { value: "common", label: "Common now" },
                    ] as const
                  ).map(({ value, label }) => (
                    <label
                      key={value}
                      className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg border border-neutral-400 px-4 py-2 has-[:checked]:border-blue-900 has-[:checked]:bg-blue-50"
                    >
                      <input
                        type="radio"
                        name="frequency"
                        value={value}
                        checked={form.frequency === value}
                        onChange={() => setField("frequency", value)}
                        className="h-4 w-4 accent-blue-900"
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <label className={labelClass} htmlFor="notes">
                  10. Anything else you would like us to know?
                </label>
                <textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) => setField("notes", e.target.value)}
                  placeholder="Supply details, experience notes"
                  rows={4}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => {
                  setStep2Error(null);
                  setStep(1);
                }}
                className="order-2 rounded-lg border-2 border-blue-900 bg-white px-6 py-3 font-semibold text-blue-900 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-800 sm:order-1"
              >
                Back
              </button>
              <button
                type="button"
                onClick={goToReview}
                className="order-1 rounded-lg bg-blue-900 px-6 py-3 font-semibold text-white hover:bg-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 sm:order-2 sm:ml-auto"
              >
                Review & Submit →
              </button>
            </div>
          </form>
        ) : (
          <form
            className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-8"
            onSubmit={handleFinalSubmit}
          >
            <h2 className="mb-2 text-2xl font-bold text-black">
              Thank you – your report helps track supply risks safely!
            </h2>
            <p className="mb-8 text-neutral-800">
              Before you finish, here are resources you can use anytime.
            </p>

            <ul className="mb-10 grid gap-4 sm:grid-cols-1">
              <li className="rounded-xl border border-neutral-300 bg-neutral-50 p-5 text-black shadow-sm">
                <h3 className="font-bold">
                  National Overdose Response Service (NORS)
                </h3>
                <p className="mt-1">
                  <a
                    href="tel:1-888-688-6677"
                    className="font-semibold text-blue-900 underline focus:outline-none focus:ring-2 focus:ring-blue-800"
                  >
                    1-888-688-6677
                  </a>
                </p>
              </li>
              <li className="rounded-xl border border-neutral-300 bg-neutral-50 p-5 text-black shadow-sm">
                <h3 className="font-bold">Safespot</h3>
                <p className="mt-1">
                  <a
                    href="tel:800-972-0590"
                    className="font-semibold text-blue-900 underline focus:outline-none focus:ring-2 focus:ring-blue-800"
                  >
                    800-972-0590
                  </a>
                </p>
              </li>
              <li className="rounded-xl border border-neutral-300 bg-neutral-50 p-5 text-black shadow-sm">
                <h3 className="font-bold">Alcohol Drug Helpline</h3>
                <p className="mt-1">
                  <a
                    href="tel:1-800-787-7797"
                    className="font-semibold text-blue-900 underline focus:outline-none focus:ring-2 focus:ring-blue-800"
                  >
                    1-800-787-7797
                  </a>
                </p>
              </li>
            </ul>

            <div className="rounded-xl border border-neutral-300 bg-white p-5">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.sendOpcInfo}
                  onChange={(e) =>
                    setField("sendOpcInfo", e.target.checked)
                  }
                  className="mt-1 h-4 w-4 accent-blue-900"
                />
                <span className="text-black">
                  <span className="font-semibold">Send OPC info?</span>{" "}
                  <span className="text-neutral-800">
                    (optional) The Overdose Prevention Circle is a free
                    community program where people with drug use experience can
                    safely access harm reduction supplies (needles, pipes,
                    naloxone), get peer support, and connect to treatment
                    options when ready. No judgment, no barriers.
                  </span>
                </span>
              </label>
            </div>

            {submitError && (
              <div
                className="mt-6 rounded-lg border border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-950"
                role="alert"
              >
                {submitError}
              </div>
            )}

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => {
                  setSubmitError(null);
                  setStep(2);
                }}
                className="order-2 rounded-lg border-2 border-blue-900 bg-white px-6 py-3 font-semibold text-blue-900 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-800 sm:order-1"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="order-1 rounded-lg bg-blue-900 px-6 py-3 font-semibold text-white hover:bg-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:order-2 sm:ml-auto"
              >
                {submitting ? "Submitting…" : "Submit Report"}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

function DisclaimerContent({
  onContinue,
}: {
  onContinue: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-8">
      <div className="max-w-none text-black">
        <p className="text-lg font-semibold">
          ⚠️ Important Notice:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-neutral-900">
          <li>
            <strong>Emergency:</strong> Call 911 immediately
          </li>
          <li>
            <strong>Help:</strong> Safespot:{" "}
            <a className="text-blue-900 underline" href="tel:800-972-0590">
              800-972-0590
            </a>{" "}
            and National Overdose Response Service{" "}
            <a className="text-blue-900 underline" href="tel:1-888-688-6677">
              1-888-688-NORS (6677)
            </a>
          </li>
          <li>
            Call the Alcohol Drug Helpline on{" "}
            <a className="text-blue-900 underline" href="tel:1-800-787-7797">
              1-800-787-7797
            </a>{" "}
            or text 8681, available 24/7.
          </li>
        </ul>

        <p className="mt-8 text-lg font-semibold">Privacy:</p>
        <ul className="mt-2 list-none space-y-1 pl-0 text-neutral-900">
          <li>✓ Your report is completely confidential</li>
          <li>
            ✓ You don&apos;t need to provide any personal information if you
            don&apos;t want to
          </li>
          <li>
            ✓ Your information will not be shared with law enforcement
          </li>
          <li>
            ✓ Providing as much detail as possible helps us keep others safe
          </li>
          <li>✓ The form takes about 2-3 minutes to complete</li>
        </ul>
        <p className="mt-4 text-neutral-900">
          You can find out more about how we use this information by checking
          our{" "}
          <a
            href={PRIVACY_POLICY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-900 underline"
          >
            Privacy Policy
          </a>
          .
        </p>

        <p className="mt-8 text-lg font-semibold">What we collect</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-neutral-900">
          <li>When &amp; rough area it happened</li>
          <li>What you planned to take vs got</li>
          <li>How it was used &amp; what it looked like</li>
          <li>Your experience (effects, timing)</li>
          <li>Photo (optional, helps ID supply)</li>
          <li>Email (optional, only if you want updates)</li>
        </ul>

        <p className="mt-8 text-lg font-semibold">How your report helps</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-neutral-900">
          <li>Spot dangerous/contaminated batches</li>
          <li>Warn others about local supply risks</li>
          <li>Track patterns across BC communities</li>
          <li>Shape better harm reduction programs</li>
          <li>Guide advocacy for safer treatment options</li>
        </ul>
      </div>

      <div className="mt-10">
        <button
          type="button"
          onClick={onContinue}
          className="w-full rounded-lg bg-blue-900 px-6 py-3.5 text-base font-semibold text-white hover:bg-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 sm:w-auto"
        >
          I Understand, Continue →
        </button>
      </div>
    </div>
  );
}
