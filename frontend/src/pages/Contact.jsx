import React, { useRef, useState } from "react";
import axios from "axios";
import { Phone, MapPin, Clock, Globe, Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Eyebrow } from "@/components/primitives";
import { InstitutionalSeal } from "@/components/Logo";
import { GlassSpotlight } from "@/components/visuals/MotionPrimitives";
import { CONTACT } from "@/data/becci";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = BACKEND_URL ? `${BACKEND_URL}/api` : "/api";

const ROWS = [
  { icon: Phone, label: "Phone", value: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/\s/g, "")}` },
  { icon: MapPin, label: "Registered office", value: CONTACT.address },
  { icon: Clock, label: "Hours", value: CONTACT.hours },
  { icon: Globe, label: "Website", value: CONTACT.website, href: `https://${CONTACT.website}` },
  { icon: Building2, label: "Corporate Registry", value: `${CONTACT.incorporation} · CIN ${CONTACT.cin}` },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", organisation: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const messageRef = useRef(null);

  const update = (k) => (e) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, [k]: val }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Enter your full name.";
    if (!form.phone.trim()) nextErrors.phone = "Enter a phone number so BECCI can call you back.";
    if (!form.message.trim()) nextErrors.message = "Add a short note describing your enquiry.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast("Please add your name, phone and a short message.");
      if (nextErrors.name) nameRef.current?.focus();
      else if (nextErrors.phone) phoneRef.current?.focus();
      else if (nextErrors.message) messageRef.current?.focus();
      return;
    }

    setSending(true);
    try {
      await axios.post(`${API}/enquiries`, form);
      setDone(true);
      setErrors({});
      setForm({ name: "", phone: "", organisation: "", message: "" });
      toast.success("Thank you — your enquiry has reached BECCI.", {
        description: "The team will reach out to you on the phone number you shared.",
      });
    } catch (err) {
      toast.error("Something went wrong. Please call us on " + CONTACT.phone + ".");
    } finally {
      setSending(false);
    }
  };

  const field = (hasError) =>
    `w-full rounded-xl border bg-white/90 px-4 py-3 font-body text-sm text-navy-950 transition-colors placeholder:text-navy-800/40 focus:bg-white ${
      hasError ? "border-burgundy focus:border-burgundy" : "border-navy-800/15 focus:border-teal-deep"
    }`;

  return (
    <>
      {/* Minimal, Welcoming Architectural Frost Opening (unique to Contact — immediate access above the fold) */}
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
              Talk to the chamber.
            </h1>
            <p className="mt-4 max-w-2xl font-body text-lead text-navy-800/80">
              Call us directly during working hours, or leave your details and our office will call you back.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-14">
            <GlassSpotlight tone="light" className="glass-light rounded-3xl p-7 sm:p-9">
              <div className="relative z-10 flex items-center gap-4 border-b border-navy-800/10 pb-6">
                <InstitutionalSeal className="h-14 w-14 shrink-0" />
                <div>
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
                    <div>
                      <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-navy-800/60">
                        {r.label}
                      </p>
                      {r.href ? (
                        <a
                          href={r.href}
                          target={r.href.startsWith("http") ? "_blank" : undefined}
                          rel="noreferrer"
                          data-testid={`contact-${r.label.toLowerCase().split(" ")[0]}`}
                          className="link-underline mt-1 inline-block font-body text-base font-medium text-navy-950 hover:text-teal-ink"
                        >
                          {r.value}
                        </a>
                      ) : (
                        <p className="mt-1 font-body text-base leading-relaxed text-navy-950">{r.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </GlassSpotlight>

            {/* Enquiry form */}
            <GlassSpotlight tone="light" className="glass-light rounded-3xl p-8 md:p-10">
              <div className="relative z-10">
                <span className="eyebrow text-teal-deep">Send an enquiry</span>
                <h2 className="mt-3 font-heading text-2xl font-bold text-navy-950">Write to BECCI.</h2>
                <p className="mt-2 font-body text-sm text-navy-800/75">
                  Share your details and we’ll call you back during working hours.
                </p>
                {done ? (
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
                      onClick={() => setDone(false)}
                      className="mt-5 font-heading text-sm font-semibold text-teal-deep link-underline"
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
                      Your name *
                    </label>
                    <input
                      ref={nameRef}
                      id="enquiry-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      aria-label="Your name"
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
                      Phone *
                    </label>
                    <input
                      ref={phoneRef}
                      id="enquiry-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      aria-label="Phone"
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
                    Organisation (optional)
                  </label>
                  <input
                    id="enquiry-org"
                    name="organisation"
                    type="text"
                    autoComplete="organization"
                    aria-label="Organisation"
                    data-testid="enquiry-org"
                    className={field(false)}
                    placeholder="Enterprise, trade or institution…"
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
                    aria-label="Message"
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "err-message" : undefined}
                    data-testid="enquiry-message"
                    rows={4}
                    className={field(errors.message)}
                    placeholder="How can BECCI help?…"
                    value={form.message}
                    onChange={update("message")}
                  />
                  {errors.message && (
                    <p id="err-message" role="alert" className="mt-1 font-body text-xs text-burgundy">
                      {errors.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  data-testid="enquiry-submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-navy-950 px-8 py-3.5 font-heading text-sm font-semibold text-white shadow-soft transition-[transform,background-color] duration-150 ease-out hover:bg-teal-deep active:scale-[0.98] disabled:opacity-60"
                >
                  {sending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  <span>{sending ? "Sending…" : "Send enquiry"}</span>
                </button>
                  <p className="font-body text-xs leading-relaxed text-navy-800/55">
                    BECCI will only use these details to respond to your enquiry.
                  </p>
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
