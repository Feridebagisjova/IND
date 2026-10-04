import { redirect } from "next/navigation";
import { EmployeeRegistratieNav } from "@/components/EmployeeRegistratieNav";
import { IndShell } from "@/components/IndShell";
import { RegistrationForm } from "@/components/RegistrationForm";
import { getEmployeeSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseInputDate, toInputDateValue } from "@/lib/metrics";

export default async function RegistratiePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const session = await getEmployeeSession();
  if (!session) {
    redirect("/login");
  }

  const query = await searchParams;

  const [employee, categories] = await Promise.all([
    prisma.employee.findFirst({
      where: { id: session.employeeId, active: true },
      select: { id: true, name: true },
    }),
    prisma.activityCategory.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!employee) {
    redirect("/login");
  }

  const today = toInputDateValue(new Date());
  const initialDate = parseInputDate(query.date) ? toInputDateValue(parseInputDate(query.date)!) : today;

  return (
    <IndShell
      bannerTitle="Productie registreren"
      bannerSubtitle={`Welkom ${employee.name}. Bekijk of vul uw registratie per dag in.`}
      showQuickLinks={false}
      showAdminLink={false}
      showLogout
      employeeName={employee.name}
    >
      <section className="ind-content-section">
        <div className="ind-container">
          <div className="ind-content-panel">
            <EmployeeRegistratieNav active="form" />

            <div className="mb-6 border-b border-[var(--border)] pb-4">
              <h2 className="ind-page-title">Dagelijkse productie registreren</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Kies een datum om eerdere invoer te bekijken of uw registratie van vandaag door te geven. Bekijk al uw
                registraties via <strong>Mijn registraties</strong> hierboven.
              </p>
            </div>
            <RegistrationForm employee={employee} categories={categories} initialDate={initialDate} today={today} />
          </div>
        </div>
      </section>
    </IndShell>
  );
}
