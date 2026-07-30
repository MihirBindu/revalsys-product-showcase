import { ReactNode } from "react";

type Tone = "neutral" | "success" | "danger" | "info";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-slate-100 text-slate-700",
  success: "bg-emerald-100 text-emerald-700",
  danger: "bg-rose-100 text-rose-700",
  info: "bg-indigo-100 text-indigo-700",
};

export default function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  return (
    // shrink-0 + whitespace-nowrap: badges sit beside headings in flex rows, and
    // a long product name would otherwise squeeze the badge until its own text
    // wrapped — making "★ 4.5" two lines tall next to a single-line "★ 4.8".
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
