"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button type="button" className="btn btn-secondary text-sm" onClick={handleLogout}>
      Uitloggen
    </button>
  );
}

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/registrations", label: "Registraties" },
  { href: "/admin/employees", label: "Medewerkers" },
  { href: "/admin/normprofiles", label: "Normprofielen" },
  { href: "/admin/activities", label: "Werkzaamheden" },
  { href: "/admin/completeness", label: "Registratiegraad" },
  { href: "/admin/settings", label: "Instellingen" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="ind-admin-nav" aria-label="Admin navigatie">
      <div className="ind-container flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="ind-section-heading">Admin portaal</p>
          <p className="text-sm text-[var(--muted)]">Productie registratie beheer</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`ind-admin-nav-link ${active ? "ind-admin-nav-link-active" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <LogoutButton />
      </div>
    </nav>
  );
}
