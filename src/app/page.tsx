import Link from "next/link";
import { IndShell } from "@/components/IndShell";

export default function HomePage() {
  return (
    <IndShell
      bannerTitle="Hoe kunnen we u helpen?"
      bannerSubtitle="Registreer uw productie, dossieruren en overige werkzaamheden van vandaag."
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
