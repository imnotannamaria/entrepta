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
          <StatusBarItem>press ⌘K to navigate</StatusBarItem>
          <StatusBarSeparator />
          <StatusBarItem>anna@recife</StatusBarItem>
        </>
      }
    />
  );
}
