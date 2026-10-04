import Link from "next/link";
import { KpiCard, PeriodFilters, RealizationBadge } from "@/components/AdminUi";
import { getDashboardData, getFilterOptions, type Period } from "@/lib/admin-data";
import { formatDeviation, formatNumber } from "@/lib/metrics";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: Period; employeeId?: string; teamId?: string }>;
}) {
  const params = await searchParams;
  const [data, filters] = await Promise.all([
    getDashboardData({
      period: params.period,
      employeeId: params.employeeId,
      teamId: params.teamId,
    }),
    getFilterOptions(),
  ]);

  const periodNormLabel =
    data.period === "week"
      ? `${formatNumber(data.weeklyDossierNorm, 0)} dossiers/week`
      : `${formatNumber(data.dossierNormPerEmployee, 1)} dossiers (${data.weeklyDossierNorm}/week)`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="ind-page-title">Productie Dashboard</h2>
        <p className="muted mt-1">
          Norm per medewerker: <strong>{data.weeklyDossierNorm} dossiers per week</strong>. Realisatie en afwijking
          worden berekend t.o.v. deze norm voor de geselecteerde periode.
        </p>
      </div>

      <PeriodFilters
        period={data.period}
        employeeId={params.employeeId}
        teamId={params.teamId}
        employees={filters.employees}
        teams={filters.teams}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Totale productie" value={formatNumber(data.totals.totalProduction, 0)} />
        <KpiCard label="Norm per medewerker" value={periodNormLabel} />
        <KpiCard
          label="Team realisatie (dossiers)"
          value={`${Math.round(data.totals.dossierRealization)}%`}
        />
        <KpiCard
          label="Gemiddelde realisatie medewerkers"
          value={`${Math.round(data.totals.averageDossierRealization)}%`}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="ind-info-box">
          <p className="text-sm">
            <strong>Team totaal:</strong> {formatNumber(data.totals.totalProduction, 0)} dossiers behaald van{" "}
            {formatNumber(data.totals.dossierNorm, 1)} verwacht ({formatNumber(data.totals.dossierRealization, 0)}%
            realisatie, afwijking {formatDeviation(data.totals.dossierDeviation)}).
          </p>
        </div>
        <div className="ind-info-box">
          <p className="text-sm">
            <strong>Gemiddelde medewerkers:</strong>{" "}
            {formatNumber(data.totals.averageDossierRealization, 0)}% realisatie, afwijking{" "}
            {formatDeviation(data.totals.averageDossierDeviation)} t.o.v. de norm.
          </p>
        </div>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Medewerker</th>
              <th>Team</th>
              <th>Norm dossiers</th>
              <th>Behaald</th>
              <th>Realisatie</th>
              <th>Afwijking t.o.v. norm</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <Link href={`/admin/employees/${row.id}`} className="font-medium text-[var(--primary)]">
                    {row.name}
                  </Link>
                </td>
                <td>{row.team}</td>
                <td>{formatNumber(row.dossierNorm, 1)}</td>
                <td>{formatNumber(row.totalProduction, 0)}</td>
                <td>
                  <RealizationBadge value={row.dossierRealization} color={row.dossierRealizationColor} />
                </td>
                <td>
                  <span className={`badge badge-${row.dossierRealizationColor}`}>
                    {formatDeviation(row.dossierDeviation)}
                  </span>
                </td>
                <td>{row.trend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
