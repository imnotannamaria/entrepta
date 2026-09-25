"use client";

import * as React from "react";

/** Namespaced per param, so two filters on one page never wake each other. */
const eventName = (param: string) => `urlfilter:${param}`;

/** Nothing is filtered in the server render, which keeps every item in the HTML. */
function serverSnapshot(): null {
  return null;
}

/**
 * A filter kept in the URL query, such as `?type=film`.
 *
 * `useSyncExternalStore` instead of a router's search params hook: in a
 * statically rendered page those suspend during prerender, so the filtered
 * items would be missing from the HTML. The cost is one frame of the full list
 * when a filtered URL is opened directly.
 *
 * Writing uses `pushState`, so the back button undoes a filter, and it keeps
 * every other param already in the URL.
 *
 * @param param   the query param, such as `"type"`
 * @param allowed the values it may take; anything else reads as no filter
 * @param path    the path to write to. Defaults to the current path
 */
function useUrlFilter<T extends string>(
  param: string,
  allowed: readonly T[],
  path?: string
): [T | null, (next: T | null) => void] {
  const event = eventName(param);

  const subscribe = React.useCallback(
    (onChange: () => void) => {
      window.addEventListener("popstate", onChange);
      window.addEventListener(event, onChange);
      return () => {
        window.removeEventListener("popstate", onChange);
        window.removeEventListener(event, onChange);
      };
    },
    [event]
  );

  const read = React.useCallback((): T | null => {
    const value = new URLSearchParams(window.location.search).get(param);
    return value && (allowed as readonly string[]).includes(value) ? (value as T) : null;
  }, [param, allowed]);

  const active = React.useSyncExternalStore(subscribe, read, serverSnapshot);

  const write = React.useCallback(
    (next: T | null) => {
      const params = new URLSearchParams(window.location.search);
      if (next) params.set(param, next);
      else params.delete(param);
      const query = params.toString();
      const base = path ?? window.location.pathname;
      window.history.pushState(null, "", query ? `${base}?${query}` : base);
      window.dispatchEvent(new Event(event));
    },
    [path, param, event]
  );

  return [active, write];
}

export { useUrlFilter };
