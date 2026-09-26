import { SiteNav } from "@/components/site-nav";
import { SiteStatusBar } from "@/components/site-status-bar";
import { ChromeMessage } from "@entrepta/registry/feedback/chrome-message";
import { buttonVariants } from "@entrepta/registry/primitives/button-variants";
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
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-3xl px-4 pt-32 pb-24 sm:px-8">
        <ChromeMessage
          command="cat ./this-page"
          output="cat: ./this-page: No such file or directory"
          title="Page not found."
          note="it moved, or it never existed"
          action={
            <div className="flex flex-wrap gap-3">
              <Link href="/docs" className={buttonVariants({ size: "sm" })}>
                open the docs
              </Link>
              <Link href="/" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                go home
              </Link>
            </div>
          }
        />
      </main>
      <SiteStatusBar where="404" />
    </>
  );
}
