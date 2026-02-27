import { InputHTMLAttributes } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  error?: string;
};

export function Checkbox({ label, error, className = "", ...props }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          className={`mt-1 h-4 w-4 rounded border-slate-700 bg-slate-950/30 ${className}`}
          {...props}
        />
        <span className="text-slate-200">{label}</span>
      </label>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
