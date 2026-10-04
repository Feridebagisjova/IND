import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export default async function RegistrationsPage() {
  const registrations = await prisma.registration.findMany({
    include: {
      employee: true,
      dossiers: true,
      activities: { include: { category: true } },
    },
    orderBy: { date: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Registraties</h2>
        <p className="muted mt-1">Overzicht van alle ingediende dagregistraties.</p>
      </div>
      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Medewerker</th>
              <th>Productie</th>
              <th>Dossiers</th>
              <th>Dossieruren</th>
              <th>Werkzaamheden</th>
              <th>Opmerking</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((registration) => (
              <tr key={registration.id}>
                <td>{format(registration.date, "dd-MM-yyyy")}</td>
                <td>{registration.employee.name}</td>
                <td>{registration.productionUnits}</td>
                <td>
                  {registration.dossiers.length
                    ? registration.dossiers.map((dossier) => `${dossier.title} (${dossier.hours}u)`).join(", ")
                    : "—"}
                </td>
                <td>{registration.productionHours > 0 ? `${registration.productionHours}u` : "—"}</td>
                <td>
                  {registration.activities.length
                    ? registration.activities
                        .map((activity) => `${activity.category.name} (${activity.hours}u)`)
                        .join(", ")
                    : "—"}
                </td>
                <td>{registration.comment ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
