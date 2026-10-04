import { redirect } from "next/navigation";
import { getEmployeeSession } from "@/lib/auth";

export default async function RegistratieLayout({ children }: { children: React.ReactNode }) {
  const session = await getEmployeeSession();
  if (!session) {
    redirect("/login");
  }

  return children;
}
