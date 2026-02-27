import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({ className = "", variant = "primary", ...props }: Props) {
  const base =
    "inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60";
  const styles =
    variant === "primary"
      ? "bg-emerald-500/25 text-emerald-200 ring-1 ring-inset ring-emerald-500/35 hover:bg-emerald-500/35"
      : "border border-slate-800 bg-slate-950/65 text-slate-100 hover:bg-slate-900/65";

  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
