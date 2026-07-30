import type { Metadata } from "next";

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
          This form is a static UI demo and does not send messages.
        </p>
        <form className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="contact-name" className="text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="contact-email" className="text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="contact-message" className="text-sm font-medium text-slate-700">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <button
            type="button"
            className="self-start rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Send message
          </button>
        </form>
      </section>
    </div>
  );
}
