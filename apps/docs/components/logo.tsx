import { cn } from "@/lib/utils";
import { VERSION_LABEL } from "@/lib/version";

interface LogoMarkProps {
  className?: string;
  size?: number;
}

/** The entrepta mark. Decorative: the name always sits next to it. */
export function LogoMark({ className, size = 24 }: LogoMarkProps) {
  return (
    <img
      src="/brand/entrepta-96.png"
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      decoding="async"
      className={className}
      style={{ width: size, height: size }}
    />
  );
}

interface LogoProps {
  className?: string;
  showTag?: boolean;
}

export function Logo({ className, showTag = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoMark size={28} />
      <span className="font-serif text-[var(--fg-primary)] text-body-lg leading-none">
        entrepta<em className="text-[var(--fg-brand)] not-italic">.</em>
      </span>
      {showTag && (
        <span className="hidden sm:inline-flex font-mono text-mono-xs text-[var(--fg-muted)] border border-[var(--border-subtle)] rounded px-1.5 py-0.5">
          {VERSION_LABEL}
        </span>
      )}
    </div>
  );
}
