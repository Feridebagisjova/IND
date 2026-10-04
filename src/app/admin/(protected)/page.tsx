import Link from "next/link";
import { KpiCard, PeriodFilters, RealizationBadge } from "@/components/AdminUi";
import { getDashboardData, getFilterOptions, type Period } from "@/lib/admin-data";
import { formatNumber } from "@/lib/metrics";

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="ind-page-title">Productie Dashboard</h2>
        <p className="muted mt-1">Analyseer normen, gecorrigeerde normen en realisatie.</p>
      </div>

      <PeriodFilters
        period={data.period}
        employeeId={params.employeeId}
        teamId={params.teamId}
        employees={filters.employees}
        teams={filters.teams}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Totale productie" value={formatNumber(data.totals.totalProduction, 0)} />
        <KpiCard label="Gecorrigeerde norm" value={formatNumber(data.totals.totalCorrectedNorm, 1)} />
        <KpiCard label="Realisatie" value={`${Math.round(data.totals.realization)}%`} />
        <KpiCard label="Productieve uren" value={`${formatNumber(data.totals.totalAvailableHours, 0)} uur`} />
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Medewerker</th>
              <th>Team</th>
              <th>Productieve uren</th>
              <th>Andere werkzaamheden</th>
              <th>Gecorrigeerde norm</th>
              <th>Productie</th>
              <th>Realisatie</th>
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
                <td>{formatNumber(row.totalAvailableHours, 0)}</td>
                <td>{formatNumber(row.totalNonProductiveHours, 1)}</td>
                <td>{formatNumber(row.totalCorrectedNorm, 1)}</td>
                <td>{formatNumber(row.totalProduction, 0)}</td>
                <td>
                  <RealizationBadge value={row.realization} color={row.realizationColor} />
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
