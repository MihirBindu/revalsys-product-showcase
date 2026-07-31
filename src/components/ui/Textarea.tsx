"use client";

import type { TextareaHTMLAttributes } from "react";
import {
  FieldShell,
  fieldControlClass,
  useFieldIds,
} from "@/components/ui/Field";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function Textarea({
  label,
  error,
  id,
  className = "",
  ...props
}: TextareaProps) {
  const { fieldId, errorId } = useFieldIds(id);

  return (
    <FieldShell
      error={error}
      errorId={errorId}
      fieldId={fieldId}
      label={label}
    >
      <textarea
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={fieldControlClass(error, className)}
        {...props}
      />
    </FieldShell>
  );
}
