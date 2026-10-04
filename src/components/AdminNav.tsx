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
    <header className="border-b border-[var(--border)] bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--primary)]">IND Productie Portaal</p>
          <h1 className="text-xl font-semibold">Admin</h1>
        </div>
        <nav className="flex flex-wrap gap-2">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 text-sm ${
                  active ? "bg-[var(--primary)] text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <LogoutButton />
      </div>
    </header>
  );
}
