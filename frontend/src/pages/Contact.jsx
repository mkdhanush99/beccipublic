import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Phone, MapPin, Clock, Globe, Building2, Loader2, Copy, Check, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Eyebrow } from "@/components/primitives";
import { InstitutionalSeal } from "@/components/Logo";
import { GlassSpotlight } from "@/components/visuals/MotionPrimitives";
import { CONTACT } from "@/data/becci";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const HAS_BACKEND = Boolean(BACKEND_URL && BACKEND_URL.trim());

const PATHWAY_TOPICS = [
  {
    id: "entrepreneur",
    label: "Entrepreneur / MSME",
    hint: "Enquire about Phase 01 outreach, enterprise formalisation orientation or government scheme links.",
    placeholder: "Tell us about your enterprise, sector or question…",
  },
  {
    id: "wings",
    label: "Women's & Youth Wings",
    hint: "Connect regarding dedicated forums for women entrepreneurs, students and young founders.",
    placeholder: "Share your background and how you would like to connect with our wings…",
  },
  {
    id: "institutional",
    label: "Institutions & Industry",
    hint: "For banks, industry bodies, academic institutions and prospective ecosystem collaborators.",
    placeholder: "Outline your institution and area of collaborative interest…",
  },
  {
    id: "official",
    label: "Official / Secretariat",
    hint: "Direct chamber correspondence, governance verification or general public enquiries.",
    placeholder: "How can BECCI’s registered office help?…",
  },
];

// Official confirmed contact channels only — unconfirmed email and social URLs intentionally omitted.
const ROWS = [
  { icon: Phone, label: "Phone", value: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/\s/g, "")}` },
  { icon: MapPin, label: "Registered office", value: CONTACT.address, sub: "Prior appointments recommended for in-person meetings." },
  { icon: Clock, label: "Hours", value: CONTACT.hours },
  { icon: Globe, label: "Website", value: CONTACT.website, href: `https://${CONTACT.website}` },
  { icon: Building2, label: "Corporate Registry", value: `${CONTACT.incorporation} · CIN ${CONTACT.cin}`, copyCin: true },
];

const formatEnquiryText = ({ topicLabel, name, phone, organisation, message }) =>
  [
    "BECCI Public Enquiry",
    `Category: ${topicLabel}`,
    `Name: ${name.trim()}`,
    `Mobile: ${phone.trim()}`,
    organisation.trim() ? `Organisation / State: ${organisation.trim()}` : null,
    `Message: ${message.trim()}`,
  ]
    .filter(Boolean)
    .join("\n");

