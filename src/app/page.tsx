import Link from "next/link";
import { IndShell } from "@/components/IndShell";
import { getEmployeeSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const session = await getEmployeeSession();
  const employee = session
    ? await prisma.employee.findFirst({
        where: { id: session.employeeId, active: true },
        select: { name: true },
      })
    : null;

  const loggedIn = !!employee;

  return (
    <IndShell
      bannerTitle={loggedIn ? `Welkom, ${employee.name}` : "Productie van vandaag registreren"}
      bannerSubtitle={
        loggedIn
          ? "Ga direct naar uw dagregistratie of bekijk uw eerdere invoer."
          : "Log in om uw dossieruren en overige werkzaamheden vast te leggen."
      }
      showQuickLinks={false}
      heroActions={
        loggedIn ? (
          <>
            <Link href="/registratie" className="ind-hero-cta ind-hero-cta-primary">
              Registratie starten
            </Link>
            <Link href="/registratie/overzicht" className="ind-hero-cta ind-hero-cta-secondary">
              Mijn registraties
            </Link>
          </>
        ) : (
          <>
            <Link href="/login" className="ind-hero-cta ind-hero-cta-primary">
              Inloggen
            </Link>
            <Link href="/account" className="ind-hero-cta ind-hero-cta-secondary">
              Account maken
            </Link>
          </>
        )
      }
    />
  );
}
