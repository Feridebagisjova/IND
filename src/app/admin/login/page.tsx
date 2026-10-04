"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IndFooter } from "@/components/IndFooter";
import { IndHeader } from "@/components/IndHeader";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@ind.nl");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Inloggen mislukt");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <IndHeader loginHref="/admin/login" loginLabel="Inloggen" />
      <main id="main-content" className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="ind-content-panel w-full max-w-md">
          <Link href="/" className="text-sm text-[var(--muted)] hover:underline">
            ← Terug naar home
          </Link>
          <h1 className="ind-page-title mt-4">Admin login</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Log in om het admin portaal te openen.</p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="label" htmlFor="email">
                E-mailadres
              </label>
              <input
                id="email"
                className="input"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="password">
                Wachtwoord
              </label>
              <input
                id="password"
                className="input"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            {error && <div className="ind-error-box text-sm">{error}</div>}
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? "Bezig..." : "Inloggen"}
            </button>
          </form>
        </div>
      </main>
      <IndFooter />
    </div>
  );
}
