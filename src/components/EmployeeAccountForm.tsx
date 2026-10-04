"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function EmployeeAccountForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/employee/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email: email || null, pinCode, confirmPin }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Account aanmaken mislukt");
      setLoading(false);
      return;
    }

    router.push("/registratie");
    router.refresh();
  }

  return (
    <>
      <Link href="/" className="text-sm text-[var(--muted)] hover:underline">
        ← Terug naar home
      </Link>
      <h1 className="ind-page-title mt-4">Account maken</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Maak een account aan met uw naam en een persoonlijke 4-cijfercode.
      </p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="label" htmlFor="name">
            Naam
          </label>
          <input
            id="name"
            className="input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="email">
            E-mailadres <span className="text-[var(--muted)]">(optioneel)</span>
          </label>
          <input
            id="email"
            className="input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="pin">
            Kies een 4-cijfercode
          </label>
          <input
            id="pin"
            className="input"
            type="password"
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength={4}
            value={pinCode}
            onChange={(event) => setPinCode(event.target.value)}
            placeholder="••••"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="confirm-pin">
            Herhaal uw code
          </label>
          <input
            id="confirm-pin"
            className="input"
            type="password"
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength={4}
            value={confirmPin}
            onChange={(event) => setConfirmPin(event.target.value)}
            placeholder="••••"
            required
          />
        </div>
        {error && <div className="ind-error-box text-sm">{error}</div>}
        <button type="submit" className="btn btn-primary w-full text-lg" disabled={loading}>
          {loading ? "Bezig..." : "Account maken"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--muted)]">
        Heeft u al een account?{" "}
        <Link href="/login" className="font-semibold text-[var(--primary)] hover:underline">
          Inloggen
        </Link>
      </p>
    </>
  );
}
