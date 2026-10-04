import { EmployeeForm } from "@/components/EmployeeForm";
import { prisma } from "@/lib/prisma";

export default async function NewEmployeePage() {
  const [teams, normProfiles] = await Promise.all([
    prisma.team.findMany({ orderBy: { name: "asc" } }),
    prisma.normProfile.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h2 className="text-2xl font-semibold">Medewerker toevoegen</h2>
      <EmployeeForm teams={teams} normProfiles={normProfiles} />
    </div>
  );
}
