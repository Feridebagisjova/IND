import { ReactNode } from "react";

type IndHeroProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export function IndHero({ title, subtitle, actions }: IndHeroProps) {
  return (
    <section className="ind-hero-banner ind-hero-banner-large" aria-label="Introductie">
      <div className="ind-hero-banner-image" aria-hidden="true" />
      <div className="ind-container ind-hero-banner-inner">
        <div className="ind-hero-box">
          <h1 className="ind-hero-title">{title}</h1>
          {subtitle && <p className="ind-hero-subtitle">{subtitle}</p>}
          {actions && <div className="ind-hero-actions">{actions}</div>}
        </div>
      </div>
    </section>
  );
}
