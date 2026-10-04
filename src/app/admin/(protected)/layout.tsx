import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/AdminNav";
import { IndFooter } from "@/components/IndFooter";
import { IndHeader } from "@/components/IndHeader";
import { getAdminSession } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <IndHeader showAdminLink={false} />
      <AdminNav />
      <div className="ind-container flex-1 py-8">{children}</div>
      <IndFooter />
    </div>
  );
}
