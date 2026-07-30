import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to NexusGadgets or continue as a guest.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Sign in</h1>
      <LoginForm />
    </div>
  );
}
