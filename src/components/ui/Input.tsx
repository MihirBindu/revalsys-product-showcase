"use client";

import type { InputHTMLAttributes } from "react";
import {
  FieldShell,
  fieldControlClass,
  useFieldIds,
} from "@/components/ui/Field";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  const { fieldId, errorId } = useFieldIds(id);

  return (
    <FieldShell
      error={error}
      errorId={errorId}
      fieldId={fieldId}
      label={label}
    >
      <input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={fieldControlClass(error, className)}
        {...props}
      />
    </FieldShell>
  );
}
