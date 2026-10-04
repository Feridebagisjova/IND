import {
  IconFacebook,
  IconInstagram,
  IconLinkedIn,
  IconX,
} from "./IndIcons";

const footerLinksLeft = [
  { label: "Cookies", href: "https://ind.nl/nl/cookies" },
  { label: "Proclaimer", href: "https://ind.nl/nl/proclaimer" },
  { label: "Privacy", href: "https://ind.nl/nl/privacyverklaring" },
  { label: "Sitemap", href: "https://ind.nl/nl/sitemap" },
  { label: "Toegankelijkheid", href: "https://ind.nl/nl/toegankelijkheid" },
  { label: "Webarchief", href: "https://ind.nl/nl/webarchief-ind" },
];

const footerLinksRight = [
  { label: "Contact", href: "https://ind.nl/nl/service-contact/contact-met-ind" },
  { label: "Over ons", href: "https://ind.nl/nl/over-ons" },
  { label: "Pers & voorlichting", href: "https://ind.nl/nl/over-ons/pers-en-voorlichting" },
  { label: "Vacatures", href: "https://ind.nl/nl/over-ons/werken-bij-de-ind" },
];

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/IND.NL", icon: IconFacebook },
  { label: "Instagram", href: "https://www.instagram.com/ind.nl/", icon: IconInstagram },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/immigratie--en-naturalisatiedienst-ind-/",
    icon: IconLinkedIn,
  },
  { label: "X", href: "https://www.x.com/IND_NL", icon: IconX },
];

function ExternalFooterLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="ind-footer-link" target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  );
}

export function IndFooter() {
  return (
    <footer className="ind-footer" role="contentinfo">
      <div className="ind-container ind-footer-inner">
        <div className="ind-footer-top">
          <nav aria-label="Footer navigatie links">
            <ul className="ind-footer-links">
              {footerLinksLeft.map((link) => (
                <li key={link.href}>
                  <ExternalFooterLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer navigatie rechts">
            <ul className="ind-footer-links">
              {footerLinksRight.map((link) => (
                <li key={link.href}>
                  <ExternalFooterLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </nav>

          <div className="ind-footer-social" aria-label="Social media">
            <ul className="ind-footer-social-list">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="ind-footer-social-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      title={link.label}
                    >
                      <Icon className="ind-footer-social-icon" />
                      <span className="sr-only">{link.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <nav className="ind-footer-language" aria-label="Taalkeuze">
          <a href="https://ind.nl/nl" className="ind-footer-language-link" target="_blank" rel="noopener noreferrer">
            Nederlands
          </a>
          <span className="ind-footer-language-sep" aria-hidden="true">
            |
          </span>
          <a href="https://ind.nl/en" className="ind-footer-language-link" target="_blank" rel="noopener noreferrer">
            English
          </a>
        </nav>
      </div>
    </footer>
  );
}
