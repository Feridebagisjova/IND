import Link from "next/link";

export function IndFooter() {
  return (
    <footer className="ind-footer">
      <div className="ind-container py-10">
        <div className="grid gap-8 md:grid-cols-2">
          <nav aria-label="Footer navigatie links">
            <ul className="ind-footer-links">
              <li>
                <Link href="#">Cookies</Link>
              </li>
              <li>
                <Link href="#">Proclaimer</Link>
              </li>
              <li>
                <Link href="#">Privacy</Link>
              </li>
              <li>
                <Link href="#">Toegankelijkheid</Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Footer navigatie rechts">
            <ul className="ind-footer-links">
              <li>
                <Link href="https://ind.nl/nl/contact" target="_blank" rel="noopener noreferrer">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="https://ind.nl/nl/over-ons" target="_blank" rel="noopener noreferrer">
                  Over ons
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <p className="mt-8 text-sm text-[var(--muted)]">
          © {new Date().getFullYear()} Immigratie- en Naturalisatiedienst — Productie portaal
        </p>
      </div>
    </footer>
  );
}
