"use client";

import { useState } from "react";

export default function SettingsPage({
  initial,
}: {
  initial: { thresholdGreen: number; thresholdOrange: number };
}) {
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setMessage(response.ok ? "Instellingen opgeslagen" : "Opslaan mislukt");
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Instellingen</h2>
        <p className="muted mt-1">Configureer drempels voor kleurcodering in dashboards.</p>
      </div>
      <form className="card space-y-4 p-6" onSubmit={handleSubmit}>
        <div>
          <label className="label">Groen vanaf (%)</label>
          <input
            className="input"
            type="number"
            value={form.thresholdGreen}
            onChange={(e) => setForm({ ...form, thresholdGreen: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="label">Oranje vanaf (%)</label>
          <input
            className="input"
            type="number"
            value={form.thresholdOrange}
            onChange={(e) => setForm({ ...form, thresholdOrange: Number(e.target.value) })}
          />
        </div>
        {message && <p className="text-sm text-[var(--primary)]">{message}</p>}
        <button type="submit" className="btn btn-primary">
          Opslaan
        </button>
      </form>
    </div>
  );
}
