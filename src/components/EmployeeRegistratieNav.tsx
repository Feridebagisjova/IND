import Link from "next/link";

export function EmployeeRegistratieNav({ active }: { active: "form" | "list" }) {
  return (
    <nav className="ind-employee-nav" aria-label="Registratie navigatie">
      <Link href="/registratie" className={active === "form" ? "ind-employee-nav-link active" : "ind-employee-nav-link"}>
        Registreren
      </Link>
      <Link
        href="/registratie/overzicht"
        className={active === "list" ? "ind-employee-nav-link active" : "ind-employee-nav-link"}
      >
        Mijn registraties
      </Link>
    </nav>
  );
}
