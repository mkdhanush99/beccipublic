import React, { useRef, useState } from "react";
import axios from "axios";
import { Phone, MapPin, Clock, Globe, Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHero, SectionHeading } from "@/components/primitives";
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
    `w-full rounded-xl border bg-white/85 px-4 py-3 font-body text-sm text-navy-950 transition-colors placeholder:text-navy-800/40 focus:bg-white ${
      hasError ? "border-burgundy focus:border-burgundy" : "border-navy-800/15 focus:border-navy-600"
    }`;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        meta="Begumpet, Hyderabad"
        title="Talk to the chamber."
        intro="Call us, or leave your details and BECCI will get back to you."
      />

      <section className="section bg-paper">
        <div className="becci-container grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Contact details" title={CONTACT.org} className="mb-10" />
            <div className="glass-light divide-y divide-navy-800/10 rounded-3xl px-7 py-2">
              {ROWS.map((r) => (
                <div key={r.label} className="flex items-start gap-4 py-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-950/[0.05] text-navy-700">
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
                        className="link-underline mt-1 inline-block font-body text-base font-medium text-navy-950"
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
          </div>

          {/* Enquiry form */}
          <div className="glass-light rounded-3xl p-8 md:p-10">
            <span className="eyebrow text-navy-700">Send an enquiry</span>
            <h2 className="mt-3 font-heading text-2xl font-bold text-navy-950">Write to BECCI.</h2>
            <p className="mt-2 font-body text-sm text-navy-800/75">
              Share your details and we’ll call you back during working hours.
            </p>
            {done ? (
              <div
                data-testid="enquiry-success"
                role="status"
                aria-live="polite"
                className="mt-8 rounded-2xl border border-navy-800/10 border-l-4 border-l-gold bg-white/90 p-6 shadow-soft"
              >
                <p className="font-heading text-base font-bold text-navy-950">Your enquiry has reached BECCI.</p>
                <p className="mt-2 font-body text-sm text-navy-800/75">
                  We’ll be in touch on the number you shared. For anything urgent, call {CONTACT.phone}.
                </p>
                <button
                  type="button"
                  onClick={() => setDone(false)}
                  className="mt-5 font-heading text-sm font-semibold text-navy-700 link-underline"
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
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-navy-950 px-8 py-3.5 font-heading text-sm font-semibold text-white shadow-soft transition-[transform,background-color] duration-150 ease-out hover:bg-navy-800 active:scale-[0.98] disabled:opacity-60"
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
        </div>
      </section>
    </>
  );
}
