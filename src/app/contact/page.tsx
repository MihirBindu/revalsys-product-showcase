import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the NexusGadgets team.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Contact Us</h1>
      <p className="mt-4 text-slate-600">
        Have a question about a product or this project? Reach out using the details
        below.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-900">Contact details</h2>
        <dl className="mt-4 space-y-3 text-slate-600">
          <div>
            <dt className="font-medium text-slate-900">Email</dt>
            <dd>support@nexusgadgets.example.com</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Hours</dt>
            <dd>Monday &ndash; Friday, 9am &ndash; 6pm</dd>
          </div>
        </dl>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-900">Send a message</h2>
        <p className="mt-2 text-sm text-slate-500">
          Validation runs for real; delivery does not &mdash; this build has no
          backend, so submissions are acknowledged rather than sent.
        </p>
        <div className="mt-4">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
