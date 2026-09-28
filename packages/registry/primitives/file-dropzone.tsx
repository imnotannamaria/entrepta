"use client";

import { CheckIcon, FileIcon, UploadSimpleIcon, WarningIcon, XIcon } from "@phosphor-icons/react";
import * as React from "react";
import { useFormat } from "../hooks/use-format";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { IconTile } from "./icon-tile";
import { Progress } from "./progress";

export interface FileDropzoneItem {
  id: string;
  name: string;
  /** Bytes. */
  size: number;
  /** 0 to 1 while it uploads; leave it out once done. */
  progress?: number;
  error?: string;
}

const LABELS = {
  title: "Drop files here, or choose them",
  drop: "Drop to add",
  remove: "Remove",
  tooLarge: (name: string, size: string, limit: string) =>
    `${name} is ${size}; the limit is ${limit}.`,
  wrongType: (name: string, accept: string) => `${name} is not a type this takes (${accept}).`,
  one: "One file at a time.",
};

interface FileDropzoneProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDrop"> {
  /** Files that pass `accept` and `maxSize`. Upload them yourself, and pass their state in `items`. */
  onFiles: (files: File[]) => void;
  /** As the input takes it: `"image/*,.pdf"`. */
  accept?: string;
  /** Bytes. */
  maxSize?: number;
  multiple?: boolean;
  disabled?: boolean;
  /** The files so far: uploading with progress, done, or failed. */
  items?: readonly FileDropzoneItem[];
  onRemove?: (id: string) => void;
  /** A line under the title: "PNG or JPG, up to 5 MB". */
  hint?: React.ReactNode;
  id?: string;
  labels?: Partial<typeof LABELS>;
}

/** "5 MB", "320 KB", in the reader's language. */
function formatBytes(bytes: number, locale: string): string {
  const units = ["byte", "kilobyte", "megabyte", "gigabyte"] as const;
  let value = bytes;
  let unit = 0;
  while (value >= 1000 && unit < units.length - 1) {
    value /= 1000;
    unit++;
  }
  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit: units[unit],
    unitDisplay: "short",
    maximumFractionDigits: unit > 1 ? 1 : 0,
  }).format(value);
}

/** Whether a file matches an accept string: a type, a type/*, or an extension. */
function accepts(file: File, accept?: string): boolean {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  return accept
    .split(",")
    .map((rule) => rule.trim().toLowerCase())
    .some((rule) =>
      rule.startsWith(".")
        ? name.endsWith(rule)
        : rule.endsWith("/*")
          ? file.type.startsWith(rule.slice(0, -1))
          : file.type === rule
    );
}

/**
 * A place to drop files, or to choose them: a real file input with its label,
 * so a click, Enter or Space opens the picker. It checks the type and the
 * size and says the limit when a file is over it. No upload code: hand the
 * files to yours, and pass their progress back in `items`.
 */
