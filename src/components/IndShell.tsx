import { ReactNode } from "react";
import { IndFooter } from "./IndFooter";
import { IndHeader } from "./IndHeader";

type IndShellProps = {
  children: ReactNode;
  showAdminLink?: boolean;
  adminHref?: string;
  adminLabel?: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
};

export function IndShell({
  children,
  showAdminLink = true,
  adminHref = "/admin/login",
  adminLabel = "Inloggen",
  bannerTitle,
  bannerSubtitle,
}: IndShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <IndHeader showAdminLink={showAdminLink} adminHref={adminHref} adminLabel={adminLabel} />
      {bannerTitle && (
        <section className="ind-hero">
          <div className="ind-container py-10 md:py-14">
            <div className="ind-hero-box max-w-xl">
              <h1 className="text-3xl font-bold leading-tight md:text-4xl">{bannerTitle}</h1>
              {bannerSubtitle && <p className="mt-3 text-base opacity-95 md:text-lg">{bannerSubtitle}</p>}
            </div>
          </div>
        </section>
      )}
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <IndFooter />
    </div>
  );
}
