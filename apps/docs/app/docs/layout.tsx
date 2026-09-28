import { DocsSidebar } from "@/components/docs-sidebar";
import { SiteNav } from "@/components/site-nav";
import { SiteStatusBar } from "@/components/site-status-bar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <div className="flex min-h-screen pt-14 pb-10 sm:pb-12 max-w-[1280px] mx-auto">
        <DocsSidebar />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 pt-8 sm:pt-10 pb-24 sm:pb-32"
        >
          {children}
        </main>
      </div>
      <SiteStatusBar />
    </>
  );
}
