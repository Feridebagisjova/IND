import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function EmployeesPage() {
  const employees = await prisma.employee.findMany({
    include: { team: true, normProfile: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Medewerkers</h2>
          <p className="muted mt-1">Beheer medewerkers, teams, normprofielen en status.</p>
        </div>
        <Link href="/admin/employees/new" className="btn btn-primary">
          + Medewerker toevoegen
        </Link>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Medewerker</th>
              <th>Team</th>
              <th>Uren/dag</th>
              <th>Normprofiel</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.team?.name ?? "—"}</td>
                <td>{employee.hoursPerDay}</td>
                <td>{employee.normProfile.name}</td>
                <td>{employee.active ? "Actief" : "Inactief"}</td>
                <td>
                  <Link href={`/admin/employees/${employee.id}/edit`} className="text-[var(--primary)]">
                    Bewerken
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
