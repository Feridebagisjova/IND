import { notFound } from "next/navigation";
import { EmployeeForm } from "@/components/EmployeeForm";
import { prisma } from "@/lib/prisma";

export default async function EditEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [employee, teams, normProfiles] = await Promise.all([
    prisma.employee.findUnique({ where: { id } }),
    prisma.team.findMany({ orderBy: { name: "asc" } }),
    prisma.normProfile.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!employee) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h2 className="text-2xl font-semibold">Medewerker bewerken</h2>
      <EmployeeForm employee={employee} teams={teams} normProfiles={normProfiles} />
    </div>
  );
}
