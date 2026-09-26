/**
 * A matchMedia that answers `prefers-reduced-motion` from a flag tests can
 * flip, and notifies listeners the way a real browser does when the user
 * changes the setting.
 */

type Listener = (event: MediaQueryListEvent) => void;

let reducedMotion = false;
const listeners = new Set<{ query: MediaQueryList; listener: Listener }>();

const matchesQuery = (query: string) =>
  /prefers-reduced-motion/.test(query) ? reducedMotion && !/no-preference/.test(query) : false;

export function installMatchMedia() {
  window.matchMedia = (query: string): MediaQueryList => {
    const list = {
      media: query,
      get matches() {
        return matchesQuery(query);
      },
      onchange: null,
      addEventListener: (_: string, listener: Listener) => listeners.add({ query: list, listener }),
      removeEventListener: (_: string, listener: Listener) => {
        for (const entry of listeners) if (entry.listener === listener) listeners.delete(entry);
      },
      addListener: (listener: Listener) => listeners.add({ query: list, listener }),
      removeListener: (listener: Listener) => {
        for (const entry of listeners) if (entry.listener === listener) listeners.delete(entry);
      },
      dispatchEvent: () => true,
    } as unknown as MediaQueryList;
    return list;
  };
}

export function setReducedMotion(value: boolean) {
  reducedMotion = value;
  for (const { query, listener } of listeners) {
    listener({ matches: query.matches, media: query.media } as MediaQueryListEvent);
  }
}

/** An IntersectionObserver that reports every observed element as fully in view. */
export function installIntersectionObserver() {
  class InViewObserver {
    constructor(private callback: IntersectionObserverCallback) {}
    observe(target: Element) {
      const entry = {
        target,
        isIntersecting: true,
        intersectionRatio: 1,
        boundingClientRect: target.getBoundingClientRect(),
        intersectionRect: target.getBoundingClientRect(),
        rootBounds: null,
        time: 0,
      } as IntersectionObserverEntry;
      queueMicrotask(() => this.callback([entry], this as unknown as IntersectionObserver));
    }
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
    root = null;
    rootMargin = "";
    thresholds = [];
  }
  window.IntersectionObserver = InViewObserver as unknown as typeof IntersectionObserver;
}
