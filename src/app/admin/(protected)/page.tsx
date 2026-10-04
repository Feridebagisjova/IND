import { AdminDashboardCharts, AdminEmployeeTable, type DashboardRow } from "@/components/AdminDashboardVisuals";
import { KpiCard, PeriodFilters } from "@/components/AdminUi";
import { getDashboardData, getFilterOptions, type Period } from "@/lib/admin-data";
import { formatDeviation, formatNumber } from "@/lib/metrics";

function serializeRows(rows: Awaited<ReturnType<typeof getDashboardData>>["rows"]): DashboardRow[] {
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    team: row.team,
    dossierNorm: row.dossierNorm,
    totalProduction: row.totalProduction,
    dossierRealization: row.dossierRealization,
    dossierDeviation: row.dossierDeviation,
    dossierRealizationColor: row.dossierRealizationColor,
    trend: row.trend,
    dossierEntries: row.dossierEntries.map((entry) => ({
      date: entry.date.toISOString(),
      title: entry.title,
      hours: entry.hours,
    })),
    activityEntries: row.activityEntries.map((entry) => ({
      date: entry.date.toISOString(),
      name: entry.name,
      hours: entry.hours,
    })),
  }));
}

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

  const rows = serializeRows(data.rows);

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
        <KpiCard label="Team realisatie (dossiers)" value={`${Math.round(data.totals.dossierRealization)}%`} />
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
            <strong>Gemiddelde medewerkers:</strong> {formatNumber(data.totals.averageDossierRealization, 0)}%
            realisatie, afwijking {formatDeviation(data.totals.averageDossierDeviation)} t.o.v. de norm.
          </p>
        </div>
      </div>

      <AdminDashboardCharts rows={rows} />

      <div>
        <h3 className="mb-3 text-lg font-semibold text-[var(--primary)]">Medewerkers</h3>
        <p className="mb-4 text-sm text-[var(--muted)]">
          Klik op een regel om dossiers en overige werkzaamheden met titel en uren uit te klappen.
        </p>
        <AdminEmployeeTable rows={rows} />
      </div>
    </div>
  );
}
