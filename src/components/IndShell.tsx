import { ReactNode } from "react";
import { IndFooter } from "./IndFooter";
import { IndHeader } from "./IndHeader";
import { IndHero } from "./IndHero";
import { IndQuickLinks } from "./IndQuickLinks";

type IndShellProps = {
  children?: ReactNode;
  showAdminLink?: boolean;
  loginHref?: string;
  loginLabel?: string;
  showLogout?: boolean;
  employeeName?: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
  showQuickLinks?: boolean;
  heroActions?: ReactNode;
};

export function IndShell({
  children,
  showAdminLink = true,
  loginHref = "/login",
  loginLabel = "Inloggen",
  showLogout = false,
  employeeName,
  bannerTitle,
  bannerSubtitle,
  showQuickLinks = true,
  heroActions,
}: IndShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <IndHeader
        showAdminLink={showAdminLink}
        loginHref={loginHref}
        loginLabel={loginLabel}
        showLogout={showLogout}
        employeeName={employeeName}
      />
      {bannerTitle && (
        <>
          <IndHero title={bannerTitle} subtitle={bannerSubtitle} actions={heroActions} />
          {showQuickLinks && <IndQuickLinks />}
        </>
      )}
      {children && (
        <main id="main-content" className="flex-1">
          {children}
        </main>
      )}
      {!children && <main id="main-content" className="flex-1" />}
      <IndFooter />
    </div>
  );
}
