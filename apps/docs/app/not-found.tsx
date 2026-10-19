import { SiteNav } from "@/components/site-nav";
import { EmptyState } from "@entrepta/registry/feedback/empty-state";
import { buttonVariants } from "@entrepta/registry/primitives/button-variants";
import { FileDashedIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main id="main-content" tabIndex={-1} className="flex min-h-dvh flex-col px-4 pt-14 sm:px-8">
        <EmptyState
          size="page"
          icon={<FileDashedIcon />}
          title="Page not found."
          description="It moved, or it never existed."
          action={
            <>
              <Link href="/docs" className={buttonVariants({ size: "sm" })}>
                open the docs
              </Link>
              <Link href="/" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                go home
              </Link>
            </>
          }
        />
      </main>
    </>
  );
}
