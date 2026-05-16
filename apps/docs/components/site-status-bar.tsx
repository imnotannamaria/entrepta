import { StatusBar, StatusBarItem, StatusBarSeparator } from "@entrepta/registry/layout/status-bar";

export function SiteStatusBar() {
  return (
    <StatusBar
      left={
        <>
          <StatusBarItem>entrepta</StatusBarItem>
          <StatusBarSeparator />
          <StatusBarItem>v0.1</StatusBarItem>
          <StatusBarSeparator />
          <StatusBarItem>home</StatusBarItem>
        </>
      }
      right={
        <>
          <StatusBarItem className="hidden md:inline-flex">press ⌘K to navigate</StatusBarItem>
          <StatusBarSeparator className="hidden md:inline-block" />
          <StatusBarItem>annamaria.app</StatusBarItem>
        </>
      }
    />
  );
}
