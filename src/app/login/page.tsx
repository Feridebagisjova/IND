import { redirect } from "next/navigation";
import { IndShell } from "@/components/IndShell";
import { EmployeeLoginForm } from "@/components/EmployeeLoginForm";
import { getEmployeeSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function LoginPage() {
  const session = await getEmployeeSession();
  if (session) {
    redirect("/registratie");
  }

  const employees = await prisma.employee.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <IndShell showAdminLink={false}>
      <section className="ind-content-section">
        <div className="ind-container flex justify-center py-10">
          <div className="ind-content-panel w-full max-w-md">
            <EmployeeLoginForm employees={employees} />
          </div>
        </div>
      </section>
    </IndShell>
  );
}
