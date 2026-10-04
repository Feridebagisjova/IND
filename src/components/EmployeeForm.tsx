"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Team = { id: string; name: string };
type NormProfile = { id: string; name: string };
type Employee = {
  id: string;
  name: string;
  email: string | null;
  teamId: string | null;
  normProfileId: string;
  hoursPerDay: number;
  active: boolean;
};

export function EmployeeForm({
  employee,
  teams,
  normProfiles,
}: {
  employee?: Employee;
  teams: Team[];
  normProfiles: NormProfile[];
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: employee?.name ?? "",
    email: employee?.email ?? "",
    teamId: employee?.teamId ?? "",
    normProfileId: employee?.normProfileId ?? normProfiles[0]?.id ?? "",
    hoursPerDay: employee?.hoursPerDay ?? 8,
    pinCode: "",
    active: employee?.active ?? true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch(employee ? `/api/admin/employees/${employee.id}` : "/api/admin/employees", {
      method: employee ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Opslaan mislukt");
      setLoading(false);
      return;
    }

    router.push("/admin/employees");
    router.refresh();
  }

  return (
    <form className="card space-y-4 p-6" onSubmit={handleSubmit}>
      <div>
        <label className="label">Naam</label>
        <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      </div>
      <div>
        <label className="label">E-mailadres / medewerker-ID</label>
        <input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <div>
        <label className="label">Team</label>
        <select className="input" value={form.teamId} onChange={(e) => setForm({ ...form, teamId: e.target.value })}>
          <option value="">Geen team</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">Normprofiel</label>
        <select
          className="input"
          value={form.normProfileId}
          onChange={(e) => setForm({ ...form, normProfileId: e.target.value })}
          required
        >
          {normProfiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">Standaard uren per dag</label>
        <input
          className="input"
          type="number"
          step="0.5"
          value={form.hoursPerDay}
          onChange={(e) => setForm({ ...form, hoursPerDay: Number(e.target.value) })}
          required
        />
      </div>
      <div>
        <label className="label">{employee ? "Nieuwe 4-cijfercode (optioneel)" : "4-cijfercode"}</label>
        <input
          className="input"
          type="password"
          pattern="[0-9]{4}"
          maxLength={4}
          value={form.pinCode}
          onChange={(e) => setForm({ ...form, pinCode: e.target.value })}
          required={!employee}
        />
      </div>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
        Actief
      </label>
      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Opslaan..." : "Opslaan"}
      </button>
    </form>
  );
}
