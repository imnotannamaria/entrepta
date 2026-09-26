"use client";

import { Button, buttonVariants } from "@entrepta/registry/primitives/button";
import { CheckIcon, FileMdIcon, RobotIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Hands a page to a coding agent: copy its Markdown twin, or open it. `path`
 * is the page path; the Markdown lives at the same path plus `.md`.
 */
export function AgentActions({ path, label = "copy for agent" }: { path: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const href = `${path}.md`;

  const copy = async () => {
    try {
      const res = await fetch(href);
      if (!res.ok) throw new Error(String(res.status));
      await navigator.clipboard.writeText(await res.text());
      setCopied(true);
      toast.success("Copied as Markdown", { description: "Paste it into your agent." });
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Copy failed", { description: `Open ${href} and copy it from there.` });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button type="button" variant="secondary" size="sm" onClick={copy}>
        {copied ? (
          <CheckIcon aria-hidden size={14} weight="bold" className="text-[var(--status-success)]" />
        ) : (
          <RobotIcon aria-hidden size={14} className="text-[var(--fg-brand)]" />
        )}
        {copied ? "copied" : label}
      </Button>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={buttonVariants({ variant: "ghost", size: "sm" })}
      >
        <FileMdIcon aria-hidden size={14} /> view .md
      </a>
    </div>
  );
}
