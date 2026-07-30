import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

// Each variant carries its own focus ring: the browser default outline is
// close to invisible against the filled indigo and slate backgrounds.
const variantClasses: Record<Variant, string> = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300 focus-visible:ring-indigo-500",
  secondary:
    "bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-400 focus-visible:ring-slate-700",
  outline:
    "border border-slate-300 text-slate-900 hover:bg-slate-50 disabled:text-slate-400 focus-visible:ring-slate-500",
  ghost:
    "text-slate-700 hover:bg-slate-100 disabled:text-slate-400 focus-visible:ring-slate-400",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}
