import Link from "next/link";
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
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              productie.ind.nl
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Dagelijkse productie registreren</h1>
            <p className="mt-3 max-w-xl text-[var(--muted)]">
              Registreer hieronder je werkzaamheden van vandaag.
            </p>
          </div>
          <Link
            href="/admin/login"
            className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium shadow-sm"
          >
            🔒 Admin login
          </Link>
        </div>

        <div className="card p-6 md:p-8">
          <div className="mb-6 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            Vandaag — {todayLabel}
          </div>
          <RegistrationForm employees={employees} categories={categories} today={today.toISOString()} />
        </div>
      </div>
    </main>
  );
}
