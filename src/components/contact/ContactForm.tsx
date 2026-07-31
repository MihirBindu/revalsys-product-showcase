"use client";

import { FormEvent, useRef, useState } from "react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

interface FormValues {
  name: string;
  email: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const EMPTY: FormValues = { name: "", email: "", message: "" };

/** Deliberately permissive: enough to catch typos, not to police valid addresses. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Please enter your name.";
  }

  if (!values.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please enter a valid email address, e.g. jane@example.com.";
  }

  if (!values.message.trim()) {
    errors.message = "Please enter a message.";
  } else if (values.message.trim().length < 10) {
    errors.message = "Please provide a little more detail (at least 10 characters).";
  }

  return errors;
}

/**
 * The validation and feedback here are real; the delivery is not. There is no
 * backend in this project, so a submission that passes validation is
 * acknowledged and discarded — the confirmation says so rather than implying a
 * message was sent.
 */
export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function update(field: keyof FormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear the message as soon as the user starts correcting the field;
    // leaving it visible while they type reads as though it's still wrong.
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      // Move focus to the first problem so keyboard and screen-reader users
      // aren't left to hunt for what failed.
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)
        ?.focus();
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-6"
      >
        <p className="font-semibold text-emerald-800">Thanks, {values.name}.</p>
        <p className="text-sm text-emerald-700">
          Your details passed validation. This demo has no backend, so nothing
          was actually sent &mdash; in a real build this is where the submission
          would be posted to an API route.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setValues(EMPTY);
            setErrors({});
            setSubmitted(false);
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    // noValidate hands validation to the code above so the messages and focus
    // behaviour are consistent across browsers rather than native-dependent.
    <form ref={formRef} noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        id="contact-name"
        name="name"
        label="Name"
        autoComplete="name"
        value={values.name}
        error={errors.name}
        onChange={(e) => update("name", e.target.value)}
      />
      <Input
        id="contact-email"
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        value={values.email}
        error={errors.email}
        onChange={(e) => update("email", e.target.value)}
      />
      <Textarea
        id="contact-message"
        name="message"
        label="Message"
        rows={4}
        value={values.message}
        error={errors.message}
        onChange={(e) => update("message", e.target.value)}
      />
      <Button type="submit" className="self-start">
        Send message
      </Button>
    </form>
  );
}
