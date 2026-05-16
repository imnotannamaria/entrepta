import { DocsSidebar } from "@/components/docs-sidebar";
import { SiteNav } from "@/components/site-nav";
import { SiteStatusBar } from "@/components/site-status-bar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <div className="flex min-h-screen pt-14 pb-10 sm:pb-12 max-w-[1280px] mx-auto">
        <aside className="hidden md:block w-56 shrink-0 border-r border-[var(--border-subtle)] sticky top-14 self-start h-[calc(100vh-3.5rem)] overflow-y-auto px-3">
          <DocsSidebar />
        </aside>
        <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-8 sm:py-10">{children}</main>
      </div>
      <SiteStatusBar />
    </>
  );
}
