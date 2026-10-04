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

export function IconFacebook({ className }: IconProps) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14 8.5h2.5l-.5 3H14v9h-3.5v-9H9v-3h1.5V7.2c0-1.2.3-2.1 1-2.7.7-.6 1.7-.9 3.1-.9H16v3h-1.4c-.8 0-1.3.2-1.5.5-.2.4-.3 1-.3 1.7v.9Z" />
    </svg>
  );
}

export function IconInstagram({ className }: IconProps) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4.5" y="4.5" width="15" height="15" rx="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="7" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function IconLinkedIn({ className }: IconProps) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.5 9.5V18H4V9.5h2.5ZM5.25 8.3a1.45 1.45 0 1 1 0-2.9 1.45 1.45 0 0 1 0 2.9ZM10 9.5h2.4v1.2h.03c.34-.64 1.16-1.32 2.39-1.32 2.55 0 3.02 1.68 3.02 3.86V18H15V14.9c0-.73-.01-1.67-1.02-1.67-1.02 0-1.18.8-1.18 1.62V18H10V9.5Z" />
    </svg>
  );
}

export function IconX({ className }: IconProps) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="m6.5 6.5 4.1 5.3-4.3 5.7H8l2.7-3.5 2.2 3.5h3.7l-4.5-5.8 3.9-5.2h-2.8l-2.4 3.1-1.9-3.1H6.5Zm1.6 1.2h1.7l7.2 10.6h-1.7L8.1 7.7Z" />
    </svg>
  );
}
