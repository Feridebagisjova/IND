type IconProps = {
  className?: string;
};

export function IconDossier({ className = "ind-icon" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="12" y="8" width="40" height="48" rx="2" stroke="currentColor" strokeWidth="3" />
      <circle cx="32" cy="26" r="8" stroke="currentColor" strokeWidth="3" />
      <path d="M20 44h24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 52h16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function IconAdmin({ className = "ind-icon" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="10" y="14" width="44" height="36" rx="2" stroke="currentColor" strokeWidth="3" />
      <path d="M10 22h44" stroke="currentColor" strokeWidth="3" />
      <path d="M18 30h12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M18 38h20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="46" cy="40" r="6" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

export function IconChart({ className = "ind-icon" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M12 52V28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M28 52V18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M44 52V34" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M10 52h48" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function IconHelp({ className = "ind-icon" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M32 12v8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M18 18l6 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M46 18l-6 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="36" r="14" stroke="currentColor" strokeWidth="3" />
      <path d="M32 30v2c4 0 6 2 6 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="42" r="2" fill="currentColor" />
    </svg>
  );
}

export function IconUser({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconSearch({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconChevron({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
