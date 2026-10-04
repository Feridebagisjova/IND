export function RealizationBadge({
  value,
  color,
}: {
  value: number;
  color: "green" | "orange" | "red";
}) {
  return <span className={`badge badge-${color}`}>{Math.round(value)}%</span>;
}

export function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}

export function PeriodFilters({
  period,
  employeeId,
  teamId,
  employees,
  teams,
}: {
  period: string;
  employeeId?: string;
  teamId?: string;
  employees: Array<{ id: string; name: string }>;
  teams: Array<{ id: string; name: string }>;
}) {
  return (
    <form method="get" className="card grid gap-4 p-4 md:grid-cols-4">
      <div>
        <label className="label">Periode</label>
        <select name="period" defaultValue={period} className="input">
          <option value="today">Vandaag</option>
          <option value="week">Week</option>
          <option value="month">Maand</option>
          <option value="year">Jaar</option>
        </select>
      </div>
      <div>
        <label className="label">Medewerker</label>
        <select name="employeeId" defaultValue={employeeId ?? ""} className="input">
          <option value="">Alle medewerkers</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">Team</label>
        <select name="teamId" defaultValue={teamId ?? ""} className="input">
          <option value="">Alle teams</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-end">
        <button type="submit" className="btn btn-primary w-full">
          Filter toepassen
        </button>
      </div>
    </form>
  );
}
