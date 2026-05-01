export function SiteStatusBar() {
  return (
    <div className="hidden sm:flex fixed bottom-0 left-0 right-0 z-40 h-6 px-4 items-center justify-between bg-[var(--fg-brand)] text-white font-mono text-[10px]">
      <div className="flex items-center gap-3">
        <span>entrepta</span>
        <span className="opacity-50">·</span>
        <span>v0.1 draft</span>
        <span className="opacity-50">·</span>
        <span>home</span>
      </div>
      <div className="flex items-center gap-3">
        <span>press ⌘K to navigate</span>
        <span className="opacity-50">·</span>
        <span>anna@recife</span>
      </div>
    </div>
  );
}
