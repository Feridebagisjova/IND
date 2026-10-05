import Link from "next/link";
import { IndShell } from "@/components/IndShell";

export default function HomePage() {
  return (
    <IndShell
      bannerTitle="Productie van vandaag registreren"
      bannerSubtitle="Log in om uw dossieruren en overige werkzaamheden vast te leggen."
      showQuickLinks={false}
      heroActions={
        <>
          <Link href="/login" className="ind-hero-cta ind-hero-cta-primary">
            Inloggen
          </Link>
          <Link href="/account" className="ind-hero-cta ind-hero-cta-secondary">
            Account maken
          </Link>
        </>
      }
    />
  );
}
