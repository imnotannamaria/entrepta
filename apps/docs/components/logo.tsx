import { cn } from "@/lib/utils";

interface LogoMarkProps {
  className?: string;
  size?: number;
}

export function LogoMark({ className, size = 24 }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={className}
    >
      <rect x="3" y="6" width="22" height="3" rx="1" fill="currentColor" />
      <rect x="3" y="13" width="14" height="3" rx="1" fill="currentColor" opacity="0.85" />
      <rect x="3" y="20" width="22" height="3" rx="1" fill="currentColor" opacity="0.55" />
      <circle cx="27" cy="14.5" r="2.2" fill="var(--fg-brand)" />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  showTag?: boolean;
}

export function Logo({ className, showTag = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoMark className="text-[var(--fg-primary)]" size={22} />
      <span className="font-serif text-[var(--fg-primary)] text-base leading-none">
        entrepta<em className="text-[var(--fg-brand)] not-italic">.</em>
      </span>
      {showTag && (
        <span className="font-mono text-[10px] text-[var(--fg-muted)] border border-[var(--border-subtle)] rounded px-1.5 py-0.5">
          v0.1 · draft
        </span>
      )}
    </div>
  );
}