export default function Contact() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTopic = PATHWAY_TOPICS.some((t) => t.id === searchParams.get("topic"))
    ? searchParams.get("topic")
    : "entrepreneur";

  const [topic, setTopic] = useState(initialTopic);
  const [form, setForm] = useState({ name: "", phone: "", organisation: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [mode, setMode] = useState("form"); // "form" | "prepared" | "sent"
  const [preparedText, setPreparedText] = useState("");
  const [copiedEnquiry, setCopiedEnquiry] = useState(false);
  const [copiedCin, setCopiedCin] = useState(false);

  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const messageRef = useRef(null);

  useEffect(() => {
    const q = searchParams.get("topic");
    if (q && PATHWAY_TOPICS.some((t) => t.id === q)) {
      setTopic(q);
    }
  }, [searchParams]);

  const activeTopic = PATHWAY_TOPICS.find((t) => t.id === topic) || PATHWAY_TOPICS[0];

  const selectTopic = (id) => {
    setTopic(id);
    setSearchParams({ topic: id }, { replace: true });
  };

  const copyCin = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.cin);
      setCopiedCin(true);
      toast.success("CIN copied to clipboard", { description: CONTACT.cin });
      window.setTimeout(() => setCopiedCin(false), 2200);
    } catch {
      toast(CONTACT.cin);
    }
  };

  const copyPrepared = async () => {
    try {
      await navigator.clipboard.writeText(preparedText);
      setCopiedEnquiry(true);
      toast.success("Enquiry copied to clipboard");
      window.setTimeout(() => setCopiedEnquiry(false), 2200);
    } catch {
      toast("Select and copy the enquiry text above.");
    }
  };

  const update = (k) => (e) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, [k]: val }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    const digits = form.phone.replace(/\D/g, "");
    const validPhone = digits.length === 10 || (digits.length === 12 && digits.startsWith("91"));

    if (!form.name.trim()) nextErrors.name = "Enter your full name.";
    if (!validPhone) nextErrors.phone = "Enter a valid 10-digit Indian mobile number.";
    if (!form.message.trim()) nextErrors.message = "Add a short note describing your enquiry.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast("Please check your name, 10-digit mobile number and message.");
      if (nextErrors.name) nameRef.current?.focus();
      else if (nextErrors.phone) phoneRef.current?.focus();
      else if (nextErrors.message) messageRef.current?.focus();
      return;
    }

    const formatted = formatEnquiryText({
      topicLabel: activeTopic.label,
      ...form,
    });

    // Honest static mode: never pretend to transmit when no backend URL is configured.
    if (!HAS_BACKEND) {
      setPreparedText(formatted);
      setMode("prepared");
      setErrors({});
      toast.success("Your enquiry is ready to copy.", {
        description: "Nothing was transmitted automatically — copy it or call " + CONTACT.phone + ".",
      });
      return;
    }

    setSending(true);
    try {
      await axios.post(`${BACKEND_URL}/api/enquiries`, {
        ...form,
        message: `[${activeTopic.label}] ${form.message.trim()}`,
      });
      setMode("sent");
      setErrors({});
      setForm({ name: "", phone: "", organisation: "", message: "" });
      toast.success("Thank you — your enquiry has reached BECCI.");
    } catch {
      // Graceful honest fallback if backend is unreachable
      setPreparedText(formatted);
      setMode("prepared");
      toast("Online submission is unavailable right now — your enquiry is ready to copy below.");
    } finally {
      setSending(false);
    }
  };

  const field = (hasError) =>
    `min-h-[44px] w-full rounded-xl border bg-white/95 px-4 py-3 font-body text-sm text-navy-950 transition-colors placeholder:text-navy-800/40 focus:bg-white ${
      hasError ? "border-burgundy focus:border-burgundy" : "border-navy-800/15 focus:border-teal-deep"
    }`;

  return (
    <>
      <section className="relative overflow-hidden bg-frost pb-24 pt-32 sm:pt-36 lg:pb-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 86% 14%, rgba(0,184,169,0.08), transparent 62%), radial-gradient(ellipse 50% 40% at 14% 80%, rgba(184,215,250,0.28), transparent 65%)",
          }}
        />

        <div className="becci-container relative z-10">
          <div className="mb-14 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <Eyebrow tone="teal">Contact BECCI</Eyebrow>
              <span className="rounded-full border border-ice bg-white/80 px-3 py-0.5 font-heading text-[0.68rem] font-semibold uppercase tracking-wider text-navy-800">
                Begumpet, Hyderabad
              </span>
            </div>
            <h1 className="mt-4 font-heading text-h1 font-bold text-navy-950">
              Talk to the BECCI secretariat.
            </h1>
            <p className="mt-4 max-w-2xl font-body text-lead text-navy-800/80">
              For membership, schemes, chapters, partnerships or media enquiries — call us directly during working hours, or prepare a structured enquiry below.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-14">
            <GlassSpotlight tone="light" className="glass-light min-w-0 rounded-3xl p-7 sm:p-9">
              <div className="relative z-10 flex items-center gap-4 border-b border-navy-800/10 pb-6">
                <InstitutionalSeal className="h-14 w-14 shrink-0" />
                <div className="min-w-0">
                  <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-teal-deep">
                    Registered Chamber Office
                  </p>
                  <h2 className="mt-1 font-heading text-lg font-bold text-navy-950">{CONTACT.org}</h2>
                </div>
              </div>

              <div className="relative z-10 divide-y divide-navy-800/10 pt-2">
                {ROWS.map((r) => (
                  <div key={r.label} className="flex items-start gap-4 py-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-mist/70 text-teal-deep">
                      <r.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-navy-800/60">
                        {r.label}
                      </p>
                      {r.href ? (
                        <a
                          href={r.href}
                          target={r.href.startsWith("http") ? "_blank" : undefined}
                          rel="noreferrer"
                          data-testid={`contact-${r.label.toLowerCase().split(" ")[0]}`}
                          className="link-underline mt-1 inline-flex min-h-[36px] items-center font-body text-base font-medium text-navy-950 hover:text-teal-ink"
                        >
                          {r.value}
                        </a>
                      ) : (
                        <div className="mt-1 flex items-start gap-2">
                          <p className="font-body text-base leading-relaxed text-navy-950">{r.value}</p>
                          {r.copyCin && (
                            <button
                              type="button"
                              onClick={copyCin}
                              data-testid="contact-copy-cin"
                              aria-label="Copy Corporate Identity Number"
                              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-navy-800/12 bg-white text-teal-deep transition-colors hover:bg-teal-mist"
                            >
                              {copiedCin ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                            </button>
                          )}
                        </div>
                      )}
                      {r.sub && (
                        <p className="mt-1 font-body text-xs text-navy-800/65">{r.sub}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </GlassSpotlight>

            {/* Honest Enquiry Form — prepares structured enquiry on static site without pretending to submit */}
            <GlassSpotlight tone="light" className="glass-light min-w-0 rounded-3xl p-8 md:p-10">
              <div className="relative z-10">
                <span className="eyebrow text-teal-deep">
                  {HAS_BACKEND ? "Send an enquiry" : "Prepare an enquiry"}
                </span>
                <h2 className="mt-3 font-heading text-2xl font-bold text-navy-950">
                  {HAS_BACKEND ? "Write to BECCI." : "Prepare your enquiry for BECCI."}
                </h2>
                <p className="mt-2 font-body text-sm text-navy-800/75">{activeTopic.hint}</p>

                {/* Audience Pathway Pills */}
                <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Select enquiry category">
                  {PATHWAY_TOPICS.map((t) => {
                    const active = topic === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => selectTopic(t.id)}
                        data-testid={`contact-topic-${t.id}`}
                        aria-pressed={active}
                        className={`min-h-[40px] rounded-full border px-3.5 py-1.5 font-heading text-xs font-semibold transition-colors ${
                          active
                            ? "border-navy-950 bg-navy-950 text-white"
                            : "border-navy-800/15 bg-white/85 text-navy-800 hover:border-teal-deep hover:text-teal-ink"
                        }`}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>

                {mode === "prepared" ? (
                  <div
                    data-testid="enquiry-prepared"
                    role="status"
                    aria-live="polite"
                    className="mt-8 rounded-2xl border border-teal/35 border-l-4 border-l-teal bg-white/95 p-6 shadow-soft"
                  >
                    <p className="font-heading text-base font-bold text-navy-950">Your enquiry is ready.</p>
                    <p className="mt-1.5 font-body text-xs leading-relaxed text-navy-800/75">
                      Nothing has been sent automatically — online form submission is being connected. Copy your formatted enquiry below or call{" "}
                      <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="font-semibold text-teal-ink underline">
                        {CONTACT.phone}
                      </a>{" "}
                      to share it directly with the BECCI secretariat.
                    </p>

                    <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-xl border border-ice bg-frost p-4 font-body text-xs leading-relaxed text-navy-950">
                      {preparedText}
                    </pre>

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={copyPrepared}
                        data-testid="copy-prepared-enquiry"
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-navy-950 px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-teal-deep"
                      >
                        {copiedEnquiry ? <Check className="h-4 w-4 text-teal-bright" aria-hidden="true" /> : <Copy className="h-4 w-4 text-teal-bright" aria-hidden="true" />}
                        <span>{copiedEnquiry ? "Enquiry copied" : "Copy enquiry"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setMode("form")}
                        data-testid="enquiry-edit"
                        className="inline-flex min-h-[44px] items-center rounded-full border border-navy-800/15 px-5 py-2.5 font-heading text-xs font-semibold text-navy-950 hover:border-teal-deep hover:text-teal-ink"
                      >
                        Edit enquiry
                      </button>
                    </div>
                  </div>
                ) : mode === "sent" ? (
                  <div
                    data-testid="enquiry-success"
                    role="status"
                    aria-live="polite"
                    className="mt-8 rounded-2xl border border-teal/30 border-l-4 border-l-teal bg-white/95 p-6 shadow-soft"
                  >
                    <p className="font-heading text-base font-bold text-navy-950">Your enquiry has reached BECCI.</p>
                    <p className="mt-2 font-body text-sm text-navy-800/75">
                      We’ll be in touch on the number you shared. For anything urgent, call {CONTACT.phone}.
                    </p>
                    <button
                      type="button"
                      onClick={() => setMode("form")}
                      className="mt-5 min-h-[40px] font-heading text-sm font-semibold text-teal-deep link-underline"
                      data-testid="enquiry-reset"
                    >
                      Send another enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submit} noValidate className="mt-7 space-y-4" data-testid="enquiry-form">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="enquiry-name" className="mb-1.5 block font-heading text-xs font-semibold text-navy-900">
                          Full name *
                        </label>
                        <input
                          ref={nameRef}
                          id="enquiry-name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          aria-invalid={Boolean(errors.name)}
                          aria-describedby={errors.name ? "err-name" : undefined}
                          data-testid="enquiry-name"
                          className={field(errors.name)}
                          placeholder="Your full name…"
                          value={form.name}
                          onChange={update("name")}
                        />
                        {errors.name && (
                          <p id="err-name" role="alert" className="mt-1 font-body text-xs text-burgundy">
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="enquiry-phone" className="mb-1.5 block font-heading text-xs font-semibold text-navy-900">
                          Mobile number (10 digits) *
                        </label>
                        <input
                          ref={phoneRef}
                          id="enquiry-phone"
                          name="phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          aria-invalid={Boolean(errors.phone)}
                          aria-describedby={errors.phone ? "err-phone" : undefined}
                          data-testid="enquiry-phone"
                          className={field(errors.phone)}
                          placeholder="+91 98765 43210…"
                          value={form.phone}
                          onChange={update("phone")}
                        />
                        {errors.phone && (
                          <p id="err-phone" role="alert" className="mt-1 font-body text-xs text-burgundy">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="enquiry-org" className="mb-1.5 block font-heading text-xs font-semibold text-navy-900">
                        Enterprise / Organisation &amp; State (optional)
                      </label>
                      <input
                        id="enquiry-org"
                        name="organisation"
                        type="text"
                        autoComplete="organization"
                        data-testid="enquiry-org"
                        className={field(false)}
                        placeholder="e.g. Manufacturing unit, Hyderabad, Telangana…"
                        value={form.organisation}
                        onChange={update("organisation")}
                      />
                    </div>
                    <div>
                      <label htmlFor="enquiry-message" className="mb-1.5 block font-heading text-xs font-semibold text-navy-900">
                        Message *
                      </label>
                      <textarea
                        ref={messageRef}
                        id="enquiry-message"
                        name="message"
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={errors.message ? "err-message" : undefined}
                        data-testid="enquiry-message"
                        rows={4}
                        className={field(errors.message)}
                        placeholder={activeTopic.placeholder}
                        value={form.message}
                        onChange={update("message")}
                      />
                      {errors.message && (
                        <p id="err-message" role="alert" className="mt-1 font-body text-xs text-burgundy">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-start gap-2.5 rounded-xl border border-ice bg-frost/85 px-4 py-3">
                      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-teal-deep" aria-hidden="true" />
                      <p className="font-body text-xs leading-relaxed text-navy-800/80">
                        Please do not include caste certificates, Aadhaar, PAN or government portal OTPs here.
                        {!HAS_BACKEND && " This form formats your enquiry locally on your device so you can copy it or call the secretariat."}
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={sending}
                      data-testid="enquiry-submit"
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-navy-950 px-8 py-3 font-heading text-sm font-semibold text-white shadow-soft transition-[transform,background-color] duration-150 ease-out hover:bg-teal-deep active:scale-[0.98] disabled:opacity-60"
                    >
                      {sending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                      <span>{sending ? "Sending…" : HAS_BACKEND ? "Send enquiry" : "Prepare enquiry"}</span>
                    </button>
                  </form>
                )}
              </div>
            </GlassSpotlight>
          </div>
        </div>
      </section>
    </>
  );
}
