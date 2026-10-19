// Component tests run in jsdom with the registry's setup: jest-dom matchers and the
// ResizeObserver, IntersectionObserver and matchMedia a browser has. Plain tests run in node.
export {};

if (typeof window !== "undefined") {
  await import("../../../packages/registry/test/setup");
}
