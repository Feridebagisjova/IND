"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type EmployeeOption = { id: string; name: string };

export function EmployeeLoginForm({ employees }: { employees: EmployeeOption[] }) {
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/employee/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId, pinCode }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Inloggen mislukt");
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
      <h1 className="ind-page-title mt-4">Inloggen</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Log in met uw naam en persoonlijke 4-cijfercode om uw productie te registreren.
      </p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="label" htmlFor="employee">
            Medewerker
          </label>
          <select
            id="employee"
            className="input"
            value={employeeId}
            onChange={(event) => setEmployeeId(event.target.value)}
            required
          >
            <option value="">Selecteer medewerker</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="pin">
            Persoonlijke 4-cijfercode
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
        {error && <div className="ind-error-box text-sm">{error}</div>}
        <button type="submit" className="btn btn-primary w-full text-lg" disabled={loading}>
          {loading ? "Bezig..." : "Inloggen"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--muted)]">
        Nog geen account?{" "}
        <Link href="/account" className="font-semibold text-[var(--primary)] hover:underline">
          Account maken
        </Link>
      </p>
    </>
  );
}
