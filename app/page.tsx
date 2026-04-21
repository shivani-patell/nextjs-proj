"use client";

import SurveyHeader from "@/components/SurveyHeader";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";

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
  collaborationContact: string;
  receiveResults: boolean;
  resultsContact: string;
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
  collaborationContact: "",
  receiveResults: false,
  resultsContact: "",
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
  if (!f.incidentDate.trim()) return "Please enter the date of your entry.";
  if (!f.incidentTime.trim()) return "Please enter the time.";
  if (!f.area.trim()) {
    return "Please enter the area or neighbourhood where you experienced the unusual effects.";
  }
  if (!f.intended.trim()) return "Please tell us what you planned to take.";
  if (!f.gotExpected) return "Please answer whether you got what you expected.";
  if (!f.route) return "Please select how it was taken.";
  if (f.route === "other" && !f.routeOther.trim()) {
    return "Please describe how it was taken (Other).";
  }
  if (!f.source) return "Please tell us if the source was usual or new.";
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
  if (f.receiveResults && !f.resultsContact.trim()) {
    return "Please share contact information so we can send community results.";
  }
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
      fd.append("collaborationContact", form.collaborationContact);
      fd.append("receiveResults", String(form.receiveResults));
      fd.append("resultsContact", form.resultsContact);
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
      <SurveyHeader />

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
            <h2 className="mb-4 text-xl font-bold text-black">
              Survey questions
            </h2>
            <p className="mb-6 text-neutral-800">
              This community survey helps us understand what is working, what
              is missing, and how we can improve services. This project adds to
              existing tools. It is not here to replace them.
            </p>
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
                  1. Date of your entry
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

              <div className="rounded-xl border border-neutral-300 bg-neutral-50 p-5 text-black shadow-sm">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.receiveResults}
                    onChange={(e) =>
                      setField("receiveResults", e.target.checked)
                    }
                    className="mt-1 h-4 w-4 accent-blue-900"
                  />
                  <span className="text-neutral-900">
                    <span className="font-semibold">
                      Do you want to receive results?
                    </span>{" "}
                    We can share findings from this community-based survey and
                    disseminate them back to community members and partners.
                  </span>
                </label>
                {form.receiveResults && (
                  <div className="mt-4">
                    <label className={labelClass} htmlFor="results-contact">
                      Preferred contact method
                    </label>
                    <input
                      id="results-contact"
                      type="text"
                      value={form.resultsContact}
                      onChange={(e) =>
                        setField("resultsContact", e.target.value)
                      }
                      placeholder="Email, phone, or another way to reach you"
                      className={inputClass}
                      autoComplete="off"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="area">
                  2. What was the area/neighbourhood where you experienced the
                  unusual effects?
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
                  3. What did you plan to take?
                </label>
                <input
                  id="intended"
                  type="text"
                  value={form.intended}
                  onChange={(e) => setField("intended", e.target.value)}
                      placeholder="For example: fentanyl, heroin, cocaine"
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
                      Tell us about the new source (optional)
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
                    Photo (optional)
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
                  <p className="mt-2 text-sm text-neutral-700">
                    Please do not upload photos that show faces, names,
                    addresses, phone numbers, ID cards, license plates, or
                    anything else that could identify you or someone else.
                  </p>
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
                <legend className={labelClass}>
                  9. How often are you using right now?
                </legend>
                <div className="flex flex-col gap-2">
                  {(
                    [
                      { value: "first", label: "First time" },
                      { value: "recent", label: "Started recently" },
                      { value: "common", label: "Often right now" },
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
                  10. How can we improve?
                </label>
                <textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) => setField("notes", e.target.value)}
                  placeholder="Tell us about barriers, service gaps, or ideas"
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
              NORS and SafeSpot are for overdose prevention support and
              monitoring. They are not emergency services. In an emergency,
              call 911.
            </p>

            <ul className="mb-10 grid gap-4 sm:grid-cols-1">
              <li className="rounded-xl border border-neutral-300 bg-neutral-50 p-5 text-black shadow-sm">
                <h3 className="font-bold">
                  National Overdose Response Service (NORS, Canada only)
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
                <h3 className="font-bold">SafeSpot (USA only)</h3>
                <p className="mt-1">
                  <a
                    href="tel:800-972-0590"
                    className="font-semibold text-blue-900 underline focus:outline-none focus:ring-2 focus:ring-blue-800"
                  >
                    800-972-0590
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
                    (optional) The overdose protection circle is a free virtual
                    harm reduction circle for people who use drugs. It is a
                    community-based space where people can connect with support,
                    share experiences, and access resources that may be helpful
                    to them. OPC also supports safe monitoring and overdose
                    prevention.
                  </span>
                </span>
              </label>
            </div>

            <p className="mt-6 text-neutral-800">
              We recognize that people may need personalized treatment options
              and individualized care pathways based on their goals and context.
            </p>

            <div className="mt-6 rounded-xl border border-neutral-300 bg-neutral-50 p-5 text-black shadow-sm">
              <label className={labelClass} htmlFor="collaboration-contact">
                Would you be interested in collaborating with us?
              </label>
              <textarea
                id="collaboration-contact"
                value={form.collaborationContact}
                onChange={(e) =>
                  setField("collaborationContact", e.target.value)
                }
                placeholder="If yes, please share your name, organization, or preferred contact information."
                rows={4}
                className={inputClass}
                autoComplete="off"
              />
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
        <p className="text-lg font-semibold">Before you start</p>
        <p className="mt-2 text-neutral-900">
          This survey is for people in Canada who use drugs, and for community
          partners supporting harm reduction. It is part of the J Healthcare
          Frontline Feedback project.
        </p>
        <p className="mt-3 text-neutral-900">
          We use this survey to find service gaps, understand barriers, and
          improve supports. This tool does not compete with other platforms. It
          helps fill a gap in the Vancouver and Canadian harm reduction
          landscape.
        </p>

        <p className="mt-8 text-lg font-semibold">What we collect</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-neutral-900">
          <li>Date, time, and rough area</li>
          <li>What you planned to take and what happened</li>
          <li>How it was used and the effects you noticed</li>
          <li>Optional photo of substance or packaging</li>
          <li>Optional contact details for follow-up or survey results</li>
        </ul>

        <p className="mt-8 text-lg font-semibold">Your choice and privacy</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-neutral-900">
          <li>Taking part is your choice</li>
          <li>You can skip any question</li>
          <li>You can stop at any time</li>
          <li>Please avoid sharing identifying information unless asked</li>
          <li>We do not share your information with law enforcement</li>
        </ul>
        <p className="mt-4 text-neutral-900">
          Your information may be used for research, advocacy, and learning
          where services are missing.
        </p>
        <p className="mt-3 text-neutral-900">
          Read our full{" "}
          <Link
            href="/privacy-policy"
            className="font-semibold text-blue-900 underline"
          >
            Privacy Policy
          </Link>
          .
        </p>

        <p className="mt-8 text-lg font-semibold">Emergency and support</p>
        <p className="mt-2 text-neutral-900">
          NORS and SafeSpot are for overdose prevention support and monitoring.
          They are not emergency services. In an emergency, call 911.
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-neutral-900">
          <li>
            <strong>Emergency:</strong> Call 911 right away
          </li>
          <li>
            <strong>NORS (Canada only):</strong>{" "}
            <a className="text-blue-900 underline" href="tel:1-888-688-6677">
              1-888-688-NORS (6677)
            </a>
          </li>
          <li>
            <strong>SafeSpot (USA only):</strong>{" "}
            <a className="text-blue-900 underline" href="tel:800-972-0590">
              800-972-0590
            </a>
          </li>
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
