import { LINKS, PACKAGES } from "@/lib/links";
import {
  Card,
  CardComment,
  CardDescription,
  CardFooter,
  CardHeader,
  CardLabel,
  CardMeta,
  CardTitle,
} from "@entrepta/registry/primitives/card";
import { PackageIcon } from "@phosphor-icons/react/dist/ssr";

/** The published packages, each a link to its npm page. */
export function NpmPackages() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {PACKAGES.map((p) => (
        <a
          key={p.name}
          href={p.href}
          target="_blank"
          rel="noreferrer"
          className="focus-ring group block rounded-[var(--radius-lg)]"
        >
          <Card className="h-full">
            <CardHeader>
              <CardLabel icon={PackageIcon}>npm</CardLabel>
              <CardMeta>{p.bin ? `bin: ${p.bin}` : "source"}</CardMeta>
            </CardHeader>
            <CardTitle className="font-mono text-mono-md">{p.name}</CardTitle>
            <CardDescription>{p.what}</CardDescription>
            <CardFooter>
              <CardComment>{p.run}</CardComment>
              <span className="text-[var(--fg-brand-text)] transition-transform group-hover:translate-x-0.5">
                npmjs ↗
              </span>
            </CardFooter>
          </Card>
        </a>
      ))}
      <p className="m-0 font-mono text-mono-sm text-[var(--fg-muted)] md:col-span-2">
        <span aria-hidden className="text-[var(--fg-brand)]">
          {"// "}
        </span>
        What changed in each release:{" "}
        <a
          href={LINKS.changelog}
          target="_blank"
          rel="noreferrer"
          className="text-[var(--fg-brand-text)] underline-offset-4 hover:underline"
        >
          changelog ↗
        </a>
      </p>
    </div>
  );
}
