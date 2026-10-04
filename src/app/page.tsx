import { IndShell } from "@/components/IndShell";
import { RegistrationForm } from "@/components/RegistrationForm";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

export default async function HomePage() {
  const [employees, categories] = await Promise.all([
    prisma.employee.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.activityCategory.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const today = new Date();
  const todayLabel = format(today, "d MMMM yyyy", { locale: nl });

  return (
    <IndShell
      bannerTitle="Dagelijkse productie registreren"
      bannerSubtitle="Registreer hier uw werkzaamheden van vandaag."
    >
      <section className="ind-content-section">
        <div className="ind-container max-w-3xl">
          <div className="card p-6 md:p-8">
            <div className="ind-info-box mb-6 text-sm">Vandaag — {todayLabel}</div>
            <RegistrationForm employees={employees} categories={categories} today={today.toISOString()} />
          </div>
        </div>
      </section>
    </IndShell>
  );
}
