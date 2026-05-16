"use client";

import { TopNav, TopNavLink, TopNavMenu } from "@entrepta/registry/layout/top-nav";
import Link from "next/link";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";

export function SiteNav() {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-[var(--bg-canvas)]/90 backdrop-blur-md">
      <TopNav
        className="py-3"
        left={
          <Link href="/" className="flex items-center">
            <Logo showTag />
          </Link>
        }
        right={
          <>
            <TopNavMenu>
              <TopNavLink href="/#install">install</TopNavLink>
              <TopNavLink href="/#principles">principles</TopNavLink>
              <TopNavLink href="/docs/components">components</TopNavLink>
              <TopNavLink href="/docs/themes">themes</TopNavLink>
              <TopNavLink href="https://github.com/imnotannamaria/entrepta" external>
                github
              </TopNavLink>
            </TopNavMenu>
            <MobileNav />
          </>
        }
      />
    </div>
  );
}
