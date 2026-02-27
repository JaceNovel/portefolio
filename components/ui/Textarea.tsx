import { TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export function Textarea({ label, error, className = "", id, ...props }: Props) {
  const inputId = id ?? props.name ?? label;
  return (
    <label className="flex w-full flex-col gap-1 text-sm">
      <span className="font-medium text-slate-200">{label}</span>
      <textarea
        id={inputId}
        className={`min-h-28 w-full resize-y rounded-xl border bg-slate-950/30 px-3 py-2 text-base text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-emerald-500/60 ${error ? "border-red-500" : "border-slate-800"} ${className}`}
        {...props}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
