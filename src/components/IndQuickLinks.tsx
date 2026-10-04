import Link from "next/link";
import { IconAdmin, IconChart, IconChevron, IconDossier, IconHelp } from "./IndIcons";

const links = [
  {
    href: "/login",
    title: "Productie registratie",
    description: "Log in om dagelijks uw dossiers, dossieruren en overige werkzaamheden te registreren.",
    icon: IconDossier,
  },
  {
    href: "/admin/login",
    title: "Admin portaal",
    description: "Log in voor dashboards, medewerkersbeheer en rapportages.",
    icon: IconAdmin,
  },
  {
    href: "/admin",
    title: "Dashboard & rapportages",
    description: "Bekijk productie, normen, realisatie en registratiegraad.",
    icon: IconChart,
  },
  {
    href: "https://ind.nl/nl/contact",
    title: "Service & contact",
    description: "Vragen over dit portaal? Neem contact op via de officiële IND-website.",
    icon: IconHelp,
    external: true,
  },
];

export function IndQuickLinks() {
  return (
    <section className="ind-quick-links" aria-label="Snel naar">
      <div className="ind-container">
        <div className="ind-quick-links-grid">
          {links.map((link) => {
            const Icon = link.icon;
            const content = (
              <>
                <Icon className="ind-quick-link-icon" />
                <h2 className="ind-quick-link-title">
                  {link.title}
                  <IconChevron className="ind-quick-link-chevron" />
                </h2>
                <p className="ind-quick-link-text">{link.description}</p>
              </>
            );

            if (link.external) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="ind-quick-link-card"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content}
                </a>
              );
            }

            return (
              <Link key={link.href} href={link.href} className="ind-quick-link-card">
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
