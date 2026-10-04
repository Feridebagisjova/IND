import { getCompletenessData } from "@/lib/admin-data";
import { format } from "date-fns";

export default async function CompletenessPage() {
  const data = await getCompletenessData("week");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Registratiegraad</h2>
        <p className="muted mt-1">Controleer of medewerkers dagelijks hebben geregistreerd.</p>
      </div>

      <div className="card p-5">
        <p className="text-sm text-[var(--muted)]">Registratiegraad deze week</p>
        <p className="mt-2 text-4xl font-semibold">{Math.round(data.completeness)}%</p>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Medewerker</th>
              {data.days.map((day) => (
                <th key={day.toISOString()}>{format(day, "EEE", { locale: undefined }).slice(0, 2)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                {row.dayStatuses.map((done, index) => (
                  <td key={index}>{done ? "✅" : "❌"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
