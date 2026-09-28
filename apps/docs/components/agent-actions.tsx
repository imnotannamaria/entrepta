"use client";

import { useCopy } from "@entrepta/registry/hooks/use-copy";
import { Button, buttonVariants } from "@entrepta/registry/primitives/button";
import { CheckIcon, FileMdIcon, RobotIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

/**
 * Hands a page to a coding agent: copy its Markdown twin, or open it. `path`
 * is the page path; the Markdown lives at the same path plus `.md`.
 */
export function AgentActions({ path, label = "copy for agent" }: { path: string; label?: string }) {
  const { state, copy } = useCopy();
  const href = `${path}.md`;

  const onCopy = async () => {
    const ok = await copy(async () => {
      const res = await fetch(href);
      if (!res.ok) throw new Error(String(res.status));
      return res.text();
    });
    if (ok) toast.success("Copied as Markdown", { description: "Paste it into your agent." });
    else toast.error("Copy failed", { description: `Open ${href} and copy it from there.` });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button type="button" variant="secondary" size="sm" onClick={onCopy}>
        {state === "copied" ? (
          <CheckIcon aria-hidden size={14} weight="bold" className="text-[var(--status-success)]" />
        ) : (
          <RobotIcon aria-hidden size={14} className="text-[var(--fg-brand)]" />
        )}
        {state === "copied" ? "copied" : label}
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
