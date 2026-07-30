import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} NexusGadgets. Built as a technical assignment
          submission.
        </p>
        <nav aria-label="Footer" className="flex gap-6">
          <Link href="/about" className="text-sm text-slate-600 hover:text-slate-900">
            About Us
          </Link>
          <Link href="/contact" className="text-sm text-slate-600 hover:text-slate-900">
            Contact Us
          </Link>
          <Link href="/products" className="text-sm text-slate-600 hover:text-slate-900">
            Products
          </Link>
        </nav>
      </div>
    </footer>
  );
}
