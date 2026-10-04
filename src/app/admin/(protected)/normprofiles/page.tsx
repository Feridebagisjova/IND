import { prisma } from "@/lib/prisma";
import { getProductivityRate } from "@/lib/metrics";

export default async function NormProfilesPage() {
  const profiles = await prisma.normProfile.findMany({
    include: {
      _count: { select: { employees: true } },
      history: { orderBy: { validFrom: "desc" }, take: 3 },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Normprofielen</h2>
        <p className="muted mt-1">Centrale normen met historie voor rapportages.</p>
      </div>
      <div className="grid gap-4">
        {profiles.map((profile) => (
          <div key={profile.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">{profile.name}</h3>
                <p className="muted mt-1">
                  {profile.hoursPerDay} uur → {profile.targetUnits} dossiers (
                  {getProductivityRate(profile).toLocaleString("nl-NL")} dossier per productief uur)
                </p>
                <p className="mt-2 text-sm">Gekoppelde medewerkers: {profile._count.employees}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-semibold">Normhistorie</p>
              <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                {profile.history.map((entry) => (
                  <li key={entry.id}>
                    Vanaf {entry.validFrom.toLocaleDateString("nl-NL")}: {entry.hoursPerDay} uur →{" "}
                    {entry.targetUnits} dossiers
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
