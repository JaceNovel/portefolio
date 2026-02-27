import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, className = "", id, ...props }: Props) {
  const inputId = id ?? props.name ?? label;
  return (
    <label className="flex w-full flex-col gap-1 text-sm">
      <span className="font-medium text-slate-200">{label}</span>
      <input
        id={inputId}
        className={`h-11 w-full rounded-xl border bg-slate-950/30 px-3 text-base text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-emerald-500/60 ${error ? "border-red-500" : "border-slate-800"} ${className}`}
        {...props}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
