import Image from "next/image";
import Link from "next/link";

type IndHeaderProps = {
  showAdminLink?: boolean;
  adminHref?: string;
  adminLabel?: string;
};

export function IndHeader({
  showAdminLink = true,
  adminHref = "/admin/login",
  adminLabel = "Inloggen",
}: IndHeaderProps) {
  return (
    <header className="ind-header">
      <a href="#main-content" className="ind-skip-link">
        Overslaan en naar de inhoud gaan
      </a>

      <div className="ind-header-top">
        <div className="ind-container flex items-center justify-between gap-4 py-3">
          <Link href="/" className="ind-logo-link" aria-label="Home">
            <Image
              src="/ind-logo.png"
              alt="Immigratie- en Naturalisatiedienst"
              width={320}
              height={72}
              priority
              className="h-14 w-auto md:h-16"
            />
          </Link>
          <div className="hidden items-center gap-4 text-sm text-[var(--foreground)] sm:flex">
            <span>
              Taal: <strong>Nederlands</strong>
            </span>
            {showAdminLink && (
              <Link href={adminHref} className="ind-header-action">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z"
                    fill="currentColor"
                  />
                </svg>
                {adminLabel}
              </Link>
            )}
          </div>
        </div>
      </div>

      <nav className="ind-nav" aria-label="Hoofdnavigatie">
        <div className="ind-container flex flex-wrap items-center justify-between gap-3 py-3">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <li>
              <Link href="/" className="ind-nav-link">
                Productie registratie
              </Link>
            </li>
            <li>
              <Link href="/admin" className="ind-nav-link">
                Admin portaal
              </Link>
            </li>
          </ul>
          <div className="flex items-center gap-4 sm:hidden">
            {showAdminLink && (
              <Link href={adminHref} className="ind-header-action text-sm">
                {adminLabel}
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
