"use client";

import { Check, Copy } from "lucide-react";
import * as React from "react";
import { cn } from "../lib/utils";

interface CodeBlockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Raw code copied to clipboard. Required for the copy button. */
  code: string;
  /** Optional language label shown on the right of the chrome (e.g. "tsx", "bash"). */
  language?: string;
  /** Optional filename or label shown on the left of the chrome. */
  filename?: string;
  /** Optional secondary text shown between the filename and the language label. */
  meta?: string;
  /** `terminal` renders macOS-style window dots; `default` keeps a clean chrome. */
  variant?: "default" | "terminal";
  /** Hide the copy button if false. Default true. */
  showCopy?: boolean;
  /** Milliseconds the "copied" state stays visible after a successful copy. */
  copyTimeout?: number;
}

const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  (
    {
      code,
      language,
      filename,
      meta,
      variant = "default",
      showCopy = true,
      copyTimeout = 1500,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = React.useState(false);
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, []);

    const handleCopy = React.useCallback(async () => {
      try {
        if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(code);
        }
        setCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), copyTimeout);
      } catch {
        // clipboard may be unavailable (insecure context, denied permission, etc.)
      }
    }, [code, copyTimeout]);

    const hasChrome = variant === "terminal" || Boolean(filename) || Boolean(meta) || showCopy;

    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-[var(--radius-md)] border border-[var(--border-subtle)]",
          "bg-[var(--bg-surface)] overflow-hidden",
          className
        )}
        {...props}
      >
        {hasChrome && (
          <div
            className={cn(
              "flex items-center gap-3 px-4 py-2",
              "border-b border-[var(--border-subtle)] bg-black/30",
              "font-mono text-[11px] text-[var(--fg-secondary)]"
            )}
          >
            {variant === "terminal" && (
              <div aria-hidden className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--status-error)] opacity-60" />
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--status-warning)] opacity-60" />
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--status-success)] opacity-60" />
              </div>
            )}
            {filename && <span className="text-[var(--fg-muted)] truncate">{filename}</span>}
            <div className="ml-auto flex items-center gap-3">
              {meta && <span className="text-[var(--fg-muted)] truncate">{meta}</span>}
              {language && (
                <span className="uppercase tracking-[0.08em] text-[var(--fg-brand)] text-[10px]">
                  {language}
                </span>
              )}
              {showCopy && (
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label={copied ? "Copied" : "Copy code"}
                  data-state={copied ? "copied" : "idle"}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-1.5 py-1",
                    "rounded-[var(--radius-sm)] text-[10px] uppercase tracking-[0.08em]",
                    "border border-[var(--border-subtle)] bg-[var(--bg-canvas)]",
                    "text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:border-[var(--border-strong)]",
                    "transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                  )}
                >
                  {copied ? (
                    <>
                      <Check
                        aria-hidden
                        style={{ width: 11, height: 11, strokeWidth: 1.8 }}
                        className="text-[var(--status-success)]"
                      />
                      <span>copied</span>
                    </>
                  ) : (
                    <>
                      <Copy aria-hidden style={{ width: 11, height: 11, strokeWidth: 1.5 }} />
                      <span>copy</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          {children ? (
            <div className="p-4 font-mono text-[13px] leading-relaxed text-[var(--fg-secondary)] whitespace-pre">
              {children}
            </div>
          ) : (
            <pre className="p-4 m-0 font-mono text-[13px] leading-relaxed text-[var(--fg-secondary)] whitespace-pre">
              <code>{code}</code>
            </pre>
          )}
        </div>
      </div>
    );
  }
);
CodeBlock.displayName = "CodeBlock";

export { CodeBlock };
export type { CodeBlockProps };
