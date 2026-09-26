"use client";

import { DOCS_NAV } from "@/lib/component-index";
import { usePathname } from "next/navigation";
import { NavGroups } from "./nav-groups";

export function DocsSidebar() {
  const pathname = usePathname();
  return (
    <nav aria-label="Docs" className="pt-8 pb-24">
      <NavGroups groups={DOCS_NAV} pathname={pathname} />
    </nav>
  );
}
