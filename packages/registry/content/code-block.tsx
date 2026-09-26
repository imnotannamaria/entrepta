"use client";

import { CheckIcon, CopyIcon, WarningIcon } from "@phosphor-icons/react";
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
    const [copyState, setCopyState] = React.useState<"idle" | "copied" | "error">("idle");
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, []);

    const handleCopy = React.useCallback(async () => {
      try {
        if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
          throw new Error("Clipboard unavailable");
        }
        await navigator.clipboard.writeText(code);
        setCopyState("copied");
      } catch {
        // No clipboard on an insecure origin, or permission denied. Say so instead
        // of claiming a copy that did not happen.
        setCopyState("error");
      } finally {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopyState("idle"), copyTimeout);
      }
    }, [code, copyTimeout]);

    const hasChrome = variant === "terminal" || Boolean(filename) || Boolean(meta) || showCopy;

    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-[var(--radius-md)] border border-[var(--border-subtle)]",
          "sheen bg-[var(--bg-overlay)] shadow-[var(--shadow-card)] overflow-hidden",
          className
        )}
        {...props}
      >
        {hasChrome && (
          <div
            className={cn(
              "flex items-center gap-3 px-4 py-2",
              "border-b border-[var(--border-subtle)]",
              "font-mono text-mono-sm text-[var(--fg-secondary)]"
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
                <span className="uppercase tracking-[0.08em] text-[var(--fg-brand-text)] text-mono-xs">
                  {language}
                </span>
              )}
              {showCopy && (
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label={
                    copyState === "copied"
                      ? "Copied"
                      : copyState === "error"
                        ? "Copy failed"
                        : "Copy code"
                  }
                  data-state={copyState}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-1.5 py-1",
                    "rounded-[var(--radius-sm)] text-mono-xs uppercase tracking-[0.08em]",
                    "border border-[var(--border-subtle)] bg-[var(--bg-canvas)]",
                    "text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:border-[var(--border-strong)]",
                    "transition-colors duration-150",
                    "focus-ring"
                  )}
                >
                  {copyState === "copied" ? (
                    <>
                      <CheckIcon aria-hidden size={11} className="text-[var(--status-success)]" />
                      <span>copied</span>
                    </>
                  ) : copyState === "error" ? (
                    <>
                      <WarningIcon aria-hidden size={11} className="text-[var(--status-error)]" />
                      <span>copy failed</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon aria-hidden size={11} />
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
            <div className="p-4 font-mono text-mono-md leading-relaxed text-[var(--fg-secondary)] whitespace-pre">
              {children}
            </div>
          ) : (
            <pre className="p-4 m-0 font-mono text-mono-md leading-relaxed text-[var(--fg-secondary)] whitespace-pre">
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
