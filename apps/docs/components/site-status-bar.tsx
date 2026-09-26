"use client";

import { LINKS } from "@/lib/links";
import { StatusBar, StatusBarItem, StatusBarSeparator } from "@entrepta/registry/layout/status-bar";
import { usePathname } from "next/navigation";

/** The site's status bar: where you are, the palette hint, and who made it. */
export function SiteStatusBar() {
  const pathname = usePathname() ?? "/";
  const where = pathname === "/" ? "home" : pathname.slice(1);

  return (
    <StatusBar
      left={
        <>
          <StatusBarItem>entrepta</StatusBarItem>
          <StatusBarSeparator />
          <StatusBarItem>v2.0</StatusBarItem>
          <StatusBarSeparator />
          <StatusBarItem className="max-w-[40vw] truncate">{where}</StatusBarItem>
        </>
      }
      right={
        <>
          <StatusBarItem className="hidden md:inline-flex">press ⌘K to navigate</StatusBarItem>
          <StatusBarSeparator className="hidden md:inline-block" />
          <StatusBarItem>
            <a
              href={LINKS.author}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
            >
              annamaria.app ↗
            </a>
          </StatusBarItem>
        </>
      }
    />
  );
}
