import React, { useState } from "react";
import axios from "axios";
import { Phone, MapPin, Clock, Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHero, SectionHeading } from "@/components/primitives";
import { CONTACT } from "@/data/becci";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ROWS = [
  { icon: Phone, label: "Phone", value: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/\s/g, "")}` },
  { icon: MapPin, label: "Registered office", value: CONTACT.address },
  { icon: Clock, label: "Hours", value: CONTACT.hours },
  { icon: Globe, label: "Website", value: CONTACT.website, href: `https://${CONTACT.website}` },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", organisation: "", message: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      toast("Please add your name, phone and a short message.");
      return;
    }
    setSending(true);
    try {
      await axios.post(`${API}/enquiries`, form);
      setDone(true);
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

  const field = "w-full rounded-sm border border-navy-800/15 bg-white px-4 py-3 font-body text-sm text-navy-950 outline-none transition-colors placeholder:text-navy-800/40 focus:border-navy-600";

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to the chamber."
        intro="Call us, or leave your details and BECCI will get back to you."
      />

      <section className="bg-white py-20 md:py-28">
        <div className="becci-container grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Contact details" title={CONTACT.org} className="mb-10" />
            <div className="divide-y divide-navy-800/10 border-y border-navy-800/10">
              {ROWS.map((r) => (
                <div key={r.label} className="flex items-start gap-5 py-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-navy-50 text-navy-700">
                    <r.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-navy-800/50">{r.label}</p>
                    {r.href ? (
                      <a href={r.href} target={r.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                         data-testid={`contact-${r.label.toLowerCase().split(" ")[0]}`}
                         className="link-underline mt-1 inline-block font-body text-base text-navy-950">
                        {r.value}
                      </a>
                    ) : (
                      <p className="mt-1 font-body text-base leading-relaxed text-navy-950">{r.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 font-body text-xs leading-relaxed text-navy-800/55">
              {CONTACT.incorporation} · CIN {CONTACT.cin}
            </p>
          </div>

          {/* Enquiry form */}
          <div className="rounded-sm border border-navy-800/10 bg-navy-50/40 p-8 md:p-10">
            <h3 className="font-heading text-xl font-semibold text-navy-950">Send an enquiry</h3>
            <p className="mt-2 font-body text-sm text-navy-800/65">
              Share a few details and we’ll call you back during working hours.
            </p>
            {done ? (
              <div data-testid="enquiry-success" className="mt-8 rounded-sm border-l-2 border-gold bg-white p-6">
                <p className="font-heading text-base font-semibold text-navy-950">Your enquiry has reached BECCI.</p>
                <p className="mt-2 font-body text-sm text-navy-800/70">
                  We’ll be in touch on the number you shared. For anything urgent, call {CONTACT.phone}.
                </p>
                <button onClick={() => setDone(false)} className="mt-5 font-heading text-sm font-semibold text-navy-700 link-underline" data-testid="enquiry-reset">
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-7 space-y-4" data-testid="enquiry-form">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input aria-label="Your name" data-testid="enquiry-name" className={field} placeholder="Your name *" value={form.name} onChange={update("name")} />
                  <input aria-label="Phone" data-testid="enquiry-phone" className={field} placeholder="Phone *" value={form.phone} onChange={update("phone")} />
                </div>
                <input aria-label="Organisation" data-testid="enquiry-org" className={field} placeholder="Organisation (optional)" value={form.organisation} onChange={update("organisation")} />
                <textarea aria-label="Message" data-testid="enquiry-message" rows={4} className={field} placeholder="How can BECCI help? *" value={form.message} onChange={update("message")} />
                <button
                  type="submit"
                  disabled={sending}
                  data-testid="enquiry-submit"
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-navy-900 px-6 py-3 font-heading text-sm font-semibold text-white transition-colors hover:bg-navy-700 disabled:opacity-60"
                >
                  {sending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {sending ? "Sending…" : "Send enquiry"}
                </button>
                <p className="font-body text-xs leading-relaxed text-navy-800/50">
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
