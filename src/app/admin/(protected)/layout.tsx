import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/AdminNav";
import { getAdminSession } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
    </div>
  );
}
