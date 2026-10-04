import Link from "next/link";
import { redirect } from "next/navigation";
import { EmployeeRegistratieNav } from "@/components/EmployeeRegistratieNav";
import { IndShell } from "@/components/IndShell";
import { getEmployeeSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toInputDateValue } from "@/lib/metrics";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

export default async function RegistratieOverzichtPage() {
  const session = await getEmployeeSession();
  if (!session) {
    redirect("/login");
  }

  const employee = await prisma.employee.findFirst({
    where: { id: session.employeeId, active: true },
    select: { id: true, name: true },
  });

  if (!employee) {
    redirect("/login");
  }

  const registrations = await prisma.registration.findMany({
    where: { employeeId: employee.id },
    include: {
      dossiers: { orderBy: { title: "asc" } },
      activities: { include: { category: true } },
    },
    orderBy: { date: "desc" },
  });

  return (
    <IndShell
      bannerTitle="Mijn registraties"
      bannerSubtitle={`Overzicht van al uw ingediende registraties, ${employee.name}.`}
      showQuickLinks={false}
      showAdminLink={false}
      showLogout
      employeeName={employee.name}
    >
      <section className="ind-content-section">
        <div className="ind-container">
          <div className="ind-content-panel">
            <EmployeeRegistratieNav active="list" />

            <div className="mb-6 border-b border-[var(--border)] pb-4">
              <h2 className="ind-page-title">Al mijn registraties</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Bekijk hier al uw eerdere registraties. Klik op een datum om de invoer te bekijken of aan te passen.
              </p>
            </div>

            {registrations.length === 0 ? (
              <div className="ind-empty-state">
                <p className="text-sm text-[var(--muted)]">U heeft nog geen registraties ingediend.</p>
                <Link href="/registratie" className="btn btn-primary mt-4 inline-flex">
                  Eerste registratie invullen
                </Link>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Datum</th>
                      <th>Dossiers</th>
                      <th>Dossieruren</th>
                      <th>Overige werkzaamheden</th>
                      <th>Opmerking</th>
                      <th>Actie</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((registration) => (
                      <tr key={registration.id}>
                        <td>
                          <strong>{format(registration.date, "d MMMM yyyy", { locale: nl })}</strong>
                          <div className="text-xs text-[var(--muted)]">
                            {format(registration.date, "EEEE", { locale: nl })}
                          </div>
                        </td>
                        <td>
                          {registration.dossiers.length ? (
                            <ul className="ind-registration-list">
                              {registration.dossiers.map((dossier) => (
                                <li key={dossier.id}>
                                  {dossier.title} ({dossier.hours.toLocaleString("nl-NL")}u)
                                </li>
                              ))}
                            </ul>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td>
                          {registration.productionHours > 0
                            ? `${registration.productionHours.toLocaleString("nl-NL")} uur`
                            : "—"}
                        </td>
                        <td>
                          {registration.activities.length ? (
                            <ul className="ind-registration-list">
                              {registration.activities.map((activity) => (
                                <li key={activity.id}>
                                  {activity.category.name} ({activity.hours.toLocaleString("nl-NL")}u)
                                </li>
                              ))}
                            </ul>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td>{registration.comment ?? "—"}</td>
                        <td>
                          <Link
                            href={`/registratie?date=${toInputDateValue(registration.date)}`}
                            className="ind-text-link"
                          >
                            Bekijken / bewerken
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p className="mt-6 text-sm text-[var(--muted)]">
              Totaal: <strong>{registrations.length}</strong> registratie
              {registrations.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </section>
    </IndShell>
  );
}
