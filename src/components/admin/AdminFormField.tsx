"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldProps = {
  label: string;
  error?: string;
};

export function InputField({
  label,
  error,
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-sm text-secondary">{label}</label>
      <input
        {...props}
        className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-primary placeholder:text-muted focus:border-accent-secondary focus:outline-none"
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

export function TextareaField({
  label,
  error,
  ...props
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label className="text-sm text-secondary">{label}</label>
      <textarea
        {...props}
        className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-primary placeholder:text-muted focus:border-accent-secondary focus:outline-none"
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

export function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm text-secondary">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-accent-secondary"
      />
      {label}
    </label>
  );
}
