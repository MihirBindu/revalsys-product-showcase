"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useHydrated } from "@/lib/useHydrated";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import GuestBanner from "@/components/auth/GuestBanner";

export default function LoginForm() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isGuest = useAuthStore((s) => s.isGuest);
  const login = useAuthStore((s) => s.login);
  const continueAsGuest = useAuthStore((s) => s.continueAsGuest);
  const logout = useAuthStore((s) => s.logout);
  const hydrated = useHydrated();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    login(email, name);
    router.push("/");
  }

  // Before hydration the persisted session is not readable without diverging
  // from the server HTML, so render the signed-out form until it is.
  if (hydrated && user) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 p-6">
        <p className="text-slate-700">
          Signed in as <span className="font-semibold text-slate-900">{user.name}</span> (
          {user.email})
        </p>
        <Button type="button" variant="outline" onClick={logout} className="self-start">
          Log out
        </Button>
      </div>
    );
  }

  if (hydrated && isGuest) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 p-6">
        <p className="text-slate-700">You&apos;re currently browsing as a guest.</p>
        <Button type="button" variant="outline" onClick={logout} className="self-start">
          Exit guest mode
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-slate-200 p-6">
        <Input
          id="name"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          autoComplete="name"
        />
        <Input
          id="email"
          type="email"
          label="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@example.com"
          autoComplete="email"
        />
        <p className="text-xs text-slate-500">
          This is a demo login for assignment purposes &mdash; no password or account
          verification is performed.
        </p>
        <Button type="submit">Sign in</Button>
      </form>

      <div className="flex flex-col gap-3">
        <GuestBanner />
        <Button type="button" variant="ghost" onClick={() => continueAsGuest()}>
          Continue as guest
        </Button>
      </div>
    </div>
  );
}
