import { redirect } from "next/navigation";
import { IndShell } from "@/components/IndShell";
import { RegistrationForm } from "@/components/RegistrationForm";
import { getEmployeeSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

export default async function RegistratiePage() {
  const session = await getEmployeeSession();
  if (!session) {
    redirect("/login");
  }

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

  const today = new Date();
  const todayLabel = format(today, "d MMMM yyyy", { locale: nl });

  return (
    <IndShell
      bannerTitle="Productie registreren"
      bannerSubtitle={`Welkom ${employee.name}. Vul hier uw registratie van vandaag in.`}
      showQuickLinks={false}
      showAdminLink={false}
      showLogout
      employeeName={employee.name}
    >
      <section className="ind-content-section">
        <div className="ind-container">
          <div className="ind-content-panel">
            <div className="mb-6 flex flex-col gap-2 border-b border-[var(--border)] pb-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="ind-page-title">Dagelijkse productie registreren</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Vul onderstaand formulier in om uw registratie van vandaag door te geven.
                </p>
              </div>
              <div className="ind-info-box inline-block text-sm">Vandaag — {todayLabel}</div>
            </div>
            <RegistrationForm employee={employee} categories={categories} today={today.toISOString()} />
          </div>
        </div>
      </section>
    </IndShell>
  );
}