const FileDropzone = React.forwardRef<HTMLDivElement, FileDropzoneProps>(
  (
    {
      onFiles,
      accept,
      maxSize,
      multiple = false,
      disabled = false,
      items = [],
      onRemove,
      hint,
      id: idProp,
      labels: labelsProp,
      className,
      ...props
    },
    ref
  ) => {
    const labels = { ...LABELS, ...labelsProp };
    const { locale } = useFormat();
    const generated = React.useId();
    const id = idProp ?? generated;
    const [over, setOver] = React.useState(false);
    const [problems, setProblems] = React.useState<string[]>([]);
    const depth = React.useRef(0);

    const take = (list: FileList | null) => {
      const files = [...(list ?? [])];
      const found: string[] = [];
      if (!multiple && files.length > 1) found.push(labels.one);
      const ok = (multiple ? files : files.slice(0, 1)).filter((file) => {
        if (!accepts(file, accept)) {
          found.push(labels.wrongType(file.name, accept ?? ""));
          return false;
        }
        if (maxSize !== undefined && file.size > maxSize) {
          found.push(
            labels.tooLarge(file.name, formatBytes(file.size, locale), formatBytes(maxSize, locale))
          );
          return false;
        }
        return true;
      });
      setProblems(found);
      if (ok.length) onFiles(ok);
    };

    return (
      <div ref={ref} className={cn("flex w-full min-w-0 flex-col gap-3", className)} {...props}>
        <label
          htmlFor={id}
          data-over={over || undefined}
          onDragEnter={(event) => {
            event.preventDefault();
            depth.current++;
            setOver(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => {
            // a drag over the label's own children fires leave and enter in pairs
            depth.current = Math.max(0, depth.current - 1);
            if (depth.current === 0) setOver(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            depth.current = 0;
            setOver(false);
            if (!disabled) take(event.dataTransfer.files);
          }}
          className={cn(
            "sheen flex cursor-pointer flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-dashed px-6 py-8 text-center",
            "border-[var(--border-strong)] bg-[var(--bg-card)] shadow-[var(--shadow-card)]",
            "transition-[border-color,background-color] duration-[var(--motion-fast)]",
            "hover:border-[var(--fg-muted)]",
            "data-[over]:border-[var(--fg-brand)] data-[over]:bg-[var(--bg-surface-brand)]",
            "has-[:focus-visible]:border-[var(--fg-brand)] has-[:focus-visible]:shadow-[0_0_0_3px_var(--bg-surface-brand)]",
            disabled && "pointer-events-none opacity-40"
          )}
        >
          <input
            id={id}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            className="sr-only"
            onChange={(event) => {
              take(event.target.files);
              // the same file chosen again still fires a change
              event.target.value = "";
            }}
          />
          <span
            aria-hidden
            className={cn(
              "grid size-10 place-items-center rounded-[var(--radius-md)] bg-[var(--bg-hover-strong)] text-[var(--fg-secondary)]",
              "transition-transform duration-[var(--motion-base)] ease-[var(--ease-out)]",
              over && "-translate-y-1 bg-[var(--bg-surface-brand)] text-[var(--fg-brand-text)]"
            )}
          >
            <UploadSimpleIcon size={20} />
          </span>
          <span className="font-mono text-mono-md text-[var(--fg-primary)]">
            {over ? labels.drop : labels.title}
          </span>
          {hint ? (
            <span className="font-mono text-mono-xs text-[var(--fg-muted)]">{hint}</span>
          ) : null}
        </label>

        {problems.length ? (
          <ul role="alert" className="m-0 flex list-none flex-col gap-1 p-0">
            {problems.map((problem) => (
              <li
                key={problem}
                className="flex items-start gap-1.5 font-mono text-mono-sm text-[var(--status-error-fg)]"
              >
                <WarningIcon aria-hidden size={14} weight="bold" className="mt-0.5 shrink-0" />
                {problem}
              </li>
            ))}
          </ul>
        ) : null}

        {items.length ? (
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {items.map((item) => {
              const uploading = item.progress !== undefined && item.progress < 1 && !item.error;
              return (
                <li
                  key={item.id}
                  className="flex min-w-0 items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2.5"
                >
                  <IconTile
                    icon={item.error ? WarningIcon : uploading ? FileIcon : CheckIcon}
                    color={item.error ? "error" : uploading ? "neutral" : "success"}
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="flex items-baseline justify-between gap-3 font-mono text-mono-sm">
                      <span className="min-w-0 truncate text-[var(--fg-primary)]">{item.name}</span>
                      <span className="shrink-0 tabular-nums text-[var(--fg-muted)]">
                        {formatBytes(item.size, locale)}
                      </span>
                    </span>
                    {item.error ? (
                      <span className="font-mono text-mono-xs text-[var(--status-error-fg)]">
                        {item.error}
                      </span>
                    ) : uploading ? (
                      <Progress
                        aria-label={`Uploading ${item.name}`}
                        value={Math.round((item.progress ?? 0) * 100)}
                        size="sm"
                      />
                    ) : null}
                  </span>
                  {onRemove ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="size-7 shrink-0"
                      aria-label={`${labels.remove} ${item.name}`}
                      onClick={() => onRemove(item.id)}
                    >
                      <XIcon aria-hidden size={14} />
                    </Button>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    );
  }
);
FileDropzone.displayName = "FileDropzone";

export { accepts, FileDropzone, formatBytes };
export type { FileDropzoneProps };
