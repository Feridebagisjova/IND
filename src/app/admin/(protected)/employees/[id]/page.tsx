import Link from "next/link";
import { RealizationBadge } from "@/components/AdminUi";
import { getEmployeeDetail, type Period } from "@/lib/admin-data";
import { formatNumber } from "@/lib/metrics";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { notFound } from "next/navigation";

export default async function EmployeeDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ period?: Period }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const detail = await getEmployeeDetail(id, query.period ?? "month");
  if (!detail) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/employees" className="text-sm text-[var(--muted)]">
          ← Terug naar medewerkers
        </Link>
        <h2 className="mt-2 text-2xl font-semibold">{detail.employee.name}</h2>
        <p className="muted">{format(new Date(), "MMMM yyyy", { locale: nl })}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <div className="card p-4">
          <p className="text-sm text-[var(--muted)]">Basisnorm</p>
          <p className="mt-2 text-2xl font-semibold">{formatNumber(detail.summary.baseNorm, 0)}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-[var(--muted)]">Gecorrigeerde norm</p>
          <p className="mt-2 text-2xl font-semibold">{formatNumber(detail.summary.totalCorrectedNorm, 1)}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-[var(--muted)]">Productie</p>
          <p className="mt-2 text-2xl font-semibold">{formatNumber(detail.summary.totalProduction, 0)}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-[var(--muted)]">Realisatie</p>
          <p className="mt-2">
            <RealizationBadge value={detail.summary.realization} color={detail.summary.realizationColor} />
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-[var(--muted)]">Andere werkzaamheden</p>
          <p className="mt-2 text-2xl font-semibold">
            {formatNumber(detail.summary.totalNonProductiveHours, 0)} uur
          </p>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="text-lg font-semibold">Verdeling andere werkzaamheden</h3>
        <div className="table-wrap mt-4">
          <table>
            <thead>
              <tr>
                <th>Activiteit</th>
                <th>Uren</th>
              </tr>
            </thead>
            <tbody>
              {detail.activityTotals.map((activity) => (
                <tr key={activity.name}>
                  <td>{activity.name}</td>
                  <td>{formatNumber(activity.hours, 1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Productie</th>
              <th>Dossiers</th>
              <th>Dossieruren</th>
              <th>Gecorrigeerde norm</th>
              <th>Realisatie</th>
              <th>Werkzaamheden</th>
              <th>Opmerking</th>
            </tr>
          </thead>
          <tbody>
            {detail.dailyRows.map((row) => (
              <tr key={row.date.toISOString()}>
                <td>{format(row.date, "dd-MM-yyyy")}</td>
                <td>{formatNumber(row.production, 0)}</td>
                <td>
                  {row.dossiers.length
                    ? row.dossiers
                        .map((dossier) => `${dossier.title} (${formatNumber(dossier.hours, 1)}u)`)
                        .join(", ")
                    : "—"}
                </td>
                <td>{row.productionHours > 0 ? `${formatNumber(row.productionHours, 1)}u` : "—"}</td>
                <td>{formatNumber(row.correctedNorm, 1)}</td>
                <td>{Math.round(row.realization)}%</td>
                <td>
                  {row.activities.length
                    ? row.activities
                        .map((activity) => `${activity.category.name} (${formatNumber(activity.hours, 1)}u)`)
                        .join(", ")
                    : "—"}
                </td>
                <td>{row.comment ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
