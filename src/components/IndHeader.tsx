import Image from "next/image";
import Link from "next/link";
import { IconUser } from "./IndIcons";
import { LogoutButton } from "./LogoutButton";

type IndHeaderProps = {
  showAdminLink?: boolean;
  loginHref?: string;
  loginLabel?: string;
  showLogout?: boolean;
  employeeName?: string;
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/registratie", label: "Productie registratie" },
  { href: "/registratie/overzicht", label: "Mijn registraties" },
  { href: "/admin/login", label: "Admin portaal" },
  { href: "https://ind.nl/nl/contact", label: "Service & Contact", external: true },
];

export function IndHeader({
  showAdminLink = true,
  loginHref = "/login",
  loginLabel = "Inloggen",
  showLogout = false,
  employeeName,
}: IndHeaderProps) {
  return (
    <header className="ind-header">
      <a href="#main-content" className="ind-skip-link">
        Overslaan en naar de inhoud gaan
      </a>

      <div className="ind-header-meta">
        <div className="ind-container flex items-center justify-end py-2">
          <p className="ind-language">
            Taal: <strong>Nederlands</strong>
            <span className="ind-language-sep">|</span>
            <Link href="https://ind.nl/en" className="ind-language-link">
              English
            </Link>
          </p>
        </div>
      </div>

      <div className="ind-header-brand">
        <div className="ind-container flex justify-center py-5 md:py-6">
          <Link href="/" className="ind-logo-link" aria-label="Home">
            <Image
              src="/ind-logo.png"
              alt="Immigratie- en Naturalisatiedienst"
              width={420}
              height={96}
              priority
              className="ind-logo-image"
            />
          </Link>
        </div>
      </div>

      <nav className="ind-nav" aria-label="Hoofdnavigatie">
        <div className="ind-container ind-nav-inner">
          <ul className="ind-nav-list">
            {navLinks.map((link) => (
              <li key={link.href}>
                {link.external ? (
                  <a href={link.href} className="ind-nav-link" target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href} className="ind-nav-link">
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="ind-nav-actions">
            {employeeName && (
              <span className="ind-header-user hidden text-sm text-white/90 md:inline">
                Ingelogd als <strong>{employeeName}</strong>
              </span>
            )}
            {showLogout && <LogoutButton />}
            {showAdminLink && !showLogout && (
              <Link href={loginHref} className="ind-header-action">
                <IconUser />
                <span>{loginLabel}</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
